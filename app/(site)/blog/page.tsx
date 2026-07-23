import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { createServiceClient } from '@/lib/supabase-server'

function optimizeImage(url: string, width: number, quality = 70): string {
  if (!url.includes('supabase.co/storage/v1/object/public/')) return url
  return url.replace('/storage/v1/object/public/', '/storage/v1/render/image/public/') + `?width=${width}&quality=${quality}&resize=cover`
}

export const metadata: Metadata = {
  title: 'Blog — Makine Satış Rehberi | Trink Makina',
  description: 'İkinci el sac işleme makineleri hakkında uzman rehberleri, değerleme ipuçları ve sektör haberleri. Trink Makina blogu.',
  alternates: { canonical: 'https://trinkmakina.com/blog' },
}

export const dynamic = 'force-dynamic'

type Post = {
  id: string
  title: string
  slug: string
  cover_image: string | null
  category: string | null
  author_name: string | null
  published_at: string | null
  content: string
}

export default async function BlogPage() {
  let posts: Post[] = []
  try {
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('posts')
      .select('id,title,slug,cover_image,category,author_name,published_at,content')
      .eq('published', true)
      .order('published_at', { ascending: false, nullsFirst: false })
    if (error) console.error('Blog fetch error:', error)
    posts = data ?? []
  } catch (e) {
    console.error('Blog page error:', e)
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1280px] mx-auto px-6 py-16">
        <div className="mb-12">
          <h1 className="text-[42px] font-bold text-[#0F172A] leading-tight mb-4">Blog</h1>
          <p className="text-[18px] text-[#475569]">Makine satışı, değerleme ve sektör hakkında rehberler.</p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-[#94A3B8] text-lg">Henüz yayınlanmış yazı yok.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}
                className="group flex flex-col border border-[#E2E8F0] rounded-[20px] overflow-hidden hover:-translate-y-1 hover:shadow-md hover:border-[#3B5BDB]/30 transition-all duration-300">
                {post.cover_image ? (
                  <div className="h-48 bg-[#F8FAFC] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-[#3B5BDB]/10 to-[#3B5BDB]/5 flex items-center justify-center">
                    <span className="text-[48px] opacity-30">📰</span>
                  </div>
                )}
                <div className="flex flex-col flex-1 p-6">
                  {post.category && (
                    <span className="text-[11px] font-semibold text-[#3B5BDB] uppercase tracking-wider mb-2">{post.category}</span>
                  )}
                  <h2 className="font-bold text-[#0F172A] text-[17px] leading-snug mb-3 flex-1">{post.title}</h2>
                  <p className="text-[#475569] text-[13px] line-clamp-3 mb-4">
                    {post.content.replace(/#+\s/g, '').slice(0, 120)}…
                  </p>
                  <div className="flex items-center justify-between text-[12px] text-[#94A3B8] mt-auto pt-4 border-t border-[#E2E8F0]">
                    <span>{post.author_name ?? 'Trink Makina'}</span>
                    {post.published_at && (
                      <span>{new Date(post.published_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
