const BASE_URL = '/api';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function get<T>(path: string, params?: Record<string, string | undefined>): Promise<T> {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value) query.set(key, value);
  }
  const url = `${BASE_URL}${path}${query.size ? `?${query}` : ''}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new ApiError(response.status, `Request failed: ${response.status}`);
  }
  return (await response.json()) as T;
}
