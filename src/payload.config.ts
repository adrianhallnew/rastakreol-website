import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Customers } from './collections/Customers'
import { Media } from './collections/Media'
import { Categories } from './collections/Categories'
import { Products } from './collections/Products'
import { Orders } from './collections/Orders'
import { Cart } from './collections/Cart'
import { Wishlist } from './collections/Wishlist'
import { Reviews } from './collections/Reviews'
import { Notifications } from './collections/Notifications'
import { NotificationsReads } from './collections/NotificationsReads'
import { ContactSubmissions } from './collections/ContactSubmissions'

import { SiteSettings } from './globals/SiteSettings'
import { HomepageSettings } from './globals/HomepageSettings'
import { ShippingSettings } from './globals/ShippingSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Customers,
    Media,
    Categories,
    Products,
    Orders,
    Cart,
    Wishlist,
    Reviews,
    Notifications,
    NotificationsReads,
    ContactSubmissions,
  ],
  globals: [SiteSettings, HomepageSettings, ShippingSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    push: false,
  }),
  sharp,
  plugins: [
    s3Storage({
      collections: { media: true },
      bucket: process.env.STORAGE_BUCKET || '',
      config: {
        credentials: {
          accessKeyId: process.env.SUPABASE_S3_ACCESS_KEY || '',
          secretAccessKey: process.env.SUPABASE_S3_SECRET_KEY || '',
        },
        endpoint: `${process.env.SUPABASE_URL}/storage/v1/s3`,
        region: 'ap-south-1',
        forcePathStyle: true,
      },
    }),
    seoPlugin({
      collections: ['products', 'categories'],
      uploadsCollection: 'media',
    }),
  ],
})
