'use client'

import { useState, useEffect } from 'react'
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Clock,
  Droplets,
  HeartPulse,
  MapPin,
  PhoneCall,
  Send,
  ShieldCheck,
  Sparkles,
  Truck,
  Plus,
  Lock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { SectionHeader } from '@/components/dashboard/primitives'
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
import { cn } from '@/lib/utils'

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

  // Render Citizen Overview
  if (section === 'overview' || !section) {
    return (
      <div className="space-y-6">
        {/* Cinematic Welcome & Water Safety Status Banner */}
        <div className="rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 glass-card glass-card-glow border-primary/20">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-black text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <AlertTriangle className="size-3.5 animate-bounce" />
                Water Alert: Boil advisory active in Kamalabari
              </span>
            </div>
            <h2 className="text-2xl font-black text-foreground sm:text-3xl tracking-tight">
              Hello, {patientName.split(' ')[0]}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xl">
              High turbidity detected in Kamalabari Well #3. Please boil drinking water for at least 1 minute.
            </p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground pt-3 mt-3 border-t border-border/40 font-bold">
              <span className="flex items-center gap-1.5">
                👩‍⚕️ <span className="font-extrabold text-foreground">ASHA Worker:</span> Anjali Boro
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                🏥 <span className="font-extrabold text-foreground">Nearest PHC:</span> Kamalabari (1.2 km)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                📋 <span className="font-extrabold text-foreground">Active Reports:</span> {reports.length}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <Button
              size="lg"
              onClick={() => setReportDialogOpen(true)}
              className="gap-2 font-black shadow-md shadow-primary/20 bg-gradient-to-r from-primary to-accent hover:from-primary/95 hover:to-accent/95 text-primary-foreground h-11 rounded-xl cursor-pointer"
            >
              <Plus className="size-4" /> Report Sickness
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleRequestTanker}
              disabled={tankerRequested}
              className={cn(
                "gap-2 font-black h-11 rounded-xl transition-all duration-300",
                tankerRequested 
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 cursor-not-allowed" 
                  : "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-200 hover:bg-amber-500/20"
              )}
            >
              <Truck className="size-4 text-amber-500" />
              {tankerRequested ? 'Tanker Sent ✓' : 'Request Clean Water'}
            </Button>
          </div>
        </div>

        {/* Interactive India Surveillance Map */}
        <InteractiveDiseaseMapSection />

        {/* Emergency Contacts Card */}
        <div className="max-w-3xl mx-auto">
          <Card className="glass-card shadow-xl border-destructive/20 bg-destructive/5">
            <CardHeader className="pb-3 text-center border-b border-border/40">
              <CardTitle className="text-base font-black flex items-center justify-center gap-2 text-destructive">
                <PhoneCall className="size-5 animate-pulse" /> 24/7 Interactive Emergency Helplines
              </CardTitle>
              <CardDescription className="text-xs">Click any helpline to dial 24/7 Medical, Ambulance, or Water Supply assistance.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="rounded-2xl bg-card/60 p-4 flex flex-col justify-between border border-border shadow-xs hover:border-destructive/50 transition-all">
                <div>
                  <p className="font-bold text-sm text-foreground flex items-center gap-1.5">🚨 Ambulance</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 font-bold uppercase">Toll-free 24/7 Dispatch</p>
                </div>
                <a href="tel:108" className="mt-3 block">
                  <Button size="sm" variant="destructive" className="w-full font-black gap-1.5 shadow-md shadow-destructive/20 hover:scale-105 transition-all">
                    <PhoneCall className="size-3.5" /> Call 108
                  </Button>
                </a>
              </div>

              <div className="rounded-2xl bg-card/60 p-4 flex flex-col justify-between border border-border shadow-xs hover:border-primary/50 transition-all">
                <div>
                  <p className="font-bold text-sm text-foreground flex items-center gap-1.5">🏥 Doctor Helpline</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 font-bold uppercase">Free Consultation</p>
                </div>
                <a href="tel:104" className="mt-3 block">
                  <Button size="sm" className="w-full font-black gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/10 hover:scale-105 transition-all">
                    <PhoneCall className="size-3.5" /> Call 104
                  </Button>
                </a>
              </div>

              <div className="rounded-2xl bg-card/60 p-4 flex flex-col justify-between border border-border shadow-xs hover:border-amber-500/50 transition-all">
                <div>
                  <p className="font-bold text-sm text-foreground flex items-center gap-1.5">💧 Water Supply</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 font-bold uppercase">PHED Tanker Request</p>
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
          <DialogContent className="sm:max-w-xl glass-card border-border/80">
            <DialogHeader>
              <DialogTitle className="text-base font-black flex items-center gap-2">
                <ClipboardList className="size-5 text-primary animate-pulse" /> Report Sickness or Contamination
              </DialogTitle>
              <DialogDescription className="text-xs">
                Informing your local ASHA worker alerts the medical team immediately. Verified via Aadhaar.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitReport} className="space-y-5 pt-3">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="dialogPatientName" className="font-bold text-xs text-muted-foreground uppercase">Your Name</Label>
                  <Input
                    id="dialogPatientName"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Rahul Das"
                    className="h-10 text-xs rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="dialogVillageName" className="font-bold text-xs text-muted-foreground uppercase">Village / Block</Label>
                  <Input
                    id="dialogVillageName"
                    value={villageName}
                    onChange={(e) => setVillageName(e.target.value)}
                    placeholder="Kamalabari, Sector 2"
                    className="h-10 text-xs rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-bold text-xs text-muted-foreground uppercase">
                  Select Symptoms / Observations
                </Label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {commonSymptoms.map((symptom) => (
                    <div
                      key={symptom}
                      onClick={() => handleSymptomToggle(symptom)}
                      className={cn(
                        "flex items-center gap-2 rounded-xl border p-2.5 cursor-pointer transition-all duration-200",
                        selectedSymptoms.includes(symptom)
                          ? 'border-primary bg-primary/10 text-primary font-black shadow-xs'
                          : 'border-border/80 bg-card hover:bg-muted/50 text-foreground'
                      )}
                    >
                      <Checkbox
                        checked={selectedSymptoms.includes(symptom)}
                        onCheckedChange={() => handleSymptomToggle(symptom)}
                      />
                      <span className="text-xs font-bold">{symptom}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="dialogNotes" className="font-bold text-xs text-muted-foreground uppercase">Additional details</Label>
                <Textarea
                  id="dialogNotes"
                  placeholder="Cloudy tap water, stomach cramps, diarrhea symptoms..."
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="text-xs rounded-xl"
                />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full gap-2 font-black shadow-md shadow-primary/20 bg-gradient-to-r from-primary to-accent hover:from-primary/95 hover:to-accent/95 text-primary-foreground h-11 rounded-xl cursor-pointer">
                {isSubmitting ? (
                  <>Sending Report...</>
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

        <Card className="glass-card shadow-lg border-primary/20">
          <CardHeader className="pb-3 border-b border-border/40">
            <CardTitle className="text-base font-extrabold flex items-center gap-2">
              <ClipboardList className="size-5 text-primary" /> Community Report Form
            </CardTitle>
            <CardDescription className="text-xs">
              Select symptoms or water contamination issues in your household. Verified via Aadhaar card secure link.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-5">
            <form onSubmit={handleSubmitReport} className="space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="patientName" className="font-bold text-xs text-muted-foreground uppercase">Resident Name</Label>
                  <Input
                    id="patientName"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="h-10 text-xs rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="villageName" className="font-bold text-xs text-muted-foreground uppercase">Village / Lane</Label>
                  <Input
                    id="villageName"
                    value={villageName}
                    onChange={(e) => setVillageName(e.target.value)}
                    className="h-10 text-xs rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-bold text-xs text-muted-foreground uppercase">Select Symptoms</Label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {commonSymptoms.map((symptom) => (
                    <div
                      key={symptom}
                      onClick={() => handleSymptomToggle(symptom)}
                      className={cn(
                        "flex items-center gap-2 rounded-xl border p-2.5 cursor-pointer transition-all duration-200",
                        selectedSymptoms.includes(symptom)
                          ? 'border-primary bg-primary/10 text-primary font-black shadow-xs'
                          : 'border-border/80 bg-card hover:bg-muted/50 text-foreground'
                      )}
                    >
                      <Checkbox
                        checked={selectedSymptoms.includes(symptom)}
                        onCheckedChange={() => handleSymptomToggle(symptom)}
                      />
                      <span className="text-xs font-bold">{symptom}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="notes" className="font-bold text-xs text-muted-foreground uppercase">Describe Problem</Label>
                <Textarea
                  id="notes"
                  placeholder="Cloudy tap water, stomach cramps, diarrhea symptoms..."
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="text-xs rounded-xl"
                />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full gap-2 font-black shadow-md shadow-primary/20 bg-gradient-to-r from-primary to-accent hover:from-primary/95 hover:to-accent/95 text-primary-foreground h-11 rounded-xl cursor-pointer">
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
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
          <div className="lg:col-span-8 glass-card rounded-3xl p-1.5 overflow-hidden shadow-xl border-border/80">
            <HotspotMap height={450} zoom={11} center={[26.95, 94.17]} />
          </div>
          <Card className="lg:col-span-4 glass-card shadow-xl border-border/80">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-base font-extrabold">Open Clinics & Hospitals</CardTitle>
              <CardDescription className="text-xs">Available emergency beds in Jorhat district</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {HOSPITALS.map((h) => (
                <div key={h.id} className="rounded-2xl border border-border bg-muted/10 p-4 space-y-2.5">
                  <div className="flex justify-between items-start gap-1">
                    <p className="font-bold text-sm text-foreground">{h.name}</p>
                    <Badge variant="outline" className="text-[10px] font-bold uppercase rounded-full">
                      {h.type}
                    </Badge>
                  </div>
                  
                  {/* Progress target display */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-muted-foreground font-bold">
                      <span>Available Beds</span>
                      <span className="text-foreground">{h.bedsAvailable} / {h.beds}</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 transition-all"
                        style={{ width: `${Math.round((h.bedsAvailable / h.beds) * 100)}%` }}
                      />
                    </div>
                  </div>
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
            <Card key={r.id} className="glass-card shadow-lg hover:border-primary/30 transition-all">
              <CardContent className="p-5 flex items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-black text-sm text-foreground">{r.patient.split(' (Aadhaar')[0]}</span>
                    <Badge variant="outline" className="text-[10px] border-primary/20 bg-primary/5 text-primary font-bold">
                      {r.village}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-bold">
                      <Clock className="size-3" /> {r.reportedAt}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-semibold">
                    Symptoms / Notes: <span className="text-foreground font-bold">{r.symptoms.join(', ')}</span>
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] font-black uppercase px-3 py-1 rounded-full border",
                    r.status === 'confirmed'
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600'
                      : 'border-amber-500/30 bg-amber-500/10 text-amber-600'
                  )}
                >
                  {r.status === 'confirmed' ? 'Verified by ASHA ✓' : 'Pending Review'}
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
            <Card key={a.id} className="glass-card shadow-lg hover:border-primary/40 transition-all duration-300">
              <CardHeader className="pb-3 border-b border-border/40">
                <div className="flex justify-between items-center">
                  <Badge variant="secondary" className="text-[10px] font-black uppercase rounded-full">{a.tag}</Badge>
                  <BookOpen className="size-4 text-primary animate-pulse" />
                </div>
                <CardTitle className="text-base mt-2 font-extrabold">{a.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-xs text-muted-foreground leading-relaxed font-semibold">{a.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return null
}
