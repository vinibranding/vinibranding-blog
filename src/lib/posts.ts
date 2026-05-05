import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { groq, createClient } from 'next-sanity'
import { apiVersion, dataset, projectId, useCdn } from '../sanity/env'

const serverClient = createClient({
  apiVersion,
  dataset,
  projectId,
  useCdn,
  token: process.env.SANITY_API_WRITE_TOKEN || 'skWHc2ZVm6XK2i8PeSSfWBDta7gqsERGy7boP2RofkULTAIXv3qqubOcoT681HjFT1DHVQ3ehzUjKXjWzpGm2g6q26qtLcZqXcb0WueEu2Vl5eFPn8PDizwrFoL2UZRJHqT56b2eKNvO2oRqe9mpGh4oQ98AuTx0qt9wyjKrBkLmFvQ3czNX'
})

const postsDirectory = path.join(process.cwd(), 'src/posts')

export interface PostData {
  id: string;
  title: string;
  date: string;
  category: string;
  imageUrl: string;
  imageCaption?: string;
  author: string;
  contentHtml?: string;
  excerpt?: string;
  status?: string;
  slug?: string;
}

export async function getSortedPostsData(): Promise<PostData[]> {
  let allPosts: PostData[] = []

  // 1. Fetch from Sanity
  try {
    const sanityPosts = await serverClient.fetch(groq`*[_type == "post"] | order(publishedAt desc) {
      "id": slug.current,
      "slug": slug.current,
      title,
      category,
      "imageUrl": coalesce(imageUrl, mainImage.asset->url),
      imageCaption,
      "date": coalesce(publishedAt, _createdAt),
      author,
      status,
      contentHtml
    }`)
    if (sanityPosts) allPosts = [...sanityPosts]
  } catch (e) {
    console.error('[Sanity] Fetch error:', e)
  }

  // 2. Fetch from Local Files (Fallback/Existing)
  try {
    if (fs.existsSync(postsDirectory)) {
      const fileNames = fs.readdirSync(postsDirectory)
      const localPosts = fileNames
        .filter(fn => fn.endsWith('.md'))
        .map(fileName => {
          const id = fileName.replace(/\.md$/, '')
          const fullPath = path.join(postsDirectory, fileName)
          const fileContents = fs.readFileSync(fullPath, 'utf8')
          const matterResult = matter(fileContents)

          return {
            id,
            slug: id,
            title: matterResult.data.title,
            date: matterResult.data.date || '',
            category: matterResult.data.category || '',
            imageUrl: matterResult.data.imageUrl || '/images/default-post.jpg',
            author: matterResult.data.author || '비니',
            contentHtml: matterResult.content, // Simplified for fallback
            ...matterResult.data
          } as PostData
        })
      
      // Merge but avoid duplicates if slug is same
      localPosts.forEach(lp => {
        if (!allPosts.find(ap => ap.slug === lp.slug)) {
          allPosts.push(lp)
        }
      })
    }
  } catch (e) {
    console.error('[Local] Read error:', e)
  }

  // Sort by date
  return allPosts.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export async function getPostData(id: string): Promise<PostData | null> {
  // 1. Try Sanity
  try {
    const post = await serverClient.fetch(groq`*[_type == "post" && slug.current == $id][0] {
      "id": slug.current,
      "slug": slug.current,
      title,
      category,
      "imageUrl": coalesce(imageUrl, mainImage.asset->url),
      imageCaption,
      "date": coalesce(publishedAt, _createdAt),
      author,
      status,
      contentHtml
    }`, { id })
    if (post) return post
  } catch (e) {
    console.error('[Sanity] Fetch single error:', e)
  }

  // 2. Try Local
  try {
    const fullPath = path.join(postsDirectory, `${id}.md`)
    if (fs.existsSync(fullPath)) {
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const matterResult = matter(fileContents)
      return {
        id,
        slug: id,
        title: matterResult.data.title,
        date: matterResult.data.date || '',
        category: matterResult.data.category || '',
        imageUrl: matterResult.data.imageUrl || '/images/default-post.jpg',
        author: matterResult.data.author || '비니',
        contentHtml: matterResult.content,
        ...matterResult.data
      } as PostData
    }
  } catch (e) {
    console.error('[Local] Read single error:', e)
  }

  return null
}

export async function savePostData(id: string, data: Partial<PostData>) {
  // ONLY SAVE TO SANITY for permanent persistence on Vercel
  try {
    const existing = await serverClient.fetch(groq`*[_type == "post" && slug.current == $id][0]`, { id })
    
    const doc = {
      _type: 'post',
      title: data.title,
      slug: { _type: 'slug', current: id },
      category: data.category,
      status: data.status || 'published',
      publishedAt: data.date || new Date().toISOString(),
      author: data.author || '비니',
      contentHtml: data.contentHtml,
      imageUrl: data.imageUrl,
      imageCaption: data.imageCaption,
    }

    if (existing) {
      await serverClient.patch(existing._id).set(doc).commit()
    } else {
      await serverClient.create(doc)
    }
  } catch (error) {
    console.error('[Sanity] Save error:', error)
    throw error
  }
}

export async function deletePostData(id: string) {
  try {
    const existing = await serverClient.fetch(groq`*[_type == "post" && slug.current == $id][0]`, { id })
    if (existing) {
      await serverClient.delete(existing._id)
      return true
    }
    // Local deletion is not supported on Vercel, so we just return false or ignore
    return false
  } catch (e) {
    console.error('[Sanity] Delete error:', e)
    return false
  }
}
