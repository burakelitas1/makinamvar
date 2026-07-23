import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createServiceClient } from '@/lib/supabase-server'

type Post = {
  id: string
  title: string
  slug: string
  content: string
  cover_image: string | null
  category: string | null
  author_name: string | null
  published_at: string | null
}

async function getPost(slug: string): Promise<Post | null> {
  try {
    const supabase = createServiceClient()
    const { data } = await supabase.from('posts').select('*').eq('slug', slug).eq('published', true).single()
    return data ?? null
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug)
  if (!post) return { title: 'Sayfa Bulunamadı' }
  return {
    title: `${post.title} | Trink Makina Blog`,
    description: post.content.replace(/#+\s/g, '').slice(0, 155),
    alternates: { canonical: `https://trinkmakina.com/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.content.replace(/#+\s/g, '').slice(0, 155),
      url: `https://trinkmakina.com/blog/${post.slug}`,
      type: 'article',
      ...(post.cover_image ? { images: [{ url: post.cover_image }] } : {}),
    },
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)
  if (!post) notFound()

  const paragraphs = post.content.split('\n').filter(Boolean)

  return (
    <div className="bg-white min-h-screen">
      {/* Cover */}
      {post.cover_image && (
        <div className="relative w-full h-[320px] md:h-[440px] bg-[#F8FAFC] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/api/img?url=${encodeURIComponent(post.cover_image)}`} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/60 to-transparent" />
        </div>
      )}

      <div className="max-w-[780px] mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[13px] text-[#94A3B8] mb-8">
          <Link href="/" className="hover:text-[#3B5BDB] transition-colors">Ana Sayfa</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-[#3B5BDB] transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-[#475569] truncate">{post.title}</span>
        </div>

        {/* Meta */}
        {post.category && (
          <span className="text-[11px] font-semibold text-[#3B5BDB] uppercase tracking-wider">{post.category}</span>
        )}
        <h1 className="text-[36px] md:text-[44px] font-bold text-[#0F172A] leading-tight mt-3 mb-4">{post.title}</h1>
        <div className="flex items-center gap-4 text-[13px] text-[#94A3B8] mb-10 pb-8 border-b border-[#E2E8F0]">
          <span>{post.author_name ?? 'Trink Makina'}</span>
          {post.published_at && (
            <span>{new Date(post.published_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          )}
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          {paragraphs.map((para, i) => {
            if (para.startsWith('## ')) return <h2 key={i} className="text-[26px] font-bold text-[#0F172A] mt-10 mb-4">{para.slice(3)}</h2>
            if (para.startsWith('# '))  return <h2 key={i} className="text-[30px] font-bold text-[#0F172A] mt-10 mb-4">{para.slice(2)}</h2>
            if (para.startsWith('### ')) return <h3 key={i} className="text-[20px] font-semibold text-[#0F172A] mt-8 mb-3">{para.slice(4)}</h3>
            if (para.startsWith('- ') || para.startsWith('* ')) {
              return <li key={i} className="text-[17px] text-[#475569] leading-[30px] ml-5 list-disc">{para.slice(2)}</li>
            }
            return <p key={i} className="text-[17px] text-[#475569] leading-[30px] mb-5">{para}</p>
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 p-8 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[20px] text-center">
          <h3 className="text-[22px] font-bold text-[#0F172A] mb-3">Makinanızın Değerini Öğrenin</h3>
          <p className="text-[#475569] mb-6">Ücretsiz değerlendirme formu — 24 saatte teklif, taahhüt yok.</p>
          <Link href="/sat"
            className="inline-flex items-center gap-2 bg-[#3B5BDB] hover:bg-[#2F4AC7] text-white font-bold px-8 h-[52px] rounded-[14px] text-[15px] transition-colors">
            Ücretsiz Teklif Al
          </Link>
        </div>

        <div className="mt-8 text-center">
          <Link href="/blog" className="text-[#3B5BDB] hover:text-[#2F4AC7] text-sm font-medium transition-colors">
            ← Tüm yazılara dön
          </Link>
        </div>
      </div>
    </div>
  )
}
