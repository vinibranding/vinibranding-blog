import { type SchemaTypeDefinition } from 'sanity'
import { postType } from './postType'
import { inquiryType } from './inquiryType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [postType, inquiryType],
}
