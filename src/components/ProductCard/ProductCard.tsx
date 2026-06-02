import { useState } from 'react'
import { StarRating } from './StarRating'
import type { ProductCardProps } from '../../types/product'

function CartIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="size-4 shrink-0"
      aria-hidden="true"
    >
      <path d="M1 1.75A.75.75 0 0 1 1.75 1h1.628a1.75 1.75 0 0 1 1.734 1.51L5.18 3a65.25 65.25 0 0 1 13.36 1.412.75.75 0 0 1 .58.875 48.645 48.645 0 0 1-1.618 6.2.75.75 0 0 1-.712.513H6a2.5 2.5 0 0 0 0 5h8.25a.75.75 0 0 1 0 1.5H6a4 4 0 0 1 0-8h.432l-.855-4.892A.25.25 0 0 0 5.35 4.5H1.75A.75.75 0 0 1 1 3.75v-2Z" />
      <path d="M7.5 15a1 1 0 1 0 0 2 1 1 0 0 0 0-2ZM14 15a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="size-4 shrink-0"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
        clipRule="evenodd"
      />
    </svg>
  )
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const {
    title,
    description,
    price,
    originalPrice,
    imageUrl,
    rating,
    reviewCount,
    badge,
    inStock = true,
  } = product

  const [added, setAdded] = useState(false)

  const discount =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : null

  function handleAddToCart() {
    if (!inStock || added) return
    onAddToCart?.(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <article
      aria-label={title}
      className={[
        'group relative flex flex-col rounded-2xl border bg-white shadow-sm overflow-hidden',
        'transition-all duration-300 ease-out',
        'hover:-translate-y-1 hover:shadow-lg',
        inStock ? 'border-gray-200' : 'border-gray-200 opacity-75',
      ].join(' ')}
    >
      {/* Badge */}
      {badge && (
        <span className="absolute top-3 left-3 z-10 rounded-full bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
          {badge}
        </span>
      )}

      {/* Discount pill */}
      {discount && (
        <span className="absolute top-3 right-3 z-10 rounded-full bg-red-500 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
          -{discount}%
        </span>
      )}

      {/* Image */}
      <div className="relative h-52 w-full overflow-hidden bg-gray-50 sm:h-60">
        <img
          src={imageUrl}
          alt={title}
          className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />
        {!inStock && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm"
            aria-hidden="true"
          >
            <span className="rounded-full bg-gray-800 px-4 py-1.5 text-sm font-semibold text-white">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        {/* Title */}
        <h3 className="line-clamp-2 text-base font-semibold leading-snug text-gray-900">
          {title}
        </h3>

        {/* Rating */}
        <StarRating rating={rating} reviewCount={reviewCount} />

        {/* Description */}
        <p className="line-clamp-2 text-sm leading-relaxed text-gray-500">
          {description}
        </p>

        {/* Price row */}
        <div className="mt-auto flex items-end gap-2 pt-1">
          <span className="text-2xl font-bold text-gray-900">
            ${price.toFixed(2)}
          </span>
          {originalPrice && (
            <span className="mb-0.5 text-sm text-gray-400 line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={!inStock}
          aria-label={
            !inStock
              ? `${title} — out of stock`
              : added
                ? `${title} added to cart`
                : `Add ${title} to cart`
          }
          aria-live="polite"
          className={[
            'mt-1 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold',
            'transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
            !inStock
              ? 'cursor-not-allowed bg-gray-100 text-gray-400'
              : added
                ? 'bg-green-600 text-white'
                : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95',
          ].join(' ')}
        >
          {added ? (
            <>
              <CheckIcon />
              Added to Cart
            </>
          ) : (
            <>
              <CartIcon />
              {inStock ? 'Add to Cart' : 'Out of Stock'}
            </>
          )}
        </button>
      </div>
    </article>
  )
}
