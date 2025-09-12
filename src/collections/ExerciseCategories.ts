import type { CollectionConfig } from 'payload'

export const ExerciseCategories: CollectionConfig = {
  slug: 'exercise_categories',
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

    {
      name: 'type',
      label: 'Тип категорії (Тест чи картка)',
      type: 'select',
      options: [
        { label: 'Тест', value: 'test' },
        { label: 'Картка', value: 'card' },
      ],
      defaultValue: 'test',
    },

    {
      name: 'exercises',
      label: 'Вправи',
      type: 'relationship',
      relationTo: 'exercise',
      hasMany: true,
    },
  ],
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'order'],
  },
}
