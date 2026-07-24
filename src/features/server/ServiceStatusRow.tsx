import { Badge } from '@/components/ui/Badge'
import type { ServiceStatus } from '@/types'

const toneByStatus: Record<ServiceStatus['status'], 'success' | 'warning' | 'danger'> = {
  operational: 'success',
  degraded: 'warning',
  offline: 'danger',
}

const labelByStatus: Record<ServiceStatus['status'], string> = {
  operational: 'Operational',
  degraded: 'Degraded',
  offline: 'Offline',
}

export function ServiceStatusRow({ service }: { service: ServiceStatus }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm text-ink-200">{service.name}</span>
      <div className="flex items-center gap-3">
        <span className="text-xs text-ink-500">{service.latencyMs}ms</span>
        <Badge tone={toneByStatus[service.status]}>{labelByStatus[service.status]}</Badge>
      </div>
    </div>
  )
}
