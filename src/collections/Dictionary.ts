import * as XLSX from 'xlsx'
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
    {
      name: 'category',
      label: 'Категорія',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: false,
      required: true,
    },
  ],

  admin: {
    components: {
      beforeListTable: [
        {
          path: '@/components/dictionary-excel-actions',
        },
      ],
    },
  },

  endpoints: [
    /* find word by first letter */
    {
      path: '/starts-with',
      method: 'get',
      handler: async (req) => {
        const letter = String(req.query.l ?? '')

        const type = String(req.query.t ?? '')

        const { docs } = await req.payload.find({
          collection: 'dictionary',
          where: type === 'uk_la' ? { ukrainian: { like: letter } } : { latin: { like: letter } },
          limit: 1000,
        })

        const filtered = docs.filter((d) => {
          if (type === 'uk_la') {
            return d.ukrainian
              ?.toLocaleLowerCase('uk-UA')
              .startsWith(letter.toLocaleLowerCase('uk-UA'))
          } else {
            return d.latin?.toLocaleLowerCase('uk-UA').startsWith(letter.toLocaleLowerCase('uk-UA'))
          }
        })

        return Response.json({ docs: filtered })
      },
    },

    /* import from excel */
    {
      path: '/import-excel',
      method: 'post',
      handler: async (req) => {
        try {
          const rawBody = await new Response(req.body).text()
          const words = JSON.parse(rawBody)

          if (!words.length) {
            return Response.json({ error: 'Excel file is empty' })
          }

          for (const word of words) {
            await req.payload.create({
              collection: 'dictionary',
              data: { ukrainian: word[0], latin: word[1], category: word[2] },
            })
          }

          return Response.json({ success: true, imported: words.length })
        } catch (err) {
          console.error(err)
          return Response.json({ error: 'Import failed' })
        }
      },
    },
  ],
}
