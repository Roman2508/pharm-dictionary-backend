import path from 'path'
import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'

import { Users } from './collections/Users'
import { Exercise } from './collections/Exercises'
import { Dictionary } from './collections/Dictionary'
import { ExerciseCategories } from './collections/ExerciseCategories'
import { DictionaryCategories } from './collections/DictionaryCategories'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.SERVER_URL,
  cors: [process.env.CORS_ORIGIN || 'http://localhost:5173'],

  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Dictionary, DictionaryCategories, Exercise, ExerciseCategories],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      // connectionString: process.env.DATABASE_URI || '',
      database: process.env.DATABASE_NAME || '',
      host: process.env.DATABASE_HOST || '',
      port: parseInt(process.env.DATABASE_PORT || '5432', 10),
      user: process.env.DATABASE_USER || '',
      password: process.env.DATABASE_PASSWORD || '',
      ssl: {
        rejectUnauthorized: false,
      },
    },
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
})
