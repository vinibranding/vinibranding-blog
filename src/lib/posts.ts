import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.resolve(process.cwd(), 'src/posts');
const dataDirectory = path.resolve(process.cwd(), 'src/data/posts');

export interface PostData {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  category: string;
  imageUrl: string;
  imageCaption?: string;
  author: string;
  contentHtml?: string;
  status?: string;
  slug?: string;
}

// Vercel 환경에서는 파일 시스템 쓰기가 제한적이므로 메모리 캐시를 사용합니다.
const memoryPosts: Map<string, PostData> = new Map();

export function getSortedPostsData(): PostData[] {
  let allPostsData: PostData[] = [];

  // 1. Read Markdown files (Static)
  try {
    if (fs.existsSync(postsDirectory)) {
      const fileNames = fs.readdirSync(postsDirectory);
      const mdPosts = fileNames
        .filter((fileName) => fileName.endsWith('.md'))
        .map((fileName) => {
          const id = fileName.replace(/\.md$/, '');
          const fullPath = path.join(postsDirectory, fileName);
          const fileContents = fs.readFileSync(fullPath, 'utf8');
          const matterResult = matter(fileContents);

          return {
            id,
            slug: id,
            ...(matterResult.data as any),
          };
        });
      allPostsData = [...allPostsData, ...mdPosts];
    }
  } catch (e) {
    console.warn('[Storage] Could not read markdown directory:', e);
  }

  // 2. Read JSON files (Static)
  try {
    if (fs.existsSync(dataDirectory)) {
      const fileNames = fs.readdirSync(dataDirectory);
      const jsonPosts = fileNames
        .filter((fileName) => fileName.endsWith('.json'))
        .map((fileName) => {
          const id = fileName.replace(/\.json$/, '');
          const fullPath = path.join(dataDirectory, fileName);
          const fileContents = fs.readFileSync(fullPath, 'utf8');
          const data = JSON.parse(fileContents);
          return {
            id,
            ...data,
          };
        });
      allPostsData = [...allPostsData, ...jsonPosts];
    }
  } catch (e) {
    console.warn('[Storage] Could not read data directory:', e);
  }

  // 3. Add Memory Posts (Dynamic)
  allPostsData = [...allPostsData, ...Array.from(memoryPosts.values())];

  // Remove duplicates by ID (Memory posts override static ones)
  const uniquePosts = Array.from(new Map(allPostsData.map(p => [p.id, p])).values());

  // Sort by date
  return uniquePosts.sort((a, b) => {
    if (a.date < b.date) return 1;
    return -1;
  });
}

export async function getPostData(id: string): Promise<PostData | null> {
  // Try Memory first
  if (memoryPosts.has(id)) {
    return memoryPosts.get(id) || null;
  }

  // Try JSON
  const jsonPath = path.join(dataDirectory, `${id}.json`);
  try {
    if (fs.existsSync(jsonPath)) {
      const fileContents = fs.readFileSync(jsonPath, 'utf8');
      return JSON.parse(fileContents);
    }
  } catch (e) {}

  // Try Markdown
  const mdPath = path.join(postsDirectory, `${id}.md`);
  try {
    if (fs.existsSync(mdPath)) {
      const fileContents = fs.readFileSync(mdPath, 'utf8');
      const matterResult = matter(fileContents);

      const processedContent = await remark()
        .use(html)
        .process(matterResult.content);
      const contentHtml = processedContent.toString();

      return {
        id,
        contentHtml,
        ...(matterResult.data as any),
      };
    }
  } catch (e) {}

  return null;
}

export function savePostData(id: string, data: Partial<PostData>) {
  const post = { id, ...data } as PostData;
  
  // 1. Save to Memory (Always works)
  memoryPosts.set(id, post);
  console.log('[Storage] Saved to memory:', id);

  // 2. Try to Save to File System (May fail on Vercel)
  try {
    if (!fs.existsSync(dataDirectory)) {
      fs.mkdirSync(dataDirectory, { recursive: true });
    }
    const fullPath = path.join(dataDirectory, `${id}.json`);
    fs.writeFileSync(fullPath, JSON.stringify(post, null, 2));
    console.log('[Storage] Saved to file system:', fullPath);
  } catch (error) {
    // Vercel 환경에서는 이 에러가 발생할 것이므로 무시하고 진행합니다.
    console.warn('[Storage] File system write failed (expected on Vercel):', error);
  }
}

export function deletePostData(id: string) {
  let deleted = false;

  // 1. Delete from Memory
  if (memoryPosts.has(id)) {
    memoryPosts.delete(id);
    deleted = true;
  }

  // 2. Delete from File System
  try {
    const jsonPath = path.join(dataDirectory, `${id}.json`);
    if (fs.existsSync(jsonPath)) {
      fs.unlinkSync(jsonPath);
      deleted = true;
    }
    const mdPath = path.join(postsDirectory, `${id}.md`);
    if (fs.existsSync(mdPath)) {
      fs.unlinkSync(mdPath);
      deleted = true;
    }
  } catch (e) {
    console.warn('[Storage] File system delete failed:', e);
  }

  return deleted;
}
