export interface Product {
  id: string
  title: string
  description: string
  price: number
  /** Original price before discount, used to show a strikethrough */
  originalPrice?: number
  imageUrl: string
  /** 0–5, supports half-stars (e.g. 4.5) */
  rating: number
  reviewCount: number
  badge?: string
  inStock?: boolean
}

export interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
}
