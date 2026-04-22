import { groq, createClient } from 'next-sanity'
import { apiVersion, dataset, projectId, useCdn } from '../sanity/env'
import { getSortedPostsData, getPostData } from './posts'

const serverClient = createClient({
  apiVersion,
  dataset,
  projectId,
  useCdn,
  token: process.env.SANITY_API_WRITE_TOKEN || 'skWHc2ZVm6XK2i8PeSSfWBDta7gqsERGy7boP2RofkULTAIXv3qqubOcoT681HjFT1DHVQ3ehzUjKXjWzpGm2g6q26qtLcZqXcb0WueEu2Vl5eFPn8PDizwrFoL2UZRJHqT56b2eKNvO2oRqe9mpGh4oQ98AuTx0qt9wyjKrBkLmFvQ3czNX'
})

export interface SanityPost {
  id: string
  title: string
  excerpt: string
  category: string
  imageUrl: string
  imageCaption?: string
  date: string
  author: string
  content?: any
  contentHtml?: string
}

export async function getSanityPosts(): Promise<SanityPost[]> {
  try {
    const posts = await serverClient.fetch(groq`*[_type == "post"] | order(publishedAt desc) {
      "id": slug.current,
      title,
      excerpt,
      category,
      "imageUrl": mainImage.asset->url,
      imageCaption,
      "date": publishedAt,
      author
    }`)
    if (posts && posts.length > 0) return posts
  } catch (e) {
    console.error("Sanity fetch error:", e)
  }
  
  // Fallback to local markdown posts
  const fallback = getSortedPostsData()
  return fallback.map(p => ({
    ...p,
    contentHtml: undefined,
  })) as any
}

export async function getSanityPost(slug: string): Promise<SanityPost | null> {
  try {
    const post = await serverClient.fetch(groq`*[_type == "post" && slug.current == $slug][0] {
      "id": slug.current,
      title,
      excerpt,
      category,
      "imageUrl": mainImage.asset->url,
      imageCaption,
      "date": publishedAt,
      author,
      content
    }`, { slug })
    if (post) return post
  } catch (e) {
    console.error("Sanity fetch error:", e)
  }

  // Fallback
  try {
    const mdPost = await getPostData(slug)
    if (mdPost) return mdPost as any
  } catch (e) {
    // Ignore fallback errors
  }
  return null
}
