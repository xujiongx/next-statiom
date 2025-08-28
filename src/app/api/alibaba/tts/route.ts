import { NextRequest, NextResponse } from 'next/server';

const ALIBABA_TTS_CONFIG = {
  endpoint: process.env.ALIBABA_TTS_ENDPOINT || 'https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation',
  apiKey: process.env.ALIBABA_API_KEY,
  enableMockMode: process.env.ALIBABA_TTS_MOCK_MODE === 'true',
};

interface TTSRequest {
  text: string;
  voice: string;
}

interface TTSResponse {
  output: {
    finish_reason: string;
    audio: {
      expires_at: number;
      data: string;
      id: string;
      url: string;
    };
  };
  usage: {
    input_tokens: number;
    output_tokens: number;
    total_tokens: number;
  };
  request_id?: string;
}

const VOICE_OPTIONS: Record<string, string> = {
  'Chelsie': 'Chelsie',
  'Anna': 'Anna',
  'Bella': 'Bella',
  'Carrie': 'Carrie',
  'Dora': 'Dora',
  'Eva': 'Eva',
  'Fiona': 'Fiona',
  'Grace': 'Grace',
  'Helen': 'Helen',
  'Iris': 'Iris',
  'Jenny': 'Jenny',
  'Kate': 'Kate',
  'Luna': 'Luna',
  'Mia': 'Mia',
  'Nina': 'Nina',
  'Olivia': 'Olivia',
  'Paula': 'Paula',
  'Quinn': 'Quinn',
  'Ruby': 'Ruby',
  'Sara': 'Sara',
  'Tina': 'Tina',
  'Uma': 'Uma',
  'Vera': 'Vera',
  'Wendy': 'Wendy',
  'Xenia': 'Xenia',
  'Yuna': 'Yuna',
  'Zara': 'Zara'
};

export async function POST(request: NextRequest) {
  try {
    const body: TTSRequest = await request.json();
    const { text, voice = 'Chelsie' } = body;

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: '文本内容不能为空' },
        { status: 400 }
      );
    }

    if (text.length > 500) {
      return NextResponse.json(
        { error: '文本长度不能超过500字符' },
        { status: 400 }
      );
    }

    // 模拟模式
    if (ALIBABA_TTS_CONFIG.enableMockMode || !ALIBABA_TTS_CONFIG.apiKey) {
      console.log('使用模拟模式生成音频...');
      
      const mockAudioData = Buffer.from([
        0xFF, 0xFB, 0x90, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        ...new Array(1000).fill(0)
      ]);

      return new NextResponse(mockAudioData, {
        status: 200,
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Length': mockAudioData.length.toString(),
          'Cache-Control': 'no-cache',
          'X-Mock-Mode': 'true',
          'X-Request-ID': 'mock-' + Date.now(),
        },
      });
    }

    if (!ALIBABA_TTS_CONFIG.apiKey) {
      return NextResponse.json(
        { 
          error: '阿里百炼API密钥未配置',
          solution: '请在环境变量中设置ALIBABA_API_KEY，或设置ALIBABA_TTS_MOCK_MODE=true使用模拟模式'
        },
        { status: 500 }
      );
    }

    const voiceOption = VOICE_OPTIONS[voice] || 'Chelsie';

    console.log('开始调用阿里百炼TTS API:', {
      text: text.substring(0, 50) + (text.length > 50 ? '...' : ''),
      voice: voiceOption,
      endpoint: ALIBABA_TTS_CONFIG.endpoint,
    });

    const alibabaPayload = {
      model: 'qwen-tts',
      input: {
        text: text.trim(),
        voice: voiceOption
      }
    };

    console.log('API请求payload:', JSON.stringify(alibabaPayload, null, 2));

    const response = await fetch(ALIBABA_TTS_CONFIG.endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ALIBABA_TTS_CONFIG.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(alibabaPayload),
    });

    const responseText = await response.text();
    console.log('阿里百炼API原始响应:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      body: responseText.substring(0, 500)
    });

    if (!response.ok) {
      console.error('阿里百炼API错误:', {
        status: response.status,
        statusText: response.statusText,
        error: responseText
      });

      let errorMessage = '阿里百炼API调用失败';
      try {
        const errorData = JSON.parse(responseText);
        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }

      if (response.status === 403) {
        return NextResponse.json(
          { 
            error: '模型访问被拒绝',
            details: '请检查阿里百炼控制台模型开通状态',
            mockMode: '可设置环境变量 ALIBABA_TTS_MOCK_MODE=true 使用模拟模式进行测试',
            rawError: errorMessage
          },
          { status: 403 }
        );
      }

      return NextResponse.json(
        { 
          error: `API错误: ${response.status}`,
          details: errorMessage
        },
        { status: response.status }
      );
    }

    const result: TTSResponse = JSON.parse(responseText);
    console.log('阿里百炼API响应:', {
      request_id: result.request_id,
      usage: result.usage,
      has_audio: !!result.output.audio,
      has_audio_url: !!result.output.audio?.url,
      has_audio_data: !!result.output.audio?.data,
      audio_type: typeof result.output.audio
    });

    let audioBuffer: Buffer;

    // 检查audio字段的类型和内容
    if (result.output.audio && typeof result.output.audio === 'object') {
      // 新的qwen-tts格式：audio是对象，包含url和data字段
      if (result.output.audio.url) {
        console.log('下载音频文件:', result.output.audio.url);
        const audioResponse = await fetch(result.output.audio.url);
        if (!audioResponse.ok) {
          throw new Error('无法下载生成的音频文件');
        }
        audioBuffer = Buffer.from(await audioResponse.arrayBuffer());
      } else if (result.output.audio.data && result.output.audio.data.length > 0) {
        console.log('解码base64音频数据');
        audioBuffer = Buffer.from(result.output.audio.data, 'base64');
      } else {
        throw new Error('音频对象中没有找到有效的url或data字段');
      }
    } else if (typeof result.output.audio === 'string') {
      // 旧格式：audio直接是base64字符串
      console.log('处理旧格式base64音频数据');
      audioBuffer = Buffer.from(result.output.audio, 'base64');
    } else {
      throw new Error('API响应中没有找到有效的音频数据');
    }

    console.log('音频数据处理完成，大小:', audioBuffer.length, 'bytes');

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/wav',
        'Content-Length': audioBuffer.length.toString(),
        'Cache-Control': 'no-cache',
        'X-Request-ID': result.request_id || 'unknown',
        'X-Usage-Input-Tokens': result.usage.input_tokens.toString(),
        'X-Usage-Output-Tokens': result.usage.output_tokens.toString(),
      },
    });

  } catch (error) {
    console.error('TTS API处理错误:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : '语音合成过程中发生未知错误',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}