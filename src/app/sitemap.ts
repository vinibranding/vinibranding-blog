import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://vinibranding.com';
  
  // 현재 MOCK_POSTS 기준으로 게시글들의 사이트맵을 구성합니다.
  const postIds = ['1', '2', '3', '4', '5', '6'];
  const postEntries: MetadataRoute.Sitemap = postIds.map((id) => ({
    url: `${baseUrl}/post/${id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...postEntries,
  ];
}
