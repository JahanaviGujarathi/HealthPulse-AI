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
  { icon: Droplets, title: 'Water Safety Checker', body: 'Check simple safety ratings and cleanliness levels of your local drinking water sources.' },
  { icon: Truck, title: 'Request Clean Water', body: 'Instantly request emergency water tankers if your local supply becomes unsafe.' },
  { icon: ShieldAlert, title: 'Spam-Free Security', body: 'Simple checks keep reports genuine, making sure help goes to the families who need it most.' },
  { icon: Bell, title: 'Instant Safety Alerts', body: 'Receive clear, straightforward boil-water warnings and health advice on your mobile phone.' },
]

export function Features() {
  return (
    <>
      {/* Workflow Section */}
      <section id="how" className="border-b border-border bg-card/50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Easy Reporting
            </span>
            <h2 className="mt-2 text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Report issues & stay safe in 3 simple steps
            </h2>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              Reporting water contamination or illness is fast, secure, and protects your entire neighborhood.
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

      {/* Health & Safety Features */}
      <section id="ai" className="border-b border-border py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
              <Sparkles className="size-3.5 animate-spin" style={{ animationDuration: '8s' }} /> Safety Features
            </span>
            <h2 className="mt-2 text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Simple tools designed to keep your family healthy
            </h2>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              We make it easy to monitor water safety, get emergency resources, and protect your loved ones.
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
