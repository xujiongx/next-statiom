
## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## 数据库
edgedb

### 安装与初始化
1. 安装 EdgeDB CLI:
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.edgedb.com | sh
```


edgedb cloud login
edgedb migration create -I vercel-dNh6muuUJVKh5BMUia7wywwj/edgedb-yellow-tree
edgedb migrate -I vercel-dNh6muuUJVKh5BMUia7wywwj/edgedb-yellow-tree


域名
- https://dash.cloudflare.com/sign-up 代理

AI
- https://console.mistral.ai/api-keys


## 免费API
- https://github.com/public-apis/public-apis?tab=readme-ov-file#art--design


## 社区功能开发
基本页面
首页

## 数据表说明
1. Post (帖子)
   
   - 存储用户发布的帖子内容
   - 包含标题、内容、创建时间、作者等基本信息
   - 关联评论和点赞信息
   - 支持标签功能和状态管理
2. Comment (评论)
   
   - 存储用户对帖子的评论
   - 支持嵌套评论（回复评论）
   - 包含评论内容、作者、创建时间等信息
   - 支持评论点赞功能
3. Activity (用户活动)
   
   - 记录用户在社区的各种活动
   - 包括发帖、评论、点赞、关注等活动类型
   - 用于生成用户动态和活动流
4. Notification (通知)
   
   - 存储用户接收的各类通知
   - 包括点赞、评论、@提及、关注等通知类型
   - 支持已读/未读状态管理
5. Topic (话题)
   
   - 管理社区的话题分类
   - 包含话题名称、描述、图标等信息
   - 关联相关帖子，统计帖子数量
6. UserFollow (用户关注)
   
   - 管理用户之间的关注关系
   - 记录关注者和被关注者
   - 支持关注时间记录





   开发流程
   - 需求分析
   - 数据库设计
   - 前端页面设计
   - 后端接口开发
   - 测试与调试
   - 上线部署



   微信开放平台
   - https://open.weixin.qq.com/cgi-bin/applist?t=manage/list&page=0&num=20&openapptype=512&token=4665e1236c323ac781bb706bea69d7fcdd186c45&lang=zh_CN
   - 要花300块钱，还要企业账号，域名还要备案才能使用，坑爹