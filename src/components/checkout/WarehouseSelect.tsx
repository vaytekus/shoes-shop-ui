'use client'

import { useState, useEffect } from 'react'
import { getWarehouses, type NpWarehouse } from '@/api/novaPoshtaApi'

type WarehouseType = 'Branch' | 'Postomat'

interface Props {
  cityRef: string
  value: NpWarehouse | null
  onChange: (warehouse: NpWarehouse | null) => void
}

export default function WarehouseSelect({ cityRef, value, onChange }: Props) {
  const [type, setType] = useState<WarehouseType>('Branch')
  const [all, setAll] = useState<NpWarehouse[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!cityRef) return
    setLoading(true)
    onChange(null)
    getWarehouses(cityRef)
      .then(setAll)
      .finally(() => setLoading(false))
  }, [cityRef])

  const filtered = all
    .filter(w => type === 'Postomat'
      ? w.CategoryOfWarehouse === 'Postomat'
      : w.CategoryOfWarehouse !== 'Postomat'
    )
    .filter(w => !search || w.Description.toLowerCase().includes(search.toLowerCase()))

  const switchType = (t: WarehouseType) => {
    setType(t)
    onChange(null)
    setSearch('')
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {(['Branch', 'Postomat'] as WarehouseType[]).map(t => (
          <button
            key={t}
            onClick={() => switchType(t)}
            className={`py-2 rounded-lg border text-sm transition-colors ${
              type === t
                ? 'border-gray-900 bg-gray-900 text-white'
                : 'border-gray-200 text-gray-700 hover:border-gray-400'
            }`}
          >
            {t === 'Branch' ? 'Відділення' : 'Поштомат'}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-xs text-gray-400 py-2 text-center">Завантаження...</p>
      ) : (
        <>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Пошук по номеру або адресі"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
          />
          <div className="max-h-52 overflow-y-auto border border-gray-200 rounded-lg">
            {filtered.length === 0 ? (
              <p className="text-xs text-gray-400 p-3 text-center">Не знайдено</p>
            ) : (
              filtered.map(w => (
                <button
                  key={w.Ref}
                  onClick={() => onChange(w)}
                  className={`w-full text-left px-3 py-2.5 text-sm border-b border-gray-100 last:border-0 transition-colors ${
                    value?.Ref === w.Ref
                      ? 'bg-gray-900 text-white'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {w.Description}
                </button>
              ))
            )}
          </div>
        </>
      )}
    </div>
  )
}
