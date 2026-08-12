import { Features } from '@/components/landing/features'
import { Hero } from '@/components/landing/hero'
import { RolesSection } from '@/components/landing/roles-section'
import { SiteFooter } from '@/components/landing/site-footer'
import { SiteHeader } from '@/components/landing/site-header'
import { AiChatAssistant } from '@/components/landing/ai-chat-assistant'

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <Features />
        <RolesSection />
      </main>
      <SiteFooter />
      <AiChatAssistant />
    </div>
  )
}

