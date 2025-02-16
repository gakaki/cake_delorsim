
export function getApiUrl(endpoint = ''): string {
    const nodeEnv = process.env.NODE_ENV as string;
    const base =
      nodeEnv === 'production'
        ? 'https://delorsim-server.koyeb.app/goods'
        : 'http://localhost:15001/goods';
    return `${base}${endpoint}`;
  }