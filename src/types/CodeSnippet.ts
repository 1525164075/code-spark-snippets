
// 定义 CodeSnippet 的 TypeScript 接口和 Mongoose Schema
export interface ICodeFile {
  filename: string;
  language: string;
  content: string;
}

export interface ICodeSnippet {
  _id?: string;
  title: string;
  files: ICodeFile[];
  description: string;
  tags: string[];
  visibility: 'public' | 'private';
  password?: string;
  expiresAt?: Date;
  createdAt: Date;
}

// Mongoose Schema 定义（用于实际后端实现时参考）
export const CodeSnippetSchema = {
  title: {
    type: String,
    required: true,
    trim: true
  },
  files: [{
    filename: {
      type: String,
      default: '代码一'
    },
    language: {
      type: String,
      default: 'javascript'
    },
    content: {
      type: String,
      default: ''
    }
  }],
  description: {
    type: String,
    default: ''
  },
  tags: [{
    type: String,
    trim: true
  }],
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'public'
  },
  password: {
    type: String,
    required: function() {
      return this.visibility === 'private';
    }
  },
  expiresAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
};

// API 端点定义
export interface CreateSnippetRequest {
  title: string;
  files: ICodeFile[];
  description: string;
  tags: string[];
  visibility: 'public' | 'private';
  password?: string;
  expiresAt?: Date;
}

export interface CreateSnippetResponse {
  id: string;
  url: string;
}

export interface VerifyPasswordRequest {
  password: string;
}

export interface VerifyPasswordResponse {
  access: 'granted' | 'denied';
  data?: ICodeSnippet;
  message?: string;
}
