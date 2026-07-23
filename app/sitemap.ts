import { MetadataRoute } from 'next'
import { createServiceClient } from '@/lib/supabase-server'

const BASE = 'https://trinkmakina.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const static_routes: MetadataRoute.Sitemap = [
    { url: BASE,          lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/sat`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/blog`,lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
  ]

  let blog_routes: MetadataRoute.Sitemap = []
  try {
    const supabase = createServiceClient()
    const { data } = await supabase
      .from('posts')
      .select('slug,published_at')
      .eq('published', true)
      .order('published_at', { ascending: false })
    blog_routes = (data ?? []).map((p) => ({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: p.published_at ? new Date(p.published_at) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  } catch {
    // Supabase unavailable
  }

  return [...static_routes, ...blog_routes]
}
