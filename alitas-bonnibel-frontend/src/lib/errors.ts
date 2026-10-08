import axios from 'axios';
export function errorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const message: unknown = error.response?.data?.message;
    if (typeof message === 'string') return message;
  }
  return error instanceof Error ? error.message : fallback;
}
