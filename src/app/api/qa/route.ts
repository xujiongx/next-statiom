import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// 创建 OpenRouter 客户端
const openRouterClient = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPEN_ROUTER_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { prompt, model = 'deepseek/deepseek-chat:free' } = await req.json();
    
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { code: 400, message: '提示词不能为空' },
        { status: 400 }
      );
    }

    // 直接调用AI模型获取回复
    const completion = await openRouterClient.chat.completions.create({
      model,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const response = completion.choices[0]?.message?.content || '抱歉，无法生成回复';

    return NextResponse.json({
      code: 0,
      data: {
        prompt,
        response,
        model,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('QA API Error:', error);
    
    // 处理OpenAI API错误
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { code: 401, message: 'API密钥无效' },
          { status: 401 }
        );
      }
      
      if (error.message.includes('rate limit')) {
        return NextResponse.json(
          { code: 429, message: '请求频率过高，请稍后重试' },
          { status: 429 }
        );
      }
    }
    
    return NextResponse.json(
      { code: 500, message: '服务器内部错误' },
      { status: 500 }
    );
  }
}

// 支持GET请求查看接口信息
export async function GET() {
  return NextResponse.json({
    code: 0,
    message: '问答接口',
    usage: {
      method: 'POST',
      endpoint: '/api/qa',
      body: {
        prompt: 'string (必需) - 用户的提示词或问题',
        model: 'string (可选) - AI模型，默认为 deepseek/deepseek-chat:free'
      },
      example: {
        prompt: '请介绍一下人工智能的发展历史',
        model: 'deepseek/deepseek-chat:free'
      }
    }
  });
}