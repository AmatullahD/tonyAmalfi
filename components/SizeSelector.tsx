"use client"

interface SizeSelectorProps {
  sizes: string[]
  selectedSize: string
  onSizeChange: (size: string) => void
}

export const SizeSelector = ({ sizes, selectedSize, onSizeChange }: SizeSelectorProps) => {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium uppercase tracking-wider">Size</label>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => onSizeChange(size)}
            className={`
              px-6 py-3 min-w-[60px] border-2 transition-base text-sm font-medium uppercase tracking-wider
              ${
                selectedSize === size
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background hover:border-primary"
              }
            `}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  )
}
