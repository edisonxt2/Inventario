import { EstadoEquipo, EstadoMonitor } from '../types'
import { estadoEquipoColors, estadoEquipoLabels, estadoMonitorColors, estadoMonitorLabels } from '../utils/constants'

interface BadgeEstadoProps {
    estado: EstadoEquipo | EstadoMonitor
}

export function BadgeEstado({ estado }: BadgeEstadoProps) {
    const label = estadoEquipoLabels[estado as EstadoEquipo] ?? estadoMonitorLabels[estado as EstadoMonitor]
    const colorClass = estadoEquipoColors[estado as EstadoEquipo] ?? estadoMonitorColors[estado as EstadoMonitor]

    return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${colorClass}`}>{label}</span>
}
