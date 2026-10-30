export interface Category {
  id: string
  name: string
}

export interface ProductSize {
  id: string
  size: string
  stockQuantity: number
}

export interface ProductVariant {
  id: string
  name: string
  sku: string | null
  colorName: string | null
  colorHex: string | null
  imageUrls: string[]
  sizes: ProductSize[]
  isPrimary?: boolean
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  brand: string | null
  section: string | null
  discountPercent: number | null
  isNew: boolean
  categoryId: string | null
  categoryName: string | null
  upperMaterial: string | null
  liningMaterial: string | null
  insoleMaterial: string | null
  soleMaterial: string | null
  width: string | null
  season: string | null
  heelHeight: string | null
  purpose: string | null
  style: string | null
  brandCountry: string | null
  manufactureCountry: string | null
  variants: ProductVariant[]
}

export interface BasketItem {
  productId: string
  productName: string
  price: number
  quantity: number
  imageUrl: string
  categoryName: string
}

export interface Basket {
  customerId: string
  items: BasketItem[]
  totalPrice: number
}

export interface ShippingAddress {
  street: string
  city: string
  country: string
  zipCode: string
}

export interface OrderItem {
  productId: string
  productName: string
  price: number
  quantity: number
  imageUrl: string
}

export interface Order {
  id: string
  customerId: string
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'
  shippingAddress: ShippingAddress
  items: OrderItem[]
  totalAmount: number
  createdAt: string
}

export interface FacetItem {
  value: string
  count: number
}

export interface SearchFacets {
  brands: FacetItem[]
  seasons: FacetItem[]
  sizes: FacetItem[]
  colors: FacetItem[]
  purposes: FacetItem[]
  categories: FacetItem[]
}

export interface SearchProductDocument {
  id: string
  name: string
  brand: string | null
  price: number | null
  discountPercent: number | null
  imageUrl: string | null
  categoryName: string | null
  section: string | null
  isNew: boolean
}

export interface SearchResult {
  items: SearchProductDocument[]
  total: number
  facets: SearchFacets
}