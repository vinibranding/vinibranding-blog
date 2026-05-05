import { NextResponse } from 'next/server';
import { getSortedPostsData } from '@/lib/posts';

export async function GET() {
  const baseUrl = 'https://vinibranding.com';
  const posts = await getSortedPostsData();
  
  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <title>Vini's Branding Lab</title>
      <link>${baseUrl}</link>
      <description>개인의 잠재력을 발견하고 독보적인 커리어 가치로 브랜딩하는 전문 연구소</description>
      <language>ko</language>
      ${posts.map((post) => `
        <item>
          <title><![CDATA[${post.title}]]></title>
          <link>${baseUrl}/posts/${post.id}</link>
          <description><![CDATA[${post.title}]]></description>
          <pubDate>${new Date(post.date).toUTCString()}</pubDate>
          <guid>${baseUrl}/posts/${post.id}</guid>
        </item>
      `).join('')}
    </channel>
  </rss>`;

  return new NextResponse(rssFeed, {
    headers: {
      'Content-Type': 'text/xml',
    },
  });
}
