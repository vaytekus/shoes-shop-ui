import Link from 'next/link'
import type { Product } from '@/types'

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  return (
    <Link href={`/products/${product.id}`} className="group flex flex-col">
      <div className="aspect-square rounded-xl overflow-hidden mb-3 relative">
        {product.imageUrls[0] ? (
          <img
            src={product.imageUrls[0]}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-200 text-5xl">👟</div>
        )}
        {product.stockQuantity === 0 && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-xs text-gray-400 font-medium">Out of stock</span>
          </div>
        )}
      </div>

      <button
        disabled={product.stockQuantity === 0}
        onClick={e => e.preventDefault()}
        className="w-full border border-gray-900 text-gray-900 text-xs font-semibold tracking-widest uppercase py-2.5 mb-3 hover:bg-gray-900 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Add to basket
      </button>

      <p className="text-xs text-gray-400 mb-1">
        {product.stockQuantity > 0 ? `In stock: ${product.stockQuantity}` : 'Out of stock'}
      </p>
      <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
      <p className="text-sm font-bold text-gray-900 mt-1">${product.price}</p>
    </Link>
  )
}
