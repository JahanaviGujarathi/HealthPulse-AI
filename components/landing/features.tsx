import {
  Bell,
  Brain,
  Droplets,
  MapPin,
  ShieldAlert,
  Truck,
  Sparkles,
  Zap,
} from 'lucide-react'

const flow = [
  {
    step: '01',
    title: 'Multi-Source Data Intake',
    body: 'Citizens, ASHA field workers, doctors, pathology labs, and water officers submit symptoms, clinical records, and water quality assays — online or offline.',
  },
  {
    step: '02',
    title: 'AI Neural Inference Engine',
    body: 'Predictive models fuse symptom velocity, bacterial culture counts, pH/turbidity, and weather forecasts to predict outbreak risks 7 days in advance.',
  },
  {
    step: '03',
    title: 'Automated Real-Time Response',
    body: 'District Health Officers and Collectors approve high-priority advisories; Rapid Response Teams (RRT) and water chlorination units dispatch automatically.',
  },
]

const aiFeatures = [
  { icon: Brain, title: 'Outbreak Risk Forecasting', body: 'Predicts disease, risk percentage (0-100%), and model confidence score from symptoms, lab assays, water quality, and rainfall.' },
  { icon: MapPin, title: 'Geospatial Hotspot Clustering', body: 'Generates live heatmaps of high, medium, and safe villages from GPS coordinates and active case density.' },
  { icon: Droplets, title: 'Water Contamination Classifier', body: 'Forecasts bacterial contamination from pH, turbidity (NTU), residual chlorine (mg/L), and coliform counts.' },
  { icon: Truck, title: 'Resource Pre-positioning Model', body: 'Projects required hospital beds, doctors, ORS packets, IV fluids, and mobile water tankers per block.' },
  { icon: ShieldAlert, title: 'XSS & Duplicate Detection', body: 'Secure, high-fidelity anomaly filters sanitize inputs and automatically merge duplicate citizen submissions.' },
  { icon: Bell, title: 'Advisory Authorization Pipeline', body: 'Auto-drafts emergency boil-water alerts and government orders, requiring DHO/Collector authorization before broadcast.' },
]

export function Features() {
  return (
    <>
      {/* Workflow Section */}
      <section id="how" className="border-b border-border bg-card/50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Epidemiology Workflow
            </span>
            <h2 className="mt-2 text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              From field symptom intake to frontline emergency response
            </h2>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              A closed-loop surveillance pipeline bridging community health workers and district administration.
            </p>
          </div>

          <ol className="mt-12 grid gap-6 md:grid-cols-3">
            {flow.map((f) => (
              <li
                key={f.step}
                className="group relative flex flex-col gap-4 rounded-2xl border border-border/80 bg-background p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/60 hover:shadow-2xl"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-lg transition-transform group-hover:scale-110">
                    {f.step}
                  </span>
                  <Zap className="size-4 text-muted-foreground/40 group-hover:text-primary group-hover:rotate-12 transition-all duration-300" />
                </div>
                <h3 className="text-lg font-bold text-foreground transition-colors group-hover:text-primary">{f.title}</h3>
                <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* AI Models Architecture */}
      <section id="ai" className="border-b border-border py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <Sparkles className="size-3.5 animate-spin" style={{ animationDuration: '8s' }} /> Intelligence Layer
            </span>
            <h2 className="mt-2 text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Six neural models working in unison to prevent epidemics
            </h2>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              Engineered specifically for public health surveillance across rural and urban districts.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {aiFeatures.map((f) => (
              <div
                key={f.title}
                className="group flex flex-col gap-3 rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-2 hover:border-primary/50 hover:shadow-2xl"
              >
                <div className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                  <f.icon className="size-6 transition-colors" />
                </div>
                <h3 className="font-bold text-foreground text-base mt-1 transition-colors group-hover:text-primary">{f.title}</h3>
                <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
