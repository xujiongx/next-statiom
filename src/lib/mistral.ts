import { HTTPClient, Mistral, type Fetcher } from '@mistralai/mistralai';
import nodeFetch, { type RequestInit as NodeFetchRequestInit } from 'node-fetch';
import { HttpsProxyAgent } from 'https-proxy-agent';

async function proxyFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const agent = new HttpsProxyAgent(process.env.HTTPS_PROXY!);

  let url: string;
  let options: NodeFetchRequestInit;

  if (input instanceof Request) {
    const headers: Record<string, string> = {};
    input.headers.forEach((value, key) => {
      headers[key] = value;
    });

    url = input.url;
    options = {
      method: input.method,
      headers,
      body: input.body ? Buffer.from(await input.arrayBuffer()) : undefined,
      redirect: input.redirect as NodeFetchRequestInit['redirect'],
      signal: init?.signal ?? input.signal,
      agent,
    };
  } else {
    url = input instanceof URL ? input.toString() : String(input);
    options = {
      ...(init as NodeFetchRequestInit),
      agent,
    };
  }

  const response = await nodeFetch(url, options);
  const body = Buffer.from(await response.arrayBuffer());
  const headers = new Headers();

  response.headers.forEach((value, key) => {
    headers.set(key, value);
  });

  return new Response(body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function createProxyHttpClient(): HTTPClient | undefined {
  if (process.env.NODE_ENV !== 'development' || !process.env.HTTPS_PROXY) {
    return undefined;
  }

  const fetcher: Fetcher = (input, init) => proxyFetch(input, init);

  return new HTTPClient({ fetcher });
}

const httpClient = createProxyHttpClient();

export const mistralClient = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY,
  ...(httpClient ? { httpClient } : {}),
});
