import { NextResponse } from 'next/server';
import { withErrorHandler } from '@/lib/api';
import { fetchWithRetry } from '@/lib/fetch';

export const POST = (request: Request) => {
  return withErrorHandler(async () => {
    try {
      const body = await request.json();
      const { prompt, duration = 8 } = body;

      if (!prompt) {
        return NextResponse.json(
          { code: 400, message: '缺少必要参数' },
          { status: 400 }
        );
      }

      // Try using a different model from Hugging Face that might be free
      const response = await fetchWithRetry(
        'https://api-inference.huggingface.co/models/facebook/musicgen-small',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              max_duration_s: duration,
            },
          }),
        }
      );

      console.log('🤛 Hugging Face response status:', response.status);

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const audioBuffer = await response.arrayBuffer();
      const base64Audio = Buffer.from(audioBuffer).toString('base64');
      const dataUrl = `data:audio/wav;base64,${base64Audio}`;

      return NextResponse.json({
        code: 0,
        data: {
          url: dataUrl,
          prompt,
        },
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : '音乐生成失败，请稍后重试';
      console.error('Music generation error:', error);

      return NextResponse.json(
        {
          code: 500,
          message: errorMessage,
        },
        { status: 500 }
      );
    }
  });
};
