export function generateEpidemiologyReport(selectedStateData?: any) {
  const timestamp = new Date().toLocaleString('en-IN', {
    dateStyle: 'full',
    timeStyle: 'medium',
  })

  const reportHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>HealthPulse AI - National Epidemiological Surveillance Report</title>
  <style>
    body {
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      color: #0f172a;
      line-height: 1.6;
      margin: 0;
      padding: 32px;
      background: #f8fafc;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: #ffffff;
      padding: 40px;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      border: 1px solid #e2e8f0;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-b: 2px solid #0284c7;
      padding-bottom: 20px;
      margin-bottom: 24px;
    }
    .logo {
      font-size: 24px;
      font-weight: 800;
      color: #0284c7;
      letter-spacing: -0.5px;
    }
    .tag {
      background: #e0f2fe;
      color: #0369a1;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 700;
    }
    h1 {
      font-size: 22px;
      margin: 0 0 8px 0;
      color: #0f172a;
    }
    .timestamp {
      font-size: 12px;
      color: #64748b;
      margin-bottom: 24px;
    }
    .section-title {
      font-size: 16px;
      font-weight: 700;
      color: #0369a1;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 6px;
      margin-top: 24px;
      margin-bottom: 12px;
    }
    .badge-high {
      background: #ffe4e6;
      color: #e11d48;
      font-weight: 800;
      padding: 2px 8px;
      border-radius: 6px;
      font-size: 12px;
    }
    .badge-med {
      background: #fef3c7;
      color: #d97706;
      font-weight: 800;
      padding: 2px 8px;
      border-radius: 6px;
      font-size: 12px;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 20px;
    }
    .stat-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 16px;
    }
    .stat-val {
      font-size: 24px;
      font-weight: 800;
      color: #0284c7;
    }
    .stat-lbl {
      font-size: 12px;
      color: #64748b;
      font-weight: 600;
    }
    ul {
      margin: 8px 0;
      padding-left: 20px;
    }
    li {
      margin-bottom: 6px;
      font-size: 14px;
    }
    .footer {
      margin-top: 40px;
      padding-top: 16px;
      border-top: 1px solid #e2e8f0;
      font-size: 11px;
      color: #94a3b8;
      display: flex;
      justify-content: space-between;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🫀 HealthPulse AI</div>
      <div class="tag">OFFICIAL SURVEILLANCE REPORT</div>
    </div>

    <h1>National Epidemiological Outbreak Summary</h1>
    <div class="timestamp">Generated on: ${timestamp} &bull; Sensor Grid: Live Integrated IDSP/AI</div>

    <div class="grid">
      <div class="stat-card">
        <div class="stat-lbl">Active High Risk Clusters</div>
        <div class="stat-val" style="color: #e11d48;">15 Outbreaks</div>
      </div>
      <div class="stat-card">
        <div class="stat-lbl">Monitored Vector Hotspots</div>
        <div class="stat-val">28 States / UTs</div>
      </div>
    </div>

    ${
      selectedStateData
        ? `
      <div class="section-title">Active Focus State: ${selectedStateData.name} (${selectedStateData.code})</div>
      <p><strong>Risk Classification:</strong> <span class="${selectedStateData.risk === 'High Risk' ? 'badge-high' : 'badge-med'}">${selectedStateData.risk}</span> &nbsp;&bull;&nbsp; <strong>Risk Score:</strong> ${selectedStateData.riskScore}/100</p>
      <p><strong>Primary Diseases Tracked:</strong> ${selectedStateData.primaryDiseases.join(', ')}</p>
      <p><strong>Active Outbreak Clusters:</strong> ${selectedStateData.activeOutbreaks}</p>
      <p><strong>AI Diagnostic Assessment:</strong> ${selectedStateData.aiSummary}</p>
      `
        : ''
    }

    <div class="section-title">Critical High Risk Zones</div>
    <ul>
      <li><strong>Delhi NCR (DL)</strong>: <span class="badge-high">HIGH RISK (89/100)</span> - Dengue DEN-2 & Chikungunya viral cluster. Vector density elevated in urban residential blocks.</li>
      <li><strong>West Bengal (WB)</strong>: <span class="badge-high">HIGH RISK (92/100)</span> - Waterborne Cholera & DEN-3 strain surge in Kolkata metro and Gangetic delta districts.</li>
      <li><strong>Gujarat (GJ)</strong>: <span class="badge-med">MEDIUM RISK (68/100)</span> - Sandfly-borne Chandipura Virus active surveillance in northern rural sectors.</li>
      <li><strong>Karnataka (KA)</strong>: <span class="badge-med">MEDIUM RISK (65/100)</span> - Kyasanur Forest Disease tick activity monitored in Western Ghats forest fringe villages.</li>
    </ul>

    <div class="section-title">Standard Preventive Directives</div>
    <ul>
      <li>Chlorinate all municipal and overhead drinking water sources twice weekly.</li>
      <li>Conduct anti-larval spraying (Temephos/BTI) in all stagnant water accumulation sites within 500m of residential clusters.</li>
      <li>Distribute ORS + Zinc packets immediately to primary health centers in flood-prone districts.</li>
      <li>Report any cluster of 3+ cases with fever & chills to the central ASHA/IDSP surveillance portal.</li>
    </ul>

    <div class="footer">
      <span>HealthPulse AI Early Warning Surveillance Platform</span>
      <span>Confidential - For Public Health Action Only</span>
    </div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 400);
    }
  </script>
</body>
</html>
  `

  const blob = new Blob([reportHtml], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const win = window.open(url, '_blank')
  if (!win) {
    // Fallback download if popup blocker is active
    const a = document.createElement('a')
    a.href = url
    a.download = `HealthPulse_Epidemiology_Report_${new Date().toISOString().slice(0, 10)}.html`
    a.click()
  }
}
