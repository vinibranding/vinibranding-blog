import { defineField, defineType } from 'sanity'

export const postType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      description: 'A short summary of the post',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Branding Insight', value: '브랜딩 인사이트' },
          { title: 'Career Design', value: '커리어 디자인' },
          { title: 'Interview Master', value: '인터뷰 마스터' },
        ],
      },
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'imageCaption',
      title: 'Image Caption',
      type: 'string',
      description: 'Caption to show under the main image',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
    }),
    defineField({
      name: 'scheduledAt',
      title: 'Scheduled Publish Date',
      type: 'datetime',
      description: '예약 발행 날짜/시간 (비워두면 즉시 발행)',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      initialValue: 'published',
      options: {
        list: [
          { title: '발행됨', value: 'published' },
          { title: '초안', value: 'draft' },
          { title: '예약발행', value: 'scheduled' },
        ],
      },
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      initialValue: '비니',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        {
          type: 'block',
        },
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
    }),
  ],
})
