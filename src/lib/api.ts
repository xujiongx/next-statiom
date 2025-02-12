import { NextResponse } from 'next/server';
import { handleApiError } from './error';

export async function withErrorHandler(handler: () => Promise<Response>) {
  try {
    return await handler();
  } catch (error) {
    const { code, message, status } = handleApiError(error);
    return NextResponse.json({ code, message }, { status });
  }
}

export function withCache(seconds: number) {
  return {
    'Cache-Control': `public, s-maxage=${seconds}, stale-while-revalidate=${
      seconds * 2
    }`,
    'CDN-Cache-Control': `public, s-maxage=${seconds}`,
    'Vercel-CDN-Cache-Control': `public, s-maxage=${seconds}`,
  };
}
