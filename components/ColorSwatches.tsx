"use client"

interface ColorSwatchesProps {
  colors: { name: string; hex: string }[]
  selectedColor: string
  onColorChange: (color: string) => void
}

export const ColorSwatches = ({ colors, selectedColor, onColorChange }: ColorSwatchesProps) => {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium uppercase tracking-wider">Color</label>
      <div className="flex gap-2">
        {colors.map((color) => (
          <button
            key={color.name}
            onClick={() => onColorChange(color.name)}
            className={`
              w-10 h-10 rounded-full border-2 transition-base
              ${selectedColor === color.name ? "border-primary scale-110" : "border-border hover:scale-105"}
            `}
            style={{ backgroundColor: color.hex }}
            title={color.name}
          />
        ))}
      </div>
    </div>
  )
}
