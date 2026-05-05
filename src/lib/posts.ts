import { groq, createClient } from 'next-sanity'
import { apiVersion, dataset, projectId, useCdn } from '../sanity/env'

const serverClient = createClient({
  apiVersion,
  dataset,
  projectId,
  useCdn,
  token: process.env.SANITY_API_WRITE_TOKEN || 'skWHc2ZVm6XK2i8PeSSfWBDta7gqsERGy7boP2RofkULTAIXv3qqubOcoT681HjFT1DHVQ3ehzUjKXjWzpGm2g6q26qtLcZqXcb0WueEu2Vl5eFPn8PDizwrFoL2UZRJHqT56b2eKNvO2oRqe9mpGh4oQ98AuTx0qt9wyjKrBkLmFvQ3czNX'
})

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
  try {
    const posts = await serverClient.fetch(groq`*[_type == "post"] | order(publishedAt desc) {
      "id": slug.current,
      "slug": slug.current,
      title,
      category,
      imageUrl,
      imageCaption,
      "date": publishedAt,
      author,
      status,
      contentHtml
    }`)
    return posts || []
  } catch (e) {
    console.error('[Sanity] Fetch error:', e)
    return []
  }
}

export async function getPostData(id: string): Promise<PostData | null> {
  try {
    const post = await serverClient.fetch(groq`*[_type == "post" && slug.current == $id][0] {
      "id": slug.current,
      "slug": slug.current,
      title,
      category,
      imageUrl,
      imageCaption,
      "date": publishedAt,
      author,
      status,
      contentHtml
    }`, { id })
    return post || null
  } catch (e) {
    console.error('[Sanity] Fetch single error:', e)
    return null
  }
}

export async function savePostData(id: string, data: Partial<PostData>) {
  console.log('[Sanity] Saving post:', id)
  
  try {
    // 1. Check if post exists to get its _id
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
      console.log('[Sanity] Updated:', existing._id)
    } else {
      await serverClient.create(doc)
      console.log('[Sanity] Created new post')
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
    return false
  } catch (e) {
    console.error('[Sanity] Delete error:', e)
    return false
  }
}
