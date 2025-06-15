
// Koa Router 路由定义示例（用于后端实现参考）
import Router from 'koa-router';
import { CreateSnippetRequest, CreateSnippetResponse, VerifyPasswordRequest, VerifyPasswordResponse } from './CodeSnippet';

const router = new Router({ prefix: '/api/snippets' });

// POST / - 创建新代码片段
router.post('/', async (ctx) => {
  const data: CreateSnippetRequest = ctx.request.body;
  
  // 实现逻辑：
  // 1. 验证请求数据
  // 2. 创建新的 CodeSnippet 文档
  // 3. 保存到数据库
  // 4. 返回响应
  
  const response: CreateSnippetResponse = {
    id: 'generated_snippet_id',
    url: `/share/generated_snippet_id`
  };
  
  ctx.status = 201;
  ctx.body = response;
});

// GET /:id - 获取单个代码片段
router.get('/:id', async (ctx) => {
  const { id } = ctx.params;
  
  // 实现逻辑：
  // 1. 根据 ID 查找代码片段
  // 2. 检查可见性和过期时间
  // 3. 返回数据或要求密码验证
  
  ctx.body = { /* snippet data */ };
});

// PUT /:id - 更新代码片段
router.put('/:id', async (ctx) => {
  const { id } = ctx.params;
  const data: Partial<CreateSnippetRequest> = ctx.request.body;
  
  // 实现逻辑：
  // 1. 查找并验证权限
  // 2. 更新代码片段
  // 3. 返回更新后的数据
  
  ctx.body = { /* updated snippet data */ };
});

// POST /:id/verify - 验证私有片段密码
router.post('/:id/verify', async (ctx) => {
  const { id } = ctx.params;
  const { password }: VerifyPasswordRequest = ctx.request.body;
  
  // 实现逻辑：
  // 1. 查找代码片段
  // 2. 验证密码
  // 3. 返回验证结果
  
  const response: VerifyPasswordResponse = {
    access: 'granted', // or 'denied'
    data: {/* snippet data if granted */}
  };
  
  ctx.body = response;
});

export default router;
