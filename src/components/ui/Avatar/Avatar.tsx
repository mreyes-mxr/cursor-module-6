interface AvatarProps {
  src?: string
  alt: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeClasses = {
  sm: 'size-9 text-sm',
  md: 'size-12 text-base',
  lg: 'size-20 text-2xl',
  xl: 'size-28 text-4xl',
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function Avatar({ src, alt, size = 'md', className = '' }: AvatarProps) {
  const base = [
    'relative inline-flex shrink-0 items-center justify-center',
    'rounded-full bg-gradient-to-br from-violet-500 to-blue-500',
    'font-semibold text-white select-none overflow-hidden',
    sizeClasses[size],
    className,
  ].join(' ')

  return (
    <div className={base} role="img" aria-label={alt}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className="size-full object-cover"
          onError={(e) => {
            // Fall back to initials on broken image
            ;(e.currentTarget as HTMLImageElement).style.display = 'none'
          }}
        />
      ) : (
        <span aria-hidden="true">{getInitials(alt)}</span>
      )}
    </div>
  )
}
