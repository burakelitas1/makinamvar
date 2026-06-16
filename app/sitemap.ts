import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://trinkmakina.com'
  const now = new Date()

  return [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/sat`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/kvkk`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/kullanim-kosullari`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/cerez-yonetimi`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${base}/ticari-ileti`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
  ]
}
