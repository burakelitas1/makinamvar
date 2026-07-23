import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createServiceClient } from '@/lib/supabase-server'

function optimizeImage(url: string, width: number, quality = 70): string {
  if (!url.includes('supabase.co/storage/v1/object/public/')) return url
  return url.replace('/storage/v1/object/public/', '/storage/v1/render/image/public/') + `?width=${width}&quality=${quality}&resize=cover`
}

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
        <div className="w-full h-[220px] bg-[#F8FAFC] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover object-center" />
        </div>
      )}

      <div className="max-w-[740px] mx-auto px-4 md:px-6 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[12px] text-[#94A3B8] mb-6">
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
        <h1 className="text-[26px] md:text-[34px] font-bold text-[#0F172A] leading-tight mt-3 mb-4">{post.title}</h1>
        <div className="flex items-center gap-4 text-[13px] text-[#94A3B8] mb-8 pb-6 border-b border-[#E2E8F0]">
          <span>{post.author_name ?? 'Trink Makina'}</span>
          {post.published_at && (
            <span>{new Date(post.published_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          )}
        </div>

        {/* Content */}
        <div className="max-w-none">
          {paragraphs.map((para, i) => {
            if (para.startsWith('## ')) return <h2 key={i} className="text-[20px] font-bold text-[#0F172A] mt-8 mb-3">{para.slice(3)}</h2>
            if (para.startsWith('# '))  return <h2 key={i} className="text-[22px] font-bold text-[#0F172A] mt-8 mb-3">{para.slice(2)}</h2>
            if (para.startsWith('### ')) return <h3 key={i} className="text-[17px] font-semibold text-[#0F172A] mt-6 mb-2">{para.slice(4)}</h3>
            if (para.startsWith('- ') || para.startsWith('* ')) {
              return <li key={i} className="text-[15px] text-[#475569] leading-[26px] ml-5 list-disc mb-1">{para.slice(2)}</li>
            }
            return <p key={i} className="text-[15px] text-[#475569] leading-[26px] mb-4">{para}</p>
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 p-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[16px] text-center">
          <h3 className="text-[18px] font-bold text-[#0F172A] mb-2">Makinanızın Değerini Öğrenin</h3>
          <p className="text-[14px] text-[#475569] mb-5">Ücretsiz değerlendirme formu — 24 saatte teklif, taahhüt yok.</p>
          <Link href="/sat"
            className="inline-flex items-center gap-2 bg-[#3B5BDB] hover:bg-[#2F4AC7] text-white font-bold px-6 h-[46px] rounded-[12px] text-[14px] transition-colors">
            Ücretsiz Teklif Al
          </Link>
        </div>

        <div className="mt-6 text-center">
          <Link href="/blog" className="text-[#3B5BDB] hover:text-[#2F4AC7] text-sm font-medium transition-colors">
            ← Tüm yazılara dön
          </Link>
        </div>
      </div>
    </div>
  )
}
