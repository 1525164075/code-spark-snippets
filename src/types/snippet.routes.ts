
// API 路由定义和接口类型
import { ICodeSnippet, CreateSnippetRequest, CreateSnippetResponse } from './CodeSnippet';

// API 端点路径常量
export const API_ENDPOINTS = {
  SNIPPETS: '/api/snippets',
  SNIPPET_BY_ID: (id: string) => `/api/snippets/${id}`,
  VERIFY_PASSWORD: (id: string) => `/api/snippets/${id}/verify`,
} as const;

// 路由处理器接口定义
export interface SnippetRouteHandlers {
  // POST /api/snippets - 创建新的代码片段
  createSnippet: (request: CreateSnippetRequest) => Promise<CreateSnippetResponse>;
  
  // GET /api/snippets/:id - 获取单个代码片段
  getSnippetById: (id: string) => Promise<ICodeSnippet>;
  
  // PUT /api/snippets/:id - 更新代码片段
  updateSnippet: (id: string, request: Partial<CreateSnippetRequest>) => Promise<ICodeSnippet>;
  
  // POST /api/snippets/:id/verify - 验证私有片段的密码
  verifyPassword: (id: string, password: string) => Promise<{
    access: 'granted' | 'denied';
    data?: ICodeSnippet;
    message?: string;
  }>;
  
  // DELETE /api/snippets/:id - 删除代码片段
  deleteSnippet: (id: string) => Promise<{ success: boolean }>;
}

// HTTP 状态码
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// 错误响应接口
export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}

// 成功响应接口
export interface SuccessResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

// 模拟的后端实现示例（仅供参考）
export class MockSnippetService implements SnippetRouteHandlers {
  private snippets: Map<string, ICodeSnippet> = new Map();

  async createSnippet(request: CreateSnippetRequest): Promise<CreateSnippetResponse> {
    const id = 'snippet_' + Date.now();
    const now = new Date();
    const snippet: ICodeSnippet = {
      _id: id,
      ...request,
      createdAt: now,
      updatedAt: now
    };
    
    this.snippets.set(id, snippet);
    
    return {
      id,
      url: `/share/${id}`
    };
  }

  async getSnippetById(id: string): Promise<ICodeSnippet> {
    const snippet = this.snippets.get(id);
    if (!snippet) {
      throw new Error('Snippet not found');
    }
    return snippet;
  }

  async updateSnippet(id: string, request: Partial<CreateSnippetRequest>): Promise<ICodeSnippet> {
    const snippet = this.snippets.get(id);
    if (!snippet) {
      throw new Error('Snippet not found');
    }
    
    const updatedSnippet = { 
      ...snippet, 
      ...request, 
      updatedAt: new Date() 
    };
    this.snippets.set(id, updatedSnippet);
    return updatedSnippet;
  }

  async verifyPassword(id: string, password: string) {
    const snippet = this.snippets.get(id);
    if (!snippet) {
      throw new Error('Snippet not found');
    }
    
    if (snippet.visibility === 'private' && snippet.password === password) {
      return {
        access: 'granted' as const,
        data: snippet
      };
    }
    
    return {
      access: 'denied' as const,
      message: '密码错误'
    };
  }

  async deleteSnippet(id: string): Promise<{ success: boolean }> {
    const deleted = this.snippets.delete(id);
    return { success: deleted };
  }
}
