'use client'

import { useState, useRef, useEffect } from 'react'
import { DISTRICTS } from '@/lib/districts'

const CITIES = Object.keys(DISTRICTS).sort()

interface Props {
  cityValue: string
  districtValue: string
  onCityChange: (city: string) => void
  onDistrictChange: (district: string) => void
  cityError?: string
  districtError?: string
}

export default function CityDistrictSelect({ cityValue, districtValue, onCityChange, onDistrictChange, cityError, districtError }: Props) {
  const [query, setQuery] = useState(cityValue)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const filtered = query.length === 0
    ? CITIES
    : CITIES.filter(c => c.toLowerCase().includes(query.toLowerCase()))

  useEffect(() => {
    setQuery(cityValue)
  }, [cityValue])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function selectCity(city: string) {
    setQuery(city)
    setOpen(false)
    onCityChange(city)
    onDistrictChange('')
  }

  const districts = cityValue ? (DISTRICTS[cityValue] || []) : []

  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="label">İl *</label>
        <div ref={ref} className="relative">
          <input
            type="text"
            className={`input-field pr-8 ${cityError ? 'border-red-400' : ''}`}
            placeholder="İl arayın…"
            value={query}
            onFocus={() => setOpen(true)}
            onChange={e => {
              setQuery(e.target.value)
              setOpen(true)
              if (!DISTRICTS[e.target.value]) {
                onCityChange('')
                onDistrictChange('')
              }
            }}
            autoComplete="off"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">▾</span>
          {open && filtered.length > 0 && (
            <ul className="absolute z-50 w-full bg-white border border-gray-200 rounded-xl shadow-lg mt-1 max-h-52 overflow-y-auto">
              {filtered.map(city => (
                <li
                  key={city}
                  className={`px-4 py-2.5 cursor-pointer text-sm hover:bg-orange-50 hover:text-orange-700 transition-colors ${city === cityValue ? 'bg-orange-50 font-semibold text-orange-700' : 'text-gray-700'}`}
                  onMouseDown={() => selectCity(city)}
                >
                  {city}
                </li>
              ))}
            </ul>
          )}
        </div>
        {cityError && <p className="error-msg">{cityError}</p>}
      </div>

      <div>
        <label className="label">İlçe *</label>
        <select
          className={`select-field ${districtError ? 'border-red-400' : ''} ${!cityValue ? 'opacity-50' : ''}`}
          value={districtValue}
          onChange={e => onDistrictChange(e.target.value)}
          disabled={!cityValue}
        >
          <option value="">{cityValue ? 'İlçe seçiniz…' : 'Önce il seçin'}</option>
          {districts.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        {districtError && <p className="error-msg">{districtError}</p>}
      </div>
    </div>
  )
}
