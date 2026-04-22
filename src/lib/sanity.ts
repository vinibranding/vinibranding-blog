import { groq } from 'next-sanity'
import { client } from '../sanity/lib/client'
import { getSortedPostsData, getPostData } from './posts'

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
    const posts = await client.fetch(groq`*[_type == "post"] | order(publishedAt desc) {
      "id": slug.current,
      title,
      excerpt,
      category,
      "imageUrl": mainImage.asset->url,
      imageCaption,
      "date": publishedAt,
      author
    }`, {}, { next: { revalidate: 60 } })
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
    const post = await client.fetch(groq`*[_type == "post" && slug.current == $slug][0] {
      "id": slug.current,
      title,
      excerpt,
      category,
      "imageUrl": mainImage.asset->url,
      imageCaption,
      "date": publishedAt,
      author,
      content
    }`, { slug }, { next: { revalidate: 60 } })
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
