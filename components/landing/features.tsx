import {
  Bell,
  Brain,
  Droplets,
  MapPin,
  ShieldAlert,
  Truck,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react'

const flow = [
  {
    step: '01',
    title: 'Fill a Simple Report',
    body: 'Enter symptoms, choose your village, or upload a photo of local water issues. It takes less than a minute.',
  },
  {
    step: '02',
    title: 'Instant Field Verification',
    body: 'Our platform automatically reviews the submission so local ASHA health workers can verify symptoms on-site.',
  },
  {
    step: '03',
    title: 'Intervention Deployed',
    body: 'Emergency clinical teams, clean water tankers, and chlorination units are dispatched directly to affected villages.',
  },
]

const aiFeatures = [
  { icon: Brain, title: 'Symptom Triage', body: 'Flag household illness easily to get immediate clinical guidance and triage support.' },
  { icon: MapPin, title: 'Village Safety Heatmap', body: 'View a simple color-coded map showing high, medium, and safe areas in your district.' },
  { icon: Droplets, title: 'Water Safety Checker', body: 'Check laboratory safety ratings and bacterial purity levels of your drinking water sources.' },
  { icon: Truck, title: 'Request Clean Water', body: 'Instantly request emergency water tankers if your local supply becomes contaminated.' },
  { icon: ShieldAlert, title: 'Aadhaar Verified Security', body: 'Anti-misinformation safeguards keep reports genuine so medical aid reaches families first.' },
  { icon: Bell, title: 'Instant Public Alerts', body: 'Receive clear, straightforward boil-water warnings and medical advice on your mobile device.' },
]

export function Features() {
  return (
    <>
      {/* Workflow Section */}
      <section id="how" className="border-b border-[#DCE4F0] bg-white py-14 sm:py-20 dark:bg-[#0D1525] dark:border-[#1E2D45]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Header - 4 Cols */}
            <div className="lg:col-span-4 space-y-3.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#3157D5] bg-[#EEF3FF] px-3 py-1 rounded-full border border-[#DCE5FF] dark:bg-[#172554] dark:border-[#243FA8] dark:text-[#EEF3FF]">
                Surveillance Architecture
              </span>
              <h2 className="text-balance text-2xl sm:text-3xl font-bold tracking-tight text-[#172554] dark:text-[#F1F5F9]">
                Rapid Response Protocol
              </h2>
              <p className="text-sm text-[#64748B] leading-relaxed dark:text-[#94A3B8]">
                HealthPulse AI bridges the gap between field reports and regional medical dispatch, enabling outbreak detection and intervention inside a 24-hour operational window.
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#172033] pt-1 dark:text-[#F1F5F9]">
                <ShieldCheck className="size-4 text-[#3BAA72]" />
                <span>Standardized ASHA & PHED field procedures</span>
              </div>
            </div>

            {/* Steps - 8 Cols */}
            <div className="lg:col-span-8">
              <ol className="grid gap-5 md:grid-cols-3">
                {flow.map((f, i) => (
                  <li
                    key={f.step}
                    className="relative flex flex-col gap-3 rounded-2xl p-5 bg-[#F7F9FE] border border-[#DCE4F0] hover:border-[#B8C8F5] transition-all dark:bg-[#111A2B] dark:border-[#1E2D45]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#3157D5] bg-white px-2.5 py-0.5 rounded-md border border-[#DCE4F0] dark:bg-[#162032] dark:border-[#1E2D45]">
                        Step {f.step}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-[#172554] dark:text-[#F1F5F9]">{f.title}</h3>
                    <p className="text-xs leading-relaxed text-[#64748B] dark:text-[#94A3B8]">{f.body}</p>
                    
                    {i < 2 && (
                      <div className="hidden md:block absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 text-[#94A3B8]">
                        <ArrowRight className="size-4" />
                      </div>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Health & Safety Features */}
      <section id="ai" className="border-b border-[#DCE4F0] bg-[#F7F9FE] py-14 sm:py-20 dark:bg-[#0B111E] dark:border-[#1E2D45]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#3157D5] bg-[#EEF3FF] px-3 py-1 rounded-full border border-[#DCE5FF] dark:bg-[#172554] dark:border-[#243FA8] dark:text-[#EEF3FF]">
              Core Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#172554] dark:text-[#F1F5F9]">
              Designed for Public Health Resilience
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8]">
              Essential tools connecting citizens, field workers, and state administrators into a unified surveillance system.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {aiFeatures.map((feat) => {
              const Icon = feat.icon
              return (
                <div
                  key={feat.title}
                  className="flex flex-col gap-3 rounded-2xl p-5 bg-white border border-[#DCE4F0] hover:border-[#3157D5] hover:shadow-xs transition-all dark:bg-[#111A2B] dark:border-[#1E2D45]"
                >
                  <div className="grid size-10 place-items-center rounded-xl bg-[#EEF3FF] text-[#3157D5] dark:bg-[#172554] dark:text-[#EEF3FF]">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="font-bold text-sm text-[#172554] dark:text-[#F1F5F9]">{feat.title}</h3>
                  <p className="text-xs leading-relaxed text-[#64748B] dark:text-[#94A3B8]">{feat.body}</p>
                </div>
              )
            })}
          </div>

        </div>
      </section>
    </>
  )
}
