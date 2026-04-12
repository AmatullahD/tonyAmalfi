
"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"

type Props = {
  gaId?: string
}

export default function TrackPageViews({ gaId }: Props) {
  const pathname = usePathname()

  useEffect(() => {
    // ensure gtag is available
    if (typeof (window as any).gtag === "function" && gaId) {
      ;(window as any).gtag("config", gaId, {
        page_path: pathname,
      })
    }
  }, [pathname, gaId])

  return null
}
