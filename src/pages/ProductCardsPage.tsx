import { useState } from 'react'
import { ProductCard } from '../components/ProductCard'
import { MOCK_PRODUCTS } from '../data/mockProducts'
import type { Product } from '../types/product'

export function ProductCardsPage() {
  const [cartCount, setCartCount] = useState(0)
  const [toast, setToast] = useState<string | null>(null)

  function handleAddToCart(product: Product) {
    setCartCount((n) => n + 1)
    setToast(`"${product.title}" added to cart`)
    setTimeout(() => setToast(null), 2500)
  }

  return (
    <main className="flex flex-1 flex-col items-center px-4 py-12">
      {/* Page header */}
      <div className="w-full max-w-5xl mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Product Cards
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Showcasing the{' '}
            <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-gray-700">
              &lt;ProductCard /&gt;
            </code>{' '}
            component — hover a card to see the animations.
          </p>
        </div>

        {/* Cart counter */}
        <div
          aria-live="polite"
          aria-label={`${cartCount} items in cart`}
          className="flex items-center gap-2 self-start sm:self-auto rounded-xl border border-gray-200 bg-white px-4 py-2 shadow-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-5 text-blue-600"
            aria-hidden="true"
          >
            <path d="M1 1.75A.75.75 0 0 1 1.75 1h1.628a1.75 1.75 0 0 1 1.734 1.51L5.18 3a65.25 65.25 0 0 1 13.36 1.412.75.75 0 0 1 .58.875 48.645 48.645 0 0 1-1.618 6.2.75.75 0 0 1-.712.513H6a2.5 2.5 0 0 0 0 5h8.25a.75.75 0 0 1 0 1.5H6a4 4 0 0 1 0-8h.432l-.855-4.892A.25.25 0 0 0 5.35 4.5H1.75A.75.75 0 0 1 1 3.75v-2Z" />
            <path d="M7.5 15a1 1 0 1 0 0 2 1 1 0 0 0 0-2ZM14 15a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z" />
          </svg>
          <span className="text-sm font-semibold text-gray-900">
            {cartCount} {cartCount === 1 ? 'item' : 'items'} in cart
          </span>
        </div>
      </div>

      {/* Grid */}
      <section
        aria-label="Product listing"
        className="w-full max-w-5xl grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {MOCK_PRODUCTS.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </section>

      {/* Toast notification */}
      <div
        role="status"
        aria-live="assertive"
        aria-atomic="true"
        className={[
          'fixed bottom-6 left-1/2 -translate-x-1/2 z-50',
          'flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white shadow-lg',
          'transition-all duration-300 ease-out',
          toast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none',
        ].join(' ')}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="size-4 text-green-400 shrink-0"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
            clipRule="evenodd"
          />
        </svg>
        {toast}
      </div>
    </main>
  )
}
