'use client'

const cities = ['Київ', 'Дніпро', 'Львів', 'Одеса', 'Харків', 'Запоріжжя', 'Кривий Ріг', 'Полтава', 'Вінниця', 'Херсон']

export default function CityModal({ open, onClose, onSelect, selected }: {
  open: boolean
  onClose: () => void
  onSelect: (city: string) => void
  selected: string
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-[480px] p-6 z-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Оберіть місто</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
        </div>
        <p className="text-sm text-gray-500 mb-4">Виберіть або введіть назву свого населеного пункту</p>
        <div className="flex flex-wrap gap-2">
          {cities.map(c => (
            <button
              key={c}
              onClick={() => onSelect(c)}
              className={`px-3 py-1.5 rounded border text-sm transition-colors ${
                selected === c
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'border-gray-200 hover:border-gray-400 text-gray-700'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
