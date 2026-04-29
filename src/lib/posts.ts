import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'src/posts');
const dataDirectory = path.join(process.cwd(), 'src/data/posts');

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

export function getSortedPostsData(): PostData[] {
  let allPostsData: PostData[] = [];

  // 1. Read Markdown files
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

  // 2. Read JSON files
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

  // Sort by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) return 1;
    return -1;
  });
}

export async function getPostData(id: string): Promise<PostData | null> {
  // Try JSON first
  const jsonPath = path.join(dataDirectory, `${id}.json`);
  if (fs.existsSync(jsonPath)) {
    const fileContents = fs.readFileSync(jsonPath, 'utf8');
    return JSON.parse(fileContents);
  }

  // Try Markdown
  const mdPath = path.join(postsDirectory, `${id}.md`);
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

  return null;
}

export function savePostData(id: string, data: Partial<PostData>) {
  try {
    if (!fs.existsSync(dataDirectory)) {
      console.log('[Storage] Creating directory:', dataDirectory)
      fs.mkdirSync(dataDirectory, { recursive: true });
    }
    const fullPath = path.join(dataDirectory, `${id}.json`);
    console.log('[Storage] Writing file:', fullPath)
    fs.writeFileSync(fullPath, JSON.stringify({ id, ...data }, null, 2));
  } catch (error) {
    console.error('[Storage] Save error:', error)
    throw error
  }
}

export function deletePostData(id: string) {
  const jsonPath = path.join(dataDirectory, `${id}.json`);
  if (fs.existsSync(jsonPath)) {
    fs.unlinkSync(jsonPath);
    return true;
  }
  const mdPath = path.join(postsDirectory, `${id}.md`);
  if (fs.existsSync(mdPath)) {
    fs.unlinkSync(mdPath);
    return true;
  }
  return false;
}
