"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import { Plane, Search } from "lucide-react"

export type AirportOption = {
  code: string
  name: string
  city?: string
  country?: string
}

interface AirportSelectProps {
  label: string
  value: AirportOption | null
  onChange: (airport: AirportOption | null) => void
  placeholder?: string
}

export default function AirportSelect({ label, value, onChange, placeholder }: AirportSelectProps) {
  const [query, setQuery] = useState("")
  const [options, setOptions] = useState<AirportOption[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const controllerRef = useRef<AbortController | null>(null)

  const apiBase = useMemo(() => {
    // Resolve a robust API base regardless of how NEXT_PUBLIC_BACKEND_URL is set.
    // Supported examples:
    // - http://localhost:8084                -> http://localhost:8084/api
    // - http://localhost:8084/               -> http://localhost:8084/api
    // - http://localhost:8084/api            -> http://localhost:8084/api
    // - http://localhost:8080/api/flights    -> http://localhost:8080/api
    const raw = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8084"
    try {
      const u = new URL(raw)
      // If path already contains /api, normalize to that root; otherwise append /api
      const path = u.pathname.replace(/\/$/, "")
      const hasApi = path === "/api" || path.startsWith("/api/")
      const basePath = hasApi ? "/api" : "/api"
      return `${u.origin}${basePath}`
    } catch (_) {
      // Fallback: treat as origin string
      const origin = raw.replace(/\/$/, "")
      // If it already ends with /api or contains /api/ deeper, normalize to /api
      if (/\/api(\/|$)/.test(origin)) {
        return origin.replace(/\/api(?:\/.*)?$/, "/api")
      }
      return `${origin}/api`
    }
  }, [])

  useEffect(() => {
    if (!query || query.length < 2) {
      setOptions([])
      return
    }

    setLoading(true)
    controllerRef.current?.abort()
    const controller = new AbortController()
    controllerRef.current = controller

    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`${apiBase}/airports/autocomplete?q=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        const items = (data?.items || []) as any[]
        setOptions(
          items.map((i) => ({
            code: i.code,
            name: i.name,
            city: i.city,
            country: i.country,
          }))
        )
      } catch (e) {
        if ((e as any).name !== "AbortError") {
          console.error("Autocomplete failed", e)
          setOptions([])
        }
      } finally {
        setLoading(false)
      }
    }, 250) // debounce

    return () => {
      clearTimeout(timeout)
      controller.abort()
    }
  }, [query, apiBase])

  return (
    <div className="w-full">
      <div className="text-xs font-medium text-gray-500 mb-2">{label.toUpperCase()}</div>
      <div className="relative">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {value ? <Plane className="h-4 w-4" /> : <Search className="h-4 w-4" />}
          </div>
          <input
            className="w-full border border-gray-200 rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
            placeholder={placeholder || "Search airport or city"}
            value={value ? `${value.city ? value.city + " - " : ""}${value.name} (${value.code})` : query}
            onChange={(e) => {
              onChange(null)
              setQuery(e.target.value)
              setOpen(true)
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 200)}
          />
        </div>
        {open && (options.length > 0 || loading) && (
          <div className="absolute z-20 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl max-h-72 overflow-auto">
            {loading && (
              <div className="p-4 text-sm text-gray-500 flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-black"></div>
                Searching airports...
              </div>
            )}
            {!loading && options.length === 0 && (
              <div className="p-4 text-sm text-gray-500">No airports found</div>
            )}
            {!loading &&
              options.map((opt) => (
                <button
                  key={opt.code + opt.name}
                  type="button"
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 first:rounded-t-xl last:rounded-b-xl"
                  onClick={() => {
                    onChange(opt)
                    setQuery("")
                    setOpen(false)
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Plane className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {opt.city ? `${opt.city} — ` : ""}
                        {opt.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {opt.code} {opt.country && `• ${opt.country}`}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}
