"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value?: number[]
  onValueChange?: (value: number[]) => void
  min?: number
  max?: number
  step?: number
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value = [0], onValueChange, min = 0, max = 100, step = 1, ...props }, ref) => {
    const val = Array.isArray(value) ? value[0] : 0

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const num = Number(e.target.value)
      onValueChange?.([num])
    }

    return (
      <div className={cn("relative flex w-full touch-none select-none items-center", className)}>
        <input
          type="range"
          ref={ref}
          min={min}
          max={max}
          step={step}
          value={val}
          onChange={handleChange}
          className="w-full h-2 rounded-lg bg-muted appearance-none cursor-pointer accent-primary focus:outline-none"
          {...props}
        />
      </div>
    )
  }
)
Slider.displayName = "Slider"

export { Slider }
