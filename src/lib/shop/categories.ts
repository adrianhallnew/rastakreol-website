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
  return result.docs.map((c) => ({ slug: c.slug, name: c.name }))
}
