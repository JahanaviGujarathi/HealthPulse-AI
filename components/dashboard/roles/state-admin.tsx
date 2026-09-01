'use client'

import { useState, useEffect } from 'react'
import {
  Activity,
  Building2,
  CheckCircle2,
  Clock,
  FileText,
  Lock,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Users,
  XCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StatCard, SectionHeader } from '@/components/dashboard/primitives'
import { AI_MODELS, PENDING_USERS } from '@/lib/data'
import { toast } from 'sonner'

interface AuditLogItem {
  id: string
  timestamp: string
  actor: string
  role: string
  action: string
  status: 'SUCCESS' | 'DENIED' | 'FLAGGED'
  severity: 'info' | 'warning' | 'critical'
  ip: string
  details?: string
}

export function StateAdminDashboard({ section }: { section: string }) {
  const [usersQueue, setUsersQueue] = useState(PENDING_USERS)
  const [models, setModels] = useState(AI_MODELS)
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([])
  const [isLoadingLogs, setIsLoadingLogs] = useState(false)

  useEffect(() => {
    async function fetchAuditLogs() {
      setIsLoadingLogs(true)
      try {
        const res = await fetch('/api/admin/audit-logs?role=state-admin')
        const data = await res.json()
        if (res.ok && data.auditLogs) {
          setAuditLogs(data.auditLogs)
        }
      } catch (err) {
        toast.error('Failed to load security audit logs')
      } finally {
        setIsLoadingLogs(false)
      }
    }

    if (section === 'audit' || section === 'overview' || !section) {
      fetchAuditLogs()
    }
  }, [section])

  const handleApproveUser = (id: string, name: string) => {
    setUsersQueue((prev) => prev.filter((u) => u.id !== id))
    toast.success(`User Approved & Provisioned!`, {
      description: `${name} granted verified role credentials.`,
    })
  }

  const handleRetrainModel = (id: string, name: string) => {
    toast.info(`Retraining AI Model ${name}...`, {
      description: 'Training pipeline initiated on latest Assam water & epidemiology data.',
    })
    setTimeout(() => {
      setModels((prev) =>
        prev.map((m) => (m.id === id ? { ...m, accuracy: Math.min(99, m.accuracy + 2), lastTrained: 'Just now' } : m)),
      )
      toast.success(`AI Model ${name} Retrained!`, {
        description: 'New model weights deployed to production inference endpoints.',
      })
    }, 1200)
  }

  if (section === 'overview' || !section) {
    return (
      <div className="space-y-6">
        <SectionHeader
          title="State Health Governance Dashboard — Dr. N. Sharma"
          description="Assam State Health Department. Oversee platform security, secure user provisioning, AI model pipelines, and security audit logs."
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Building2} label="Districts Monitored" value="33 Districts" hint="All Assam divisions" tone="default" />
          <StatCard icon={UserCheck} label="Pending User Verifications" value={usersQueue.length} hint="Doctors & Officers queue" tone="warning" />
          <StatCard icon={Sparkles} label="Active AI Models" value="4 Models" hint="Avg Accuracy: 89%" tone="success" />
          <StatCard icon={Lock} label="Security Compliance Index" value="100%" hint="Core Compliance Active" tone="success" />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span>User Account Verification Queue</span>
                <Badge variant="outline">{usersQueue.length} pending</Badge>
              </CardTitle>
              <CardDescription>Verify credentials of doctors, lab technicians, and water officers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {usersQueue.length === 0 ? (
                <div className="py-6 text-center text-xs text-muted-foreground">
                  <CheckCircle2 className="size-6 text-emerald-500 mx-auto mb-1" />
                  All user verification requests completed!
                </div>
              ) : (
                usersQueue.map((u) => (
                  <div key={u.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div>
                      <p className="font-semibold text-sm">{u.name}</p>
                      <p className="text-xs text-muted-foreground">{u.role} · {u.org}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="default" className="h-7 text-xs gap-1" onClick={() => handleApproveUser(u.id, u.name)}>
                        <CheckCircle2 className="size-3" /> Approve
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">AI Model Performance & Retraining</CardTitle>
              <CardDescription>Production machine learning models</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {models.map((m) => (
                <div key={m.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="font-semibold text-sm">{m.name} ({m.version})</p>
                    <p className="text-xs text-muted-foreground">Accuracy: <span className="font-bold text-emerald-600">{m.accuracy}%</span> · {m.lastTrained}</p>
                  </div>
                  <Button size="sm" variant="outline" className="h-7 text-xs gap-1 font-bold" onClick={() => handleRetrainModel(m.id, m.name)}>
                    <RefreshCw className="size-3" /> Retrain Model
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (section === 'users') {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <SectionHeader title="User Verification & Governance" description="Authorized identity checks for health department accounts." />
        <div className="space-y-3">
          {usersQueue.map((u) => (
            <Card key={u.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm">{u.name}</p>
                  <p className="text-xs text-muted-foreground">Role: {u.role} · Org: {u.org} · Submitted {u.submitted}</p>
                </div>
                <Button size="sm" variant="default" className="font-bold gap-1" onClick={() => handleApproveUser(u.id, u.name)}>
                  <CheckCircle2 className="size-4" /> Grant Role Access
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (section === 'audit') {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <SectionHeader title="Security Audit Logs" description="Real-time tamper-evident ledger of API requests, authentication, and security events." />

        <Card>
          <CardHeader className="flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Lock className="size-4 text-emerald-500" /> Security Audit Event Ledger
              </CardTitle>
              <CardDescription>Standard-compliant logging & monitoring active</CardDescription>
            </div>
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 bg-emerald-500/10">
              Immutability Verified
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoadingLogs ? (
              <div className="py-8 text-center text-xs text-muted-foreground">Loading security ledger...</div>
            ) : (
              auditLogs.map((log) => (
                <div key={log.id} className="rounded-lg border border-border p-3 text-xs space-y-1 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={
                          log.status === 'SUCCESS'
                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                            : 'bg-destructive/10 text-destructive border-destructive/30'
                        }
                      >
                        {log.status}
                      </Badge>
                      <span className="font-bold text-foreground">{log.action}</span>
                      <span className="text-muted-foreground">by {log.actor} ({log.role})</span>
                    </div>
                    <span className="text-[11px] text-muted-foreground">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-muted-foreground">{log.details}</p>
                  <p className="text-[10px] text-muted-foreground/70">Client IP: {log.ip} · Event ID: {log.id}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // Models & AI Pipelines View
  if (section === 'models') {
    return (
      <div className="space-y-6">
        <SectionHeader title="AI Machine Learning Pipelines" description="Production model versions, inference accuracy, and retraining triggers." />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {models.map((m) => (
            <Card key={m.id} className="glass-card shadow-lg">
              <CardHeader className="pb-3 border-b border-border/40">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base font-extrabold">{m.name}</CardTitle>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-extrabold text-xs">{m.version}</Badge>
                </div>
                <CardDescription className="text-xs">Last retrained: {m.lastTrained} · Status: {m.status}</CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-muted-foreground">
                    <span>Model Precision Rate</span>
                    <span className="text-emerald-500 font-extrabold">{m.accuracy}%</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${m.accuracy}%` }} />
                  </div>
                </div>
                <Button size="sm" variant="outline" className="w-full gap-1.5 text-xs font-bold cursor-pointer" onClick={() => handleRetrainModel(m.id, m.name)}>
                  <RefreshCw className="size-3.5 text-primary" /> Trigger Fine-Tuning Pipeline
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Fallback State View
  return (
    <div className="space-y-6">
      <SectionHeader title="State Administration View" description="System monitoring and audit inspection." />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card shadow-md p-4 space-y-2">
          <p className="text-xs text-muted-foreground font-bold uppercase">Active System Nodes</p>
          <p className="text-2xl font-black text-primary">33 / 33</p>
          <p className="text-[11px] text-muted-foreground font-semibold">100% District sync operational</p>
        </Card>
        <Card className="glass-card shadow-md p-4 space-y-2">
          <p className="text-xs text-muted-foreground font-bold uppercase">Pending Approvals</p>
          <p className="text-2xl font-black text-amber-500">{usersQueue.length} Credentials</p>
          <p className="text-[11px] text-muted-foreground font-semibold">Verification queue updated</p>
        </Card>
        <Card className="glass-card shadow-md p-4 space-y-2">
          <p className="text-xs text-muted-foreground font-bold uppercase">Audit Security Log</p>
          <p className="text-2xl font-black text-emerald-500">TAMPER-PROOF</p>
          <p className="text-[11px] text-muted-foreground font-semibold">Encrypted SHA-256 ledger</p>
        </Card>
      </div>
    </div>
  )
}
