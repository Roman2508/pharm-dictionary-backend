import type { CollectionConfig } from 'payload'

export const Exercise: CollectionConfig = {
  slug: 'exercise',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
  },
  fields: [
    {
      name: 'is_published',
      label: 'Опубліковано',
      type: 'checkbox',
      defaultValue: true,
    },

    {
      name: 'title',
      label: 'Назва',
      type: 'text',
      required: true,
    },

    {
      name: 'description',
      label: 'Опис',
      type: 'textarea',
      required: false,
    },

    {
      name: 'type',
      label: 'Тип завдання (звичайний тест чи картка)',
      type: 'select',
      options: [
        { label: 'Тест', value: 'test' },
        { label: 'Картка', value: 'card' },
      ],
      defaultValue: 'test',
    },

    // {
    //   name: 'category',
    //   label: 'Категорія',
    //   type: 'relationship',
    //   relationTo: 'exercise_categories',
    //   hasMany: false,
    //   required: true,
    // },

    {
      name: 'question',
      label: 'Питання',
      type: 'array',
      fields: [
        {
          name: 'correct',
          label: 'Правильне слово',
          type: 'relationship',
          relationTo: 'dictionary',
          hasMany: false,
          required: true,
        },

        {
          name: 'incorrect',
          label: 'Неправильні слова',
          type: 'relationship',
          relationTo: 'dictionary',
          hasMany: true,
          required: false,
        },
      ],
      required: true,
    },
  ],

  admin: {
    useAsTitle: 'title',
  },
}
