import { NextResponse } from 'next/server';
import { withErrorHandler } from '@/lib/api';

import { createClient } from '@vercel/edge-config';

const config = createClient(process.env.EDGE_CONFIG);

export const GET = () => {
  return withErrorHandler(async () => {
     const messages = await config.get('messages');
    return NextResponse.json({
      code: 0,
      data: messages,
    });
  });
};
