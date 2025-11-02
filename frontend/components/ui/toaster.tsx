"use client"

import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cn } from "@/lib/utils"

export const Toaster = () => {
  return (
    <ToastPrimitives.Provider swipeDirection="right">
      <ToastPrimitives.Viewport className="fixed bottom-4 right-4 flex flex-col gap-2 w-[360px] z-50" />
    </ToastPrimitives.Provider>
  )
}
