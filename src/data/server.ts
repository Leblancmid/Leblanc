import type { ServerStatusData } from '@/types'

export const serverStatus: ServerStatusData = {
  online: true,
  players: 342,
  maxPlayers: 500,
  uptimePercent: 99.97,
  ping: 24,
  ip: 'connect.leblanc.house:7777',
  version: '2.14.6',
  region: 'EU-West · Frankfurt',
  services: [
    { name: 'Marketplace API', status: 'operational', latencyMs: 118 },
    { name: 'Auth Gateway', status: 'operational', latencyMs: 64 },
    { name: 'Ledger & Payments', status: 'operational', latencyMs: 142 },
    { name: 'Concierge Bot', status: 'degraded', latencyMs: 410 },
    { name: 'Archive Storage', status: 'operational', latencyMs: 97 },
  ],
}
