export const config = {
  api: {
    timeout: 30000,
    retries: 3,
  },
  mistral: {
    model: 'mistral-small-latest',
    maxMessages: 20,
  },
  storage: {
    prefix: 'station_',
  },
  cache: {
    conversation: 60, // 会话列表缓存时间（秒）
    message: 300, // 消息缓存时间（秒）
    translation: 3600, // 翻译结果缓存时间（秒）
  },
};

export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';