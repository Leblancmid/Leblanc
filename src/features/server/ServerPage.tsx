import { useState } from 'react'
import { Circle, Copy, Check, Gauge, Users, Server as ServerIcon, MapPin } from 'lucide-react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ConfirmDialog } from '@/components/confirmation/ConfirmDialog'
import { useDisclosure } from '@/hooks/useDisclosure'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { serverStatus } from '@/data/server'
import { ServiceStatusRow } from './ServiceStatusRow'

export function ServerPage() {
  const connect = useDisclosure()
  const { copied, copy } = useCopyToClipboard()
  const [connected, setConnected] = useState(false)

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <SectionHeading
        eyebrow="Network"
        title="Server"
        description="Live status for the Leblanc network — connection details, player load, and service health."
      />

      <Card className="mt-10 overflow-hidden">
        <div className="flex flex-col gap-6 border-b border-ink-700 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Circle
                className={
                  serverStatus.online
                    ? 'size-2.5 fill-emerald-400 text-emerald-400'
                    : 'size-2.5 fill-red-400 text-red-400'
                }
              />
              <span className="text-sm font-medium text-ink-100">
                {serverStatus.online ? 'Online' : 'Offline'}
              </span>
              <Badge tone="neutral">v{serverStatus.version}</Badge>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <code className="scroll-thin overflow-x-auto rounded-md border border-ink-600 bg-ink-950 px-3 py-1.5 font-mono text-sm text-gold-300">
                {serverStatus.ip}
              </code>
              <button
                type="button"
                onClick={() => copy(serverStatus.ip)}
                aria-label="Copy server address"
                className="flex size-8 shrink-0 items-center justify-center rounded-md border border-ink-600 text-ink-300 transition-colors hover:border-gold-500/50 hover:text-gold-300"
              >
                {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
              </button>
            </div>
          </div>

          <Button size="lg" onClick={connect.open} disabled={connected}>
            {connected ? 'Connected' : 'Connect'}
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-px bg-ink-700 sm:grid-cols-4">
          {[
            {
              icon: Users,
              label: 'Players',
              value: `${serverStatus.players}/${serverStatus.maxPlayers}`,
            },
            { icon: Gauge, label: 'Ping', value: `${serverStatus.ping}ms` },
            { icon: ServerIcon, label: 'Uptime', value: `${serverStatus.uptimePercent}%` },
            { icon: MapPin, label: 'Region', value: serverStatus.region },
          ].map((stat) => (
            <div key={stat.label} className="bg-ink-900 p-5">
              <stat.icon className="size-4 text-gold-400" />
              <p className="mt-3 text-lg font-medium text-ink-100">{stat.value}</p>
              <p className="text-xs uppercase tracking-wider text-ink-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </Card>

      <section className="mt-10">
        <h3 className="text-lg font-medium text-ink-100">Service health</h3>
        <Card className="mt-4 divide-y divide-ink-700 px-5">
          {serverStatus.services.map((service) => (
            <ServiceStatusRow key={service.name} service={service} />
          ))}
        </Card>
      </section>

      <ConfirmDialog
        isOpen={connect.isOpen}
        onClose={connect.close}
        onConfirm={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1100))
          setConnected(true)
        }}
        title="Establish connection to Leblanc?"
        description="This will route your session through the Leblanc network using the address above. You can disconnect at any time."
        confirmLabel="Connect"
        successMessage="Connected. Welcome back to Leblanc."
      />
    </div>
  )
}
