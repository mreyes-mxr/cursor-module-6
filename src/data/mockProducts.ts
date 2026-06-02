import type { Product } from '../types/product'

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p_01',
    title: 'Wireless Noise-Cancelling Headphones',
    description:
      'Immersive 40-hour battery life, adaptive ANC, and premium drivers for studio-quality sound anywhere you go.',
    price: 79.99,
    originalPrice: 129.99,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop',
    rating: 4.5,
    reviewCount: 2_348,
    badge: 'Best Seller',
    inStock: true,
  },
  {
    id: 'p_02',
    title: 'Minimalist Leather Wallet',
    description:
      'Slim RFID-blocking wallet crafted from full-grain leather. Holds up to 8 cards and fits any pocket.',
    price: 34.95,
    imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop',
    rating: 4,
    reviewCount: 871,
    inStock: true,
  },
  {
    id: 'p_03',
    title: 'Portable Espresso Maker',
    description:
      'Brew café-quality espresso anywhere with 18 bars of pressure. No electricity needed — just hot water.',
    price: 49.0,
    originalPrice: 65.0,
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop',
    rating: 4.5,
    reviewCount: 1_104,
    badge: 'Sale',
    inStock: true,
  },
  {
    id: 'p_04',
    title: 'Mechanical Keyboard — TKL',
    description:
      'Tenkeyless layout with hot-swappable switches, per-key RGB, and a solid aluminium frame.',
    price: 119.99,
    imageUrl: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop',
    rating: 5,
    reviewCount: 3_562,
    badge: 'New',
    inStock: true,
  },
  {
    id: 'p_05',
    title: 'Bamboo Desk Organiser',
    description:
      'Keep your workspace tidy with this eco-friendly 6-slot organiser made from sustainably sourced bamboo.',
    price: 22.5,
    originalPrice: 30.0,
    imageUrl: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&auto=format&fit=crop',
    rating: 3.5,
    reviewCount: 204,
    inStock: false,
  },
  {
    id: 'p_06',
    title: 'Smart Water Bottle',
    description:
      'Tracks hydration goals, glows to remind you to drink, and keeps your water cold for 24 hours.',
    price: 44.99,
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop',
    rating: 4,
    reviewCount: 638,
    inStock: true,
  },
]
