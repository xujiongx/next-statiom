import { NextResponse } from 'next/server';
import { withErrorHandler } from '@/lib/api';
import { Mistral, SDKOptions } from '@mistralai/mistralai';
import { config } from '@/config';

const mistralClient = new Mistral(process.env.MISTRAL_API_KEY as SDKOptions);

export const POST = (request: Request) => {
  return withErrorHandler(async () => {
    const body = await request.json();
    const { text, from, to } = body;

    if (!text || !from || !to) {
      return NextResponse.json(
        { code: 400, message: '缺少必要参数' },
        { status: 400 }
      );
    }

    const prompt = `请将以下文本从${from}翻译成${to}：\n\n${text}，只返回翻译后的结果，不要返回其他信息。`;
    const response = await mistralClient.chat.complete({
      model: config.mistral.model,
      messages: [{ role: 'user', content: prompt }],
      stream: false,
    });

    return NextResponse.json({
      code: 0,
      data: {
        text,
        from,
        to,
        result: response.choices?.[0].message.content,
      },
    });
  });
};