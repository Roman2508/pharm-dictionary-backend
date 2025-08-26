import type { CollectionConfig } from 'payload'

export const Dictionary: CollectionConfig = {
  slug: 'dictionary',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
  },
  fields: [
    {
      name: 'ukrainian',
      label: 'Слово (українською)',
      type: 'text',
      required: true,
    },
    {
      name: 'latin',
      label: 'Слово (латинською)',
      type: 'text',
      required: true,
    },
  ],
}
