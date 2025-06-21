"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const tooltipContentVariants = cva(
  "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  {
    variants: {
      variant: {
        default: "bg-popover text-popover-foreground border",
        dark: "bg-gray-900 text-white border-gray-700",
        light: "bg-white text-gray-900 border-gray-200",
        success: "bg-green-50 text-green-900 border-green-200",
        warning: "bg-yellow-50 text-yellow-900 border-yellow-200",
        error: "bg-red-50 text-red-900 border-red-200",
        info: "bg-blue-50 text-blue-900 border-blue-200",
      },
      size: {
        sm: "px-2 py-1 text-xs",
        default: "px-3 py-1.5 text-sm",
        lg: "px-4 py-2 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface TooltipContentProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>,
    VariantProps<typeof tooltipContentVariants> {
  sideOffset?: number
}

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(({ className, variant, size, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(tooltipContentVariants({ variant, size, className }))}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

// 便捷的组合组件
export interface SimpleTooltipProps {
  content: React.ReactNode
  children: React.ReactNode
  variant?: VariantProps<typeof tooltipContentVariants>["variant"]
  size?: VariantProps<typeof tooltipContentVariants>["size"]
  side?: "top" | "right" | "bottom" | "left"
  align?: "start" | "center" | "end"
  delayDuration?: number
  sideOffset?: number
  className?: string
  disabled?: boolean
}

const SimpleTooltip = ({
  content,
  children,
  variant = "default",
  size = "default",
  side = "top",
  align = "center",
  delayDuration = 400,
  sideOffset = 4,
  className,
  disabled = false,
}: SimpleTooltipProps) => {
  if (disabled) {
    return <>{children}</>
  }

  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          variant={variant}
          size={size}
          side={side}
          align={align}
          sideOffset={sideOffset}
          className={className}
        >
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  SimpleTooltip,
  tooltipContentVariants,
}