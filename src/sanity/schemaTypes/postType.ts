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
          { title: 'Branding Insight', value: 'Branding Insight' },
          { title: 'Career Design', value: 'Career Design' },
          { title: 'InterviewMaster', value: 'InterviewMaster' },
          { title: 'Contact', value: 'Contact' },
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
      name: 'contentHtml',
      title: 'Content HTML (TipTap)',
      type: 'text',
      description: 'Raw HTML from TipTap editor',
    }),
    defineField({
      name: 'imageUrl',
      title: 'Image URL (Base64 or External)',
      type: 'text',
      description: 'Base64 data or external image URL',
    }),
    defineField({
      name: 'content',
      title: 'Content (Sanity blocks)',
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
