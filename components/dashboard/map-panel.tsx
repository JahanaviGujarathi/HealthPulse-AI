"use client"

import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"

const HotspotMap = dynamic(() => import("./hotspot-map").then((m) => m.HotspotMap), {
  ssr: false,
  loading: () => <Skeleton className="w-full rounded-lg" style={{ height: 380 }} />,
})

export { HotspotMap }
