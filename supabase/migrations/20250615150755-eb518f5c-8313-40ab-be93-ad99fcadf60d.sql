
-- 修复 share_id 字段的默认值，使用标准的 base64 编码而不是 base64url
ALTER TABLE public.code_snippets 
ALTER COLUMN share_id SET DEFAULT encode(gen_random_bytes(8), 'base64');

-- 更新现有记录中可能有问题的 share_id
UPDATE public.code_snippets 
SET share_id = encode(gen_random_bytes(8), 'base64')
WHERE share_id IS NULL OR share_id = '';
