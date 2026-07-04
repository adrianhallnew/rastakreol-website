import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  const payload = await getPayload({ config })

  const [products, categories] = await Promise.all([
    payload.find({
      collection: 'products',
      where: { status: { equals: 'published' } },
      overrideAccess: false,
      pagination: false,
      select: { slug: true, updatedAt: true },
    }),
    payload.find({
      collection: 'categories',
      where: { visible: { equals: true } },
      overrideAccess: false,
      pagination: false,
      select: { slug: true, updatedAt: true },
    }),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/shop`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/about`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/contact`, changeFrequency: 'monthly', priority: 0.4 },
  ]

  const productRoutes: MetadataRoute.Sitemap = products.docs.map((p) => ({
    url: `${baseUrl}/products/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const categoryRoutes: MetadataRoute.Sitemap = categories.docs.map((c) => ({
    url: `${baseUrl}/shop/${c.slug}`,
    lastModified: c.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  return [...staticRoutes, ...categoryRoutes, ...productRoutes]
}
