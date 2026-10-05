export interface Category {
  id: string
  name: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  stockQuantity: number
  imageUrl: string
  categoryId: string | null
  categoryName: string | null
}

export interface BasketItem {
  productId: string
  productName: string
  price: number
  quantity: number
  imageUrl: string
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