import { getPayload } from 'payload'
import config from '@payload-config'

export async function queryVisibleCategories() {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'categories',
    where: { visible: { equals: true } },
    overrideAccess: false,
    sort: 'sort_order',
    limit: 100,
    select: { name: true, slug: true },
  })
  return result.docs
    .filter((c): c is typeof c & { slug: string } => !!c.slug)
    .map((c) => ({ slug: c.slug, name: c.name }))
}
