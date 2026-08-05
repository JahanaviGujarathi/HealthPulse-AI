'use client'

import { useState } from 'react'
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Clock,
  Droplets,
  FileText,
  HeartPulse,
  Home,
  MapPin,
  PhoneCall,
  Send,
  ShieldCheck,
  Sparkles,
  Truck,
  UserCheck,
  Bell,
  HelpCircle,
  Plus,
  Fingerprint,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { StatCard, SectionHeader } from '@/components/dashboard/primitives'
import { HotspotMap } from '@/components/dashboard/map-panel'
import { AWARENESS, DISEASE_REPORTS, HOSPITALS, type DiseaseReport } from '@/lib/data'
import { toast } from 'sonner'
import { sanitizeInput, maskAadhaar } from '@/lib/security'
import { getAuthSession } from '@/lib/auth'

export function CitizenDashboard({ section }: { section: string }) {
  const session = getAuthSession()
  const userAadhaar = session?.aadhaar ? maskAadhaar(session.aadhaar) : 'XXXX-XXXX-4921'

  const [reports, setReports] = useState<DiseaseReport[]>(DISEASE_REPORTS)
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [patientName, setPatientName] = useState(session?.name || 'Rahul Das')
  const [villageName, setVillageName] = useState('Kamalabari, Majuli')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tankerRequested, setTankerRequested] = useState(false)

  const commonSymptoms = [
    'Fever / Chills',
    'Vomiting',
    'Watery diarrhea',
    'Severe dehydration',
    'Abdominal pain',
    'Yellow eyes / Jaundice',
  ]

  const handleSymptomToggle = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom],
    )
  }

  const handleRequestTanker = () => {
    setTankerRequested(true)
    toast.success('Clean Water Tanker Requested!', {
      description: 'Your request for Kamalabari Sector 2 has been routed to the PHED Water Officer.',
    })
  }

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedSymptoms.length === 0) {
      toast.error('Please select at least one symptom')
      return
    }

    setIsSubmitting(true)
    const cleanName = sanitizeInput(patientName) || 'Rahul Das'
    const cleanVillage = sanitizeInput(villageName) || 'Kamalabari'
    const cleanNotes = sanitizeInput(notes)

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient: `${cleanName} (Aadhaar: ${userAadhaar})`,
          village: cleanVillage,
          disease: 'Suspected Symptom',
          symptoms: selectedSymptoms,
          source: 'Citizen Aadhaar Verified',
          severity: selectedSymptoms.length >= 3 ? 'high' : 'medium',
          notes: cleanNotes,
        }),
      })

      const data = await res.json()
      if (res.ok && data.report) {
        setReports([data.report, ...reports])
        toast.success('Report submitted to local ASHA worker!', {
          description: `Tracking ID #${data.report.id} created for ASHA Worker Anjali Boro. Linked to Aadhaar ${userAadhaar}.`,
        })
        setSelectedSymptoms([])
        setNotes('')
      } else {
        toast.error(data.error || 'Failed to submit report')
      }
    } catch (err) {
      toast.error('Network error submitting report')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Render Society Bulletin overview section
  if (section === 'overview' || !section) {
    return (
      <div className="space-y-6">
        {/* Welcome Community Header */}
        <div className="rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-amber-500/10 to-emerald-500/10 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                  👋 Majuli Village Community Society Bulletin
                </span>
                <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs gap-1">
                  <Fingerprint className="size-3 text-emerald-500" /> Aadhaar Verified: {userAadhaar}
                </Badge>
              </div>
              <h2 className="mt-2 text-2xl font-extrabold text-foreground sm:text-3xl">
                Good morning, {patientName.split(' ')[0]}!
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                Here is today{"'"}s water safety status and health news for your neighborhood in Kamalabari.
              </p>
            </div>

            <Button
              size="lg"
              onClick={() => {
                const el = document.getElementById('quick-report')
                if (el) el.scrollIntoView({ behavior: 'smooth' })
              }}
              className="gap-2 font-bold shadow-md bg-primary hover:bg-primary/90 text-primary-foreground shrink-0"
            >
              <Plus className="size-4" /> Report Health or Water Issue
            </Button>
          </div>
        </div>

        {/* Community Water Safety Alert Banner */}
        <Card className="border-amber-500/40 bg-amber-500/10 shadow-sm">
          <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="grid size-10 place-items-center rounded-xl bg-amber-500 text-white shrink-0 mt-0.5">
                <Droplets className="size-5 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-amber-800 dark:text-amber-300 uppercase tracking-wide">
                    Boil Water Advisory Active
                  </span>
                  <Badge variant="outline" className="text-[10px] bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-500/40 font-bold">
                    Kamalabari Well #3
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-amber-900/80 dark:text-amber-200 leading-relaxed">
                  High turbidity detected in the main village well. Please boil drinking water for at least 1 minute before consuming.
                </p>
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={handleRequestTanker}
              disabled={tankerRequested}
              className="shrink-0 gap-1.5 border-amber-600/40 bg-card text-amber-800 dark:text-amber-200 hover:bg-amber-500/20 font-bold text-xs"
            >
              <Truck className="size-3.5 text-amber-600" />
              {tankerRequested ? 'Tanker Requested ✓' : 'Request Drinking Water Tanker'}
            </Button>
          </CardContent>
        </Card>

        {/* 4 Community Quick Action Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="group border-primary/20 hover:border-primary/50 transition-all duration-300 shadow-xs hover:shadow-md cursor-pointer">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                <Droplets className="size-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase">Drinking Water</p>
                <p className="text-base font-extrabold text-foreground">Boil Water Advisory</p>
                <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-0.5">Use boiled or filtered water</p>
              </div>
            </CardContent>
          </Card>

          <Card className="group border-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300 shadow-xs hover:shadow-md cursor-pointer">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="grid size-12 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 transition-transform group-hover:scale-110">
                <HeartPulse className="size-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase">Local ASHA Worker</p>
                <p className="text-base font-extrabold text-foreground">Anjali Boro</p>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">On duty in Sector 2</p>
              </div>
            </CardContent>
          </Card>

          <Card className="group border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 shadow-xs hover:shadow-md cursor-pointer">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="grid size-12 place-items-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 transition-transform group-hover:scale-110">
                <ShieldCheck className="size-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase">Nearest Health Center</p>
                <p className="text-base font-extrabold text-foreground">Kamalabari PHC</p>
                <p className="text-[11px] text-cyan-600 dark:text-cyan-400 font-semibold mt-0.5">Open 24/7 (1.2 km away)</p>
              </div>
            </CardContent>
          </Card>

          <Card className="group border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 shadow-xs hover:shadow-md cursor-pointer">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="grid size-12 place-items-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 transition-transform group-hover:scale-110">
                <FileText className="size-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase">My Family Requests</p>
                <p className="text-base font-extrabold text-foreground">{reports.length} Active Reports</p>
                <p className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold mt-0.5">Verified by health team</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main 2-Column Section */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column: Quick Report Form */}
          <div id="quick-report" className="lg:col-span-2">
            <Card className="border-primary/20 shadow-md">
              <CardHeader className="bg-primary/5">
                <CardTitle className="text-base font-bold flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <ClipboardList className="size-5 text-primary" /> Report a Health or Water Concern
                  </span>
                  <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
                    Aadhaar Linked Report
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Informing your local ASHA worker helps protect your family and neighbors. Confidential and instant.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmitReport} className="space-y-5">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="patientName" className="font-semibold">Your Verified Name</Label>
                      <Input
                        id="patientName"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        placeholder="Rahul Das"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="villageName" className="font-semibold">Your Village / Lane</Label>
                      <Input
                        id="villageName"
                        value={villageName}
                        onChange={(e) => setVillageName(e.target.value)}
                        placeholder="Kamalabari, Sector 2"
                      />
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <Label className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                      Select Symptoms or Observations
                    </Label>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {commonSymptoms.map((symptom) => (
                        <div
                          key={symptom}
                          onClick={() => handleSymptomToggle(symptom)}
                          className={`flex items-center gap-2 rounded-xl border p-3 cursor-pointer transition-all duration-200 ${
                            selectedSymptoms.includes(symptom)
                              ? 'border-primary bg-primary/10 text-primary font-bold shadow-xs'
                              : 'border-border/80 bg-card hover:bg-muted/50 text-foreground'
                          }`}
                        >
                          <Checkbox
                            checked={selectedSymptoms.includes(symptom)}
                            onCheckedChange={() => handleSymptomToggle(symptom)}
                          />
                          <span className="text-xs font-medium">{symptom}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes" className="font-semibold">Additional Details</Label>
                    <Textarea
                      id="notes"
                      placeholder="e.g. Water from local pump looks cloudy, family member has had mild fever since yesterday..."
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full gap-2 py-6 text-sm font-bold shadow-md">
                    {isSubmitting ? (
                      <>Sending Update to ASHA Worker...</>
                    ) : (
                      <>
                        <Send className="size-4" /> Submit Aadhaar Verified Report
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Community Announcements & Helplines */}
          <div className="space-y-6">
            {/* Community Announcements */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Bell className="size-4 text-primary" /> Village Society Updates
                </CardTitle>
                <CardDescription>Official announcements from Majuli Health Office</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 divide-y divide-border/60">
                <div className="pt-2">
                  <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20 font-bold mb-1">
                    TODAY 11:30 AM
                  </Badge>
                  <p className="text-xs font-bold text-foreground">Clean Water Tanker Dispatch</p>
                  <p className="text-xs text-muted-foreground mt-0.5">PHED Mobile Tanker #4 will distribute purified water near Kamalabari School field.</p>
                </div>

                <div className="pt-3">
                  <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-bold mb-1">
                    THIS SATURDAY
                  </Badge>
                  <p className="text-xs font-bold text-foreground">Free Health & Vaccination Camp</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Free typhoid checkup and chlorine tablet distribution at Garamur Primary School.</p>
                </div>

                <div className="pt-3">
                  <Badge variant="outline" className="text-[10px] bg-cyan-500/10 text-cyan-600 border-cyan-500/20 font-bold mb-1">
                    HELPLINE
                  </Badge>
                  <p className="text-xs font-bold text-foreground">Free Well Testing Available</p>
                  <p className="text-xs text-muted-foreground mt-0.5">ASHA workers are conducting free household water testing in Majuli blocks this week.</p>
                </div>
              </CardContent>
            </Card>

            {/* Helpline Emergency Toll-Free Numbers */}
            <Card className="border-destructive/20 bg-destructive/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold flex items-center gap-2 text-destructive">
                  <PhoneCall className="size-4" /> Emergency Contacts
                </CardTitle>
                <CardDescription>24/7 Medical & Water Assistance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2.5">
                <div className="rounded-xl bg-card p-3 flex items-center justify-between border border-border">
                  <div>
                    <p className="font-extrabold text-sm text-foreground">Emergency Ambulance</p>
                    <p className="text-[11px] text-muted-foreground">Toll-free 24/7</p>
                  </div>
                  <Button size="sm" variant="destructive" className="font-bold">
                    108
                  </Button>
                </div>

                <div className="rounded-xl bg-card p-3 flex items-center justify-between border border-border">
                  <div>
                    <p className="font-extrabold text-sm text-foreground">Health Advisory Line</p>
                    <p className="text-[11px] text-muted-foreground">Free Medical Advice</p>
                  </div>
                  <Button size="sm" className="font-bold">
                    104
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Clean Water & Clinic Map Card */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <MapPin className="size-4 text-primary" /> Clean Water Points & Clinics Near You
            </CardTitle>
            <CardDescription>Interactive map showing nearby safe water sources and open health centers</CardDescription>
          </CardHeader>
          <CardContent>
            <HotspotMap height={320} zoom={11} center={[26.95, 94.17]} />
          </CardContent>
        </Card>
      </div>
    )
  }

  // Render report issue page
  if (section === 'report') {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <SectionHeader
          title="Report Water or Health Issue"
          description="Submitting an update takes less than 1 minute and alerts your local health team immediately."
        />

        <Card className="border-primary/20 shadow-md">
          <CardHeader className="bg-primary/5">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <ClipboardList className="size-5 text-primary" /> Community Report Form
            </CardTitle>
            <CardDescription>
              Select any observed symptoms or water contamination issues in your household or neighborhood.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmitReport} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="patientName" className="font-semibold">Resident Name</Label>
                  <Input
                    id="patientName"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="villageName" className="font-semibold">Village / Lane</Label>
                  <Input
                    id="villageName"
                    value={villageName}
                    onChange={(e) => setVillageName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Select Symptoms</Label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {commonSymptoms.map((symptom) => (
                    <div
                      key={symptom}
                      onClick={() => handleSymptomToggle(symptom)}
                      className={`flex items-center gap-2 rounded-xl border p-3 cursor-pointer transition-all ${
                        selectedSymptoms.includes(symptom)
                          ? 'border-primary bg-primary/10 text-primary font-bold'
                          : 'border-border/80 bg-card hover:bg-muted/50 text-foreground'
                      }`}
                    >
                      <Checkbox
                        checked={selectedSymptoms.includes(symptom)}
                        onCheckedChange={() => handleSymptomToggle(symptom)}
                      />
                      <span className="text-xs font-medium">{symptom}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="font-semibold">Describe Problem</Label>
                <Textarea
                  id="notes"
                  placeholder="e.g. Water smells unpleasant, family member experiencing stomach cramps..."
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full gap-2 py-6 text-sm font-bold shadow-md">
                {isSubmitting ? (
                  <>Submitting Secured Report...</>
                ) : (
                  <>
                    <Send className="size-4" /> Send Update to ASHA Worker
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Render map page
  if (section === 'map') {
    return (
      <div className="space-y-6">
        <SectionHeader
          title="Clean Water & Nearby Clinics"
          description="Find safe drinking water distribution points and open hospitals in your block."
        />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <HotspotMap height={450} zoom={11} center={[26.95, 94.17]} />
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold">Open Clinics & Hospitals</CardTitle>
              <CardDescription>Available emergency beds in Jorhat district</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {HOSPITALS.map((h) => (
                <div key={h.id} className="rounded-xl border border-border p-3 space-y-1">
                  <div className="flex justify-between items-start">
                    <p className="font-bold text-sm text-foreground">{h.name}</p>
                    <Badge variant="outline" className="text-[10px]">
                      {h.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Available Beds: <span className="font-bold text-emerald-600 dark:text-emerald-400">{h.bedsAvailable}</span> / {h.beds}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Render my family reports
  if (section === 'reports') {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <SectionHeader title="My Family Health & Water Requests" description="Track verification and water tanker dispatch status." />
        <div className="space-y-3">
          {reports.map((r) => (
            <Card key={r.id} className="overflow-hidden">
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-foreground">{r.patient}</span>
                    <Badge variant="outline" className="text-xs">
                      {r.village}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{r.reportedAt}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Symptoms / Notes: {r.symptoms.join(', ')}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={
                    r.status === 'confirmed'
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 font-bold'
                      : 'border-amber-500/30 bg-amber-500/10 text-amber-600 font-bold'
                  }
                >
                  {r.status === 'confirmed' ? 'Verified by ASHA' : 'Pending Verification'}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Render awareness section
  if (section === 'awareness') {
    return (
      <div className="space-y-6">
        <SectionHeader title="Water Safety & Hygiene Tips" description="Simple steps to keep your home and drinking water safe." />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {AWARENESS.map((a) => (
            <Card key={a.id} className="hover:border-primary/40 transition-colors">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <Badge variant="secondary" className="text-xs font-bold">{a.tag}</Badge>
                  <BookOpen className="size-4 text-primary" />
                </div>
                <CardTitle className="text-base mt-2 font-bold">{a.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground leading-relaxed">{a.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return null
}
