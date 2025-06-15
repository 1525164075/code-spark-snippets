
import { ICodeSnippet, CreateSnippetRequest } from '../types/CodeSnippet';

// 内存数据存储，模拟数据库
class MockDataStore {
  private snippets: ICodeSnippet[] = [
    {
      _id: 'snippet-1',
      title: 'React Hook 实用工具',
      files: [
        {
          filename: 'useLocalStorage.js',
          language: 'javascript',
          content: 'const useLocalStorage = (key, initialValue) => {\n  const [storedValue, setStoredValue] = useState(() => {\n    try {\n      const item = window.localStorage.getItem(key);\n      return item ? JSON.parse(item) : initialValue;\n    } catch (error) {\n      console.log(error);\n      return initialValue;\n    }\n  });\n\n  const setValue = (value) => {\n    try {\n      setStoredValue(value);\n      window.localStorage.setItem(key, JSON.stringify(value));\n    } catch (error) {\n      console.log(error);\n    }\n  };\n\n  return [storedValue, setValue];\n};'
        }
      ],
      description: '一个用于管理 localStorage 的自定义 React Hook，支持 JSON 序列化和错误处理',
      tags: ['react', 'hooks', 'utils'],
      visibility: 'public',
      createdAt: new Date('2024-01-15')
    },
    {
      _id: 'snippet-2',
      title: 'CSS 动画库',
      files: [
        {
          filename: 'animations.css',
          language: 'css',
          content: '@keyframes fadeIn {\n  from {\n    opacity: 0;\n    transform: translateY(20px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n\n@keyframes slideIn {\n  from {\n    transform: translateX(-100%);\n  }\n  to {\n    transform: translateX(0);\n  }\n}\n\n.fade-in {\n  animation: fadeIn 0.3s ease-out;\n}\n\n.slide-in {\n  animation: slideIn 0.5s ease-out;\n}'
        }
      ],
      description: '常用的 CSS 动画效果合集，包含淡入、滑入等效果',
      tags: ['css', 'animation', 'ui'],
      visibility: 'public',
      createdAt: new Date('2024-01-14')
    },
    {
      _id: 'snippet-3',
      title: 'TypeScript 工具类型',
      files: [
        {
          filename: 'utils.ts',
          language: 'typescript',
          content: '// 可选属性类型\ntype Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;\n\n// 深度只读类型\ntype DeepReadonly<T> = {\n  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];\n};\n\n// 提取函数返回类型\ntype ReturnTypeOf<T> = T extends (...args: any[]) => infer R ? R : never;\n\n// 使用示例\ninterface User {\n  id: string;\n  name: string;\n  email: string;\n}\n\n// 让 email 变为可选\ntype UserWithOptionalEmail = Optional<User, "email">;'
        }
      ],
      description: '实用的 TypeScript 工具类型定义，提高类型安全性',
      tags: ['typescript', 'types', 'utils'],
      visibility: 'public',
      createdAt: new Date('2024-01-13')
    },
    {
      _id: 'snippet-4',
      title: 'API 请求封装',
      files: [
        {
          filename: 'api.js',
          language: 'javascript',
          content: 'class ApiClient {\n  constructor(baseURL) {\n    this.baseURL = baseURL;\n    this.headers = {\n      "Content-Type": "application/json",\n    };\n  }\n\n  async request(endpoint, options = {}) {\n    const url = `${this.baseURL}${endpoint}`;\n    const config = {\n      headers: this.headers,\n      ...options,\n    };\n\n    try {\n      const response = await fetch(url, config);\n      if (!response.ok) {\n        throw new Error(`HTTP error! status: ${response.status}`);\n      }\n      return await response.json();\n    } catch (error) {\n      console.error("API request failed:", error);\n      throw error;\n    }\n  }\n\n  get(endpoint) {\n    return this.request(endpoint, { method: "GET" });\n  }\n\n  post(endpoint, data) {\n    return this.request(endpoint, {\n      method: "POST",\n      body: JSON.stringify(data),\n    });\n  }\n}'
        }
      ],
      description: '简单的 API 请求封装类，支持 GET、POST 等方法',
      tags: ['javascript', 'api', 'fetch'],
      visibility: 'public',
      createdAt: new Date('2024-01-12')
    },
    {
      _id: 'snippet-5',
      title: '响应式设计 Mixins',
      files: [
        {
          filename: 'mixins.scss',
          language: 'scss',
          content: '// 响应式断点\n$breakpoints: (\n  mobile: 480px,\n  tablet: 768px,\n  desktop: 1024px,\n  large: 1200px\n);\n\n// 媒体查询 mixin\n@mixin respond-to($breakpoint) {\n  @if map-has-key($breakpoints, $breakpoint) {\n    @media (min-width: map-get($breakpoints, $breakpoint)) {\n      @content;\n    }\n  } @else {\n    @warn "Unfortunately, no value could be retrieved from `#{$breakpoint}`. "\n        + "Available breakpoints are: #{map-keys($breakpoints)}.";\n  }\n}\n\n// 使用示例\n.container {\n  width: 100%;\n  padding: 0 16px;\n  \n  @include respond-to(tablet) {\n    padding: 0 24px;\n  }\n  \n  @include respond-to(desktop) {\n    max-width: 1200px;\n    margin: 0 auto;\n  }\n}'
        }
      ],
      description: 'SCSS 响应式设计混入，简化媒体查询的使用',
      tags: ['scss', 'responsive', 'css'],
      visibility: 'public',
      createdAt: new Date('2024-01-11')
    }
  ];

  // 获取所有代码片段
  async getAllSnippets(): Promise<ICodeSnippet[]> {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('MockDataStore: 获取代码片段列表，总数:', this.snippets.length);
    return [...this.snippets];
  }

  // 创建新的代码片段
  async createSnippet(data: CreateSnippetRequest): Promise<ICodeSnippet> {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newSnippet: ICodeSnippet = {
      _id: 'snippet-' + Date.now(),
      title: data.title,
      files: data.files,
      description: data.description,
      tags: data.tags,
      visibility: data.visibility,
      createdAt: new Date()
    };

    // 添加到数据存储的开头（最新的在前面）
    this.snippets.unshift(newSnippet);
    
    console.log('MockDataStore: 创建新代码片段:', newSnippet.title, '当前总数:', this.snippets.length);
    return newSnippet;
  }

  // 根据ID获取代码片段
  async getSnippetById(id: string): Promise<ICodeSnippet | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const snippet = this.snippets.find(s => s._id === id);
    return snippet || null;
  }
}

// 导出单例实例
export const mockDataStore = new MockDataStore();
