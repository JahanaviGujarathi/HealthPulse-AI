"use client"

import { useEffect, useRef } from "react"
import type { Map as LeafletMap, CircleMarker } from "leaflet"
import { VILLAGES as villages, type Village } from "@/lib/data"
import { severityColorVar } from "@/components/dashboard/severity"

type MapPoint = {
  id: string
  name: string
  lat: number
  lng: number
  cases: number
  severity: Village["risk"]
  detail?: string
}

export function HotspotMap({
  points,
  height = 380,
  center = [26.14, 91.73],
  zoom = 8,
}: {
  points?: MapPoint[]
  height?: number
  center?: [number, number]
  zoom?: number
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<LeafletMap | null>(null)

  const data: MapPoint[] =
    points ??
    villages.map((v) => ({
      id: v.id,
      name: v.name,
      lat: v.lat,
      lng: v.lng,
      cases: v.activeCases,
      severity: v.risk,
      detail: `${v.block} block`,
    }))

  useEffect(() => {
    let markers: CircleMarker[] = []
    let cancelled = false

    async function init() {
      const L = await import("leaflet")
      if (cancelled || !containerRef.current) return

      if (!mapRef.current) {
        mapRef.current = L.map(containerRef.current, {
          center,
          zoom,
          scrollWheelZoom: false,
          attributionControl: true,
        })
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 18,
          attribution: "&copy; OpenStreetMap contributors",
        }).addTo(mapRef.current)
      }

      const map = mapRef.current
      const style = getComputedStyle(document.documentElement)
      const resolve = (v: string) => style.getPropertyValue(v).trim() || "#0e7490"

      data.forEach((p) => {
        const color = resolve(severityColorVar(p.severity))
        const radius = Math.max(8, Math.min(28, 6 + p.cases / 3))
        const marker = L.circleMarker([p.lat, p.lng], {
          radius,
          color,
          weight: 2,
          fillColor: color,
          fillOpacity: 0.35,
        })
          .addTo(map)
          .bindPopup(
            `<strong>${p.name}</strong><br/>${p.detail ?? ""}<br/><b>${p.cases}</b> active cases &middot; ${p.severity} risk`,
          )
        markers.push(marker)
      })
    }

    init()

    return () => {
      cancelled = true
      markers.forEach((m) => m.remove())
      markers = []
    }
  }, [data, center, zoom])

  useEffect(() => {
    return () => {
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{ height }}
      className="w-full overflow-hidden rounded-lg border border-border z-0"
      role="img"
      aria-label="Map showing disease hotspot locations by severity"
    />
  )
}
