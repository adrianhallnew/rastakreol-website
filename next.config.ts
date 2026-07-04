import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

// @payloadcms/storage-s3 uploads to S3 but still serves files back out through Payload's
// own /api/media/file/** route (streamed server-side from the bucket), not a direct public
// bucket URL — so the actual host Next's image optimizer needs to trust is this app's own
// serverURL, not *.supabase.co. NEXT_PUBLIC_SERVER_URL is already the canonical source of
// truth for that origin (used by sitemap.ts/robots.ts), parsed here rather than duplicated.
const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL
const serverUrlPattern = serverUrl
  ? (() => {
      const parsed = new URL(serverUrl)
      return {
        protocol: parsed.protocol.replace(':', '') as 'http' | 'https',
        hostname: parsed.hostname,
        port: parsed.port || undefined,
        pathname: '/api/media/file/**',
      }
    })()
  : undefined

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: '/logo.jpeg',
      },
    ],
    remotePatterns: [
      ...(serverUrlPattern ? [serverUrlPattern] : []),
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
