'use client'

interface StarRatingProps {
  value: number
  onChange?: (value: number) => void
  size?: number
}

export default function StarRating({ value, onChange, size = 20 }: StarRatingProps) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          className={onChange ? 'cursor-pointer' : 'cursor-default'}
          style={{ lineHeight: 1 }}
        >
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={star <= value ? '#f59e0b' : 'none'}
            stroke={star <= value ? '#f59e0b' : '#d1d5db'}
            strokeWidth={1.5}
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      ))}
    </div>
  )
}
