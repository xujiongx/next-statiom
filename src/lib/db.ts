import { createClient } from "edgedb";

if (!process.env.EDGEDB_INSTANCE || !process.env.EDGEDB_SECRET_KEY) {
  throw new Error('EdgeDB 配置缺失');
}

export const client = createClient({
  dsn: process.env.EDGEDB_INSTANCE,
  secretKey: process.env.EDGEDB_SECRET_KEY,
  tlsSecurity: "strict",
  timeout: 10000,
});

// 测试连接
client.ensureConnected().then(() => {
  console.log('EdgeDB 连接成功');
}).catch((err) => {
  console.error('EdgeDB 连接失败:', err);
  // 添加更详细的错误信息
  if (err.message) {
    console.error('错误详情:', err.message);
  }
});