import React from 'react'
import { PhoneCall } from 'lucide-react'

export function FormattedMarkdownText({ content }: { content: string }) {
  if (!content) return null

  // Clean HTML entities like &bull;
  const cleanContent = content.replace(/&bull;/g, '•')

  // Helper to parse phone numbers 108, 104, 1915 into interactive call chips
  const parsePhoneAndBold = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|\b108\b|\b104\b|\b1915\b)/g)

    return parts.map((part, pIdx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const inner = part.slice(2, -2)
        if (inner === '108' || inner === '104' || inner === '1915') {
          return (
            <a
              key={pIdx}
              href={`tel:${inner}`}
              className="inline-flex items-center gap-1 mx-0.5 px-2 py-0.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 font-black hover:bg-rose-500/25 transition-all shadow-xs"
            >
              <PhoneCall className="size-3 animate-pulse" /> {inner}
            </a>
          )
        }
        return (
          <strong key={pIdx} className="font-extrabold text-foreground">
            {inner}
          </strong>
        )
      }

      if (part === '108' || part === '104' || part === '1915') {
        return (
          <a
            key={pIdx}
            href={`tel:${part}`}
            className="inline-flex items-center gap-1 mx-0.5 px-2 py-0.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 font-black hover:bg-rose-500/25 transition-all shadow-xs"
          >
            <PhoneCall className="size-3 animate-pulse" /> {part}
          </a>
        )
      }

      return part
    })
  }

  const lines = cleanContent.split('\n')

  return (
    <div className="space-y-1.5 leading-relaxed text-xs">
      {lines.map((line, idx) => {
        const trimmed = line.trim()
        if (!trimmed) return <div key={idx} className="h-1" />

        const parsedLine = parsePhoneAndBold(line)

        if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
          const bulletText = trimmed.startsWith('•') ? trimmed.slice(1).trim() : trimmed.slice(1).trim()
          const bulletParts = parsePhoneAndBold(bulletText)

          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="text-primary font-bold select-none">•</span>
              <span className="flex-1">{bulletParts}</span>
            </div>
          )
        }

        return <p key={idx}>{parsedLine}</p>
      })}
    </div>
  )
}
