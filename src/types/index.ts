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
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  brand: string | null
  gender: string | null
  discountPercent: number | null
  categoryId: string | null
  categoryName: string | null
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