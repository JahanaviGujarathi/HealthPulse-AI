'use client'

import { useState, useEffect } from 'react'
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
import { InteractiveDiseaseMapSection } from '@/components/landing/interactive-disease-map'
import { AWARENESS, DISEASE_REPORTS, HOSPITALS, type DiseaseReport } from '@/lib/data'
import { toast } from 'sonner'
import { sanitizeInput, maskAadhaar } from '@/lib/security'
import { getAuthSession } from '@/lib/auth'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

export function CitizenDashboard({ section }: { section: string }) {
  const session = getAuthSession()
  const userAadhaar = session?.aadhaar ? maskAadhaar(session.aadhaar) : 'XXXX-XXXX-4921'

  const [reports, setReports] = useState<DiseaseReport[]>(DISEASE_REPORTS)

  useEffect(() => {
    let active = true
    const fetchReports = async () => {
      try {
        const res = await fetch('/api/reports?role=citizen')
        const data = await res.json()
        if (active && res.ok && data.reports) {
          setReports(data.reports)
        }
      } catch (err) {
        console.error('Error fetching citizen reports:', err)
      }
    }
    fetchReports()
    return () => {
      active = false
    }
  }, [])
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [patientName, setPatientName] = useState(session?.name || 'Rahul Das')
  const [villageName, setVillageName] = useState('Kamalabari, Majuli')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tankerRequested, setTankerRequested] = useState(false)
  const [reportDialogOpen, setReportDialogOpen] = useState(false)

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
        setReportDialogOpen(false)
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
        {/* Modern Minimalist Welcome & Water Safety Status Banner */}
        <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-amber-500/5 to-transparent p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-700 dark:text-amber-300">
                ⚠️ Water Alert: Boil advisory active in Kamalabari
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-foreground sm:text-3xl tracking-tight">
              Hello, {patientName.split(' ')[0]}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xl">
              High turbidity detected in Kamalabari Well #3. Please boil drinking water for at least 1 minute.
            </p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground pt-2.5 mt-2.5 border-t border-border/40">
              <span className="flex items-center gap-1.5">
                👩‍⚕️ <span className="font-semibold text-foreground">ASHA Worker:</span> Anjali Boro
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                🏥 <span className="font-semibold text-foreground">Nearest Clinic:</span> Kamalabari PHC (1.2 km)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                📋 <span className="font-semibold text-foreground">My Reports:</span> {reports.length} Active
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <Button
              size="lg"
              onClick={() => setReportDialogOpen(true)}
              className="gap-2 font-extrabold shadow-md bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
            >
              <Plus className="size-4" /> Report an Issue
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleRequestTanker}
              disabled={tankerRequested}
              className="gap-2 font-extrabold border-amber-600/30 bg-amber-500/10 text-amber-800 dark:text-amber-200 hover:bg-amber-500/20 rounded-xl"
            >
              <Truck className="size-4 text-amber-600" />
              {tankerRequested ? 'Tanker Sent ✓' : 'Request Clean Water'}
            </Button>
          </div>
        </div>

        {/* Interactive State-Wise Disease Surveillance Map */}
        <InteractiveDiseaseMapSection />

        {/* Emergency Contacts Card (1-Click Call Helplines) */}
        <div className="max-w-3xl mx-auto">
          <Card className="border-destructive/30 bg-destructive/5 shadow-md">
            <CardHeader className="pb-3 text-center">
              <CardTitle className="text-base font-extrabold flex items-center justify-center gap-2 text-destructive">
                <PhoneCall className="size-5 animate-pulse text-destructive" /> 24/7 Interactive Emergency Helplines
              </CardTitle>
              <CardDescription>Click any helpline to dial 24/7 Medical, Ambulance, or Water Supply assistance</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl bg-card p-4 flex flex-col justify-between border border-border shadow-xs hover:border-destructive/50 transition-all">
                <div>
                  <p className="font-extrabold text-sm text-foreground flex items-center gap-1.5">🚨 Ambulance</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Toll-free 24/7 dispatch</p>
                </div>
                <a href="tel:108" className="mt-3 block">
                  <Button size="sm" variant="destructive" className="w-full font-black gap-1.5 shadow-md hover:scale-105 transition-all">
                    <PhoneCall className="size-3.5" /> Call 108
                  </Button>
                </a>
              </div>

              <div className="rounded-2xl bg-card p-4 flex flex-col justify-between border border-border shadow-xs hover:border-primary/50 transition-all">
                <div>
                  <p className="font-extrabold text-sm text-foreground flex items-center gap-1.5">🏥 Doctor Helpline</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Free Tele-consultation</p>
                </div>
                <a href="tel:104" className="mt-3 block">
                  <Button size="sm" className="w-full font-black gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:scale-105 transition-all">
                    <PhoneCall className="size-3.5" /> Call 104
                  </Button>
                </a>
              </div>

              <div className="rounded-2xl bg-card p-4 flex flex-col justify-between border border-border shadow-xs hover:border-amber-500/50 transition-all">
                <div>
                  <p className="font-extrabold text-sm text-foreground flex items-center gap-1.5">💧 Water Supply</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">PHED Tanker Request</p>
                </div>
                <a href="tel:1915" className="mt-3 block">
                  <Button size="sm" variant="outline" className="w-full font-black gap-1.5 border-amber-500/40 bg-amber-500/10 text-amber-800 dark:text-amber-200 hover:bg-amber-500/20 shadow-md hover:scale-105 transition-all">
                    <PhoneCall className="size-3.5 text-amber-600" /> Call 1915
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dialog Modal Pop-up for Reporting */}
        <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <ClipboardList className="size-5 text-primary" /> Report a Health or Water Concern
              </DialogTitle>
              <DialogDescription>
                Informing your local ASHA worker helps protect your family and neighbors. Linked to Aadhaar {userAadhaar}.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitReport} className="space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="dialogPatientName" className="font-semibold">Your Name</Label>
                  <Input
                    id="dialogPatientName"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Rahul Das"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dialogVillageName" className="font-semibold">Your Village / Lane</Label>
                  <Input
                    id="dialogVillageName"
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
                      className={`flex items-center gap-2 rounded-xl border p-2.5 cursor-pointer transition-all duration-200 ${
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
                <Label htmlFor="dialogNotes" className="font-semibold">Additional Details</Label>
                <Textarea
                  id="dialogNotes"
                  placeholder="e.g. Water from local pump looks cloudy, family member has had mild fever since yesterday..."
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full gap-2 py-6 text-sm font-bold shadow-md">
                {isSubmitting ? (
                  <>Sending Update...</>
                ) : (
                  <>
                    <Send className="size-4" /> Submit Aadhaar Verified Report
                  </>
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>


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

        {/* National State-Wise Surveillance Map */}
        <InteractiveDiseaseMapSection />
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
