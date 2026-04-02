export interface RequestOptions {
  timeoutMs?: number;
  retries?: number;
}

interface HttpErrorPayload {
  status: number;
  message: string;
}

export class HttpError extends Error {
  status: number;

  constructor(payload: HttpErrorPayload) {
    super(payload.message);
    this.name = 'HttpError';
    this.status = payload.status;
  }
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

function isRetriableStatus(status: number): boolean {
  return status === 408 || status === 429 || (status >= 500 && status < 600);
}

export async function requestJson<T>(
  url: string,
  init: RequestInit,
  options?: RequestOptions
): Promise<T> {
  const timeoutMs = options?.timeoutMs ?? 12000;
  const retries = options?.retries ?? 2;

  let attempt = 0;
  while (attempt <= retries) {
    try {
      const response = await fetchWithTimeout(url, init, timeoutMs);
      const text = await response.text();
      const payload: unknown = text ? JSON.parse(text) : {};

      if (!response.ok) {
        const message =
          typeof payload === 'object' &&
          payload !== null &&
          'message' in payload &&
          typeof (payload as { message: unknown }).message === 'string'
            ? ((payload as { message: string }).message ?? `HTTP ${response.status}`)
            : `HTTP ${response.status}`;

        if (attempt < retries && isRetriableStatus(response.status)) {
          attempt += 1;
          continue;
        }

        throw new HttpError({ status: response.status, message });
      }

      return payload as T;
    } catch (error) {
      if (attempt >= retries) {
        throw error instanceof Error ? error : new Error('Network request failed.');
      }
      attempt += 1;
    }
  }

  throw new Error('Network request failed after retries.');
}
