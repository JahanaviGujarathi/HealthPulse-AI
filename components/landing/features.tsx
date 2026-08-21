import {
  Bell,
  Brain,
  Droplets,
  MapPin,
  ShieldAlert,
  Truck,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  ClipboardList,
} from 'lucide-react'

const flow = [
  {
    step: '01',
    title: 'Fill a Simple Report',
    body: 'Enter symptoms, choose your village, or upload a photo of local water issues. It takes less than a minute!',
  },
  {
    step: '02',
    title: 'Instant Verification',
    body: 'Our platform automatically reviews the submission so local health workers can address your issue right away.',
  },
  {
    step: '03',
    title: 'Help is Deployed',
    body: 'Emergency teams, clean water tankers, and chlorination units are dispatched directly to affected villages.',
  },
]

const aiFeatures = [
  { icon: Brain, title: 'Simple Symptom Reports', body: 'Flag any household illness easily to get immediate support from local health workers.' },
  { icon: MapPin, title: 'Village Safety Heatmap', body: 'View a simple color-coded map showing high, medium, and safe areas in your district.' },
  { icon: Droplets, title: 'Water Safety Checker', body: 'Check simple safety ratings and cleanliness levels of your drinking water sources.' },
  { icon: Truck, title: 'Request Clean Water', body: 'Instantly request emergency water tankers if your local supply becomes unsafe.' },
  { icon: ShieldAlert, title: 'Spam-Free Security', body: 'Simple checks keep reports genuine, making sure help goes to the families who need it most.' },
  { icon: Bell, title: 'Instant Safety Alerts', body: 'Receive clear, straightforward boil-water warnings and health advice on your mobile phone.' },
]

export function Features() {
  return (
    <>
      {/* Workflow Section */}
      <section id="how" className="border-b border-border bg-gradient-to-b from-background via-secondary/5 to-background py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Header - 4 Cols */}
            <div className="lg:col-span-4 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
                Surveillance Flow
              </span>
              <h2 className="text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Rapid Response Architecture
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                HealthPulse AI bridges the gap between field reports and regional medical dispatch, enabling outbreak detection inside a 24-hour window.
              </p>
              <div className="flex items-center gap-2 text-xs font-extrabold text-muted-foreground">
                <ShieldCheck className="size-4 text-emerald-500" />
                <span>ASHA verified dispatch standards</span>
              </div>
            </div>

            {/* Steps - 8 Cols */}
            <div className="lg:col-span-8">
              <ol className="grid gap-6 md:grid-cols-3">
                {flow.map((f, i) => (
                  <li
                    key={f.step}
                    className="group relative flex flex-col gap-4 rounded-3xl p-6 glass-card glass-card-hover border-border/80"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-black text-primary bg-primary/10 px-3 py-1 rounded-lg">
                        STAGE {f.step}
                      </span>
                      <Zap className="size-4 text-muted-foreground/30 group-hover:text-primary group-hover:rotate-12 transition-all duration-300" />
                    </div>
                    <h3 className="text-base font-black text-foreground transition-colors group-hover:text-primary">{f.title}</h3>
                    <p className="text-xs sm:text-xs leading-relaxed text-muted-foreground font-medium">{f.body}</p>
                    
                    {i < 2 && (
                      <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-10 text-muted-foreground/20 group-hover:text-primary/40 transition-colors">
                        <ArrowRight className="size-6" />
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
      <section id="ai" className="border-b border-border bg-gradient-to-b from-background via-secondary/5 to-background py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
                <Sparkles className="size-3.5 animate-spin" style={{ animationDuration: '8s' }} /> Safety Features
              </span>
              <h2 className="mt-4 text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Diagnostic & Prevention Capabilities
              </h2>
            </div>
            <p className="text-sm text-muted-foreground max-w-md font-medium">
              We empower communities and medical staff with localized telemetry monitoring, mapping vector loads and verifying clinical diagnostics.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {aiFeatures.map((f) => (
              <div
                key={f.title}
                className="group flex flex-col gap-4 rounded-3xl p-6 glass-card glass-card-hover border-border/80"
              >
                <div className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary transition-transform duration-350 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground shadow-xs">
                  <f.icon className="size-5 transition-colors" />
                </div>
                <h3 className="font-black text-foreground text-sm mt-1 transition-colors group-hover:text-primary">{f.title}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground font-medium">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
