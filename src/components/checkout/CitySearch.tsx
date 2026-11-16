'use client'

import { useState, useEffect, useRef } from 'react'
import { searchCities, type NpCity } from '@/api/novaPoshtaApi'

interface Props {
  value: NpCity | null
  onChange: (city: NpCity | null) => void
}

export default function CitySearch({ value, onChange }: Props) {
  const [query, setQuery] = useState(value?.Description ?? '')
  const [results, setResults] = useState<NpCity[]>([])
  const [open, setOpen] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    if (value) setQuery(value.Description)
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setQuery(val)
    onChange(null)
    clearTimeout(timer.current)
    if (val.length < 2) { setResults([]); setOpen(false); return }
    timer.current = setTimeout(async () => {
      const cities = await searchCities(val)
      setResults(cities)
      setOpen(true)
    }, 300)
  }

  const select = (city: NpCity) => {
    onChange(city)
    setQuery(city.Description)
    setOpen(false)
    setResults([])
  }

  return (
    <div className="relative">
      <input
        value={query}
        onChange={handleChange}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="Введіть місто..."
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
      />
      {open && results.length > 0 && (
        <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-md mt-1 max-h-52 overflow-y-auto">
          {results.map(city => (
            <button
              key={city.Ref}
              onMouseDown={() => select(city)}
              className="w-full text-left px-3 py-2.5 text-sm hover:bg-gray-50 border-b border-gray-100 last:border-0"
            >
              <span className="font-medium">{city.Description}</span>
              <span className="text-gray-400 text-xs ml-2">{city.AreaDescription} обл.</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
