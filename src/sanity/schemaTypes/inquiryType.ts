import { defineField, defineType } from 'sanity'

export const inquiryType = defineType({
  name: 'inquiry',
  title: 'Inquiry',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: '이름',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'email',
      title: '이메일',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'phone',
      title: '연락처',
      type: 'string',
    }),
    defineField({
      name: 'type',
      title: '문의 유형',
      type: 'string',
      options: {
        list: [
          { title: '1:1 컨설팅', value: 'consulting' },
          { title: '출강 및 협업 제안', value: 'collaboration' },
          { title: '기타', value: 'other' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'message',
      title: '문의 내용',
      type: 'text',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'isRead',
      title: '읽음 여부',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'createdAt',
      title: '접수 일시',
      type: 'datetime',
    }),
  ],
  orderings: [
    {
      title: '최신순',
      name: 'createdAtDesc',
      by: [{ field: 'createdAt', direction: 'desc' }],
    },
  ],
})
