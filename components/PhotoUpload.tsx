'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import imageCompression from 'browser-image-compression'

interface Props {
  onFilesChange: (files: File[]) => void
  maxFiles?: number
}

export default function PhotoUpload({ onFilesChange, maxFiles = 5 }: Props) {
  const [previews, setPreviews] = useState<{ url: string; file: File }[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [compressing, setCompressing] = useState(false)

  async function addFiles(incoming: FileList | null) {
    if (!incoming) return
    const allowed = Array.from(incoming)
      .filter((f) => f.type.startsWith('image/'))
      .slice(0, maxFiles - previews.length)
    if (!allowed.length) return

    setCompressing(true)
    const compressed = await Promise.all(
      allowed.map((file) =>
        imageCompression(file, { maxSizeMB: 0.8, maxWidthOrHeight: 1920, useWebWorker: true })
      )
    )
    setCompressing(false)

    const newPreviews = compressed.map((file) => ({ file, url: URL.createObjectURL(file) }))
    const updated = [...previews, ...newPreviews].slice(0, maxFiles)
    setPreviews(updated)
    onFilesChange(updated.map((p) => p.file))
  }

  function remove(index: number) {
    URL.revokeObjectURL(previews[index].url)
    const updated = previews.filter((_, i) => i !== index)
    setPreviews(updated)
    onFilesChange(updated.map((p) => p.file))
  }

  const remaining = maxFiles - previews.length

  return (
    <div>
      {remaining > 0 && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files) }}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
            ${dragging
              ? 'border-brand-blue bg-blue-50'
              : 'border-gray-300 hover:border-brand-blue hover:bg-blue-50/50'}`}
        >
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-700 font-semibold text-sm">Fotoğraf Yükle</p>
          <p className="text-gray-400 text-xs mt-1">
            Sürükle & bırak veya tıkla · Kalan: {remaining} fotoğraf
          </p>
          <p className="text-gray-300 text-xs mt-0.5">JPG, PNG · Max 10MB</p>
          {compressing && <p className="text-blue-500 text-xs mt-1 font-medium">Fotoğraflar optimize ediliyor…</p>}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => addFiles(e.target.files)}
      />

      {previews.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4">
          {previews.map((p, i) => (
            <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
              <Image src={p.url} alt={`Fotoğraf ${i + 1}`} fill className="object-cover" />
              <button
                type="button"
                onClick={() => remove(i)}
                className="absolute top-1 right-1 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center
                           opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold shadow"
              >
                ×
              </button>
              {i === 0 && (
                <span className="absolute bottom-1 left-1 bg-brand-blue text-white text-xs px-1.5 py-0.5 rounded font-semibold">
                  Kapak
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
