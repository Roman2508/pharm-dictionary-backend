import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Назва категорії',
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      label: 'Розташування',
      admin: {
        description: 'Число для впорядкування категорій (менше = вище)',
      },
    },
  ],
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'order'],
  },
}
