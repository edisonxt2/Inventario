import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
    fetchContratos,
    fetchProveedores,
    fetchCentrosCosto,
} from '../api/catalog'
import {
    fetchReporteInventarioEquipos,
    fetchReporteInventarioMonitores,
    fetchReporteEquiposPorProveedor,
    fetchReporteMonitoresPorProveedor,
    fetchReporteEquiposPorContrato,
    fetchReporteEquiposPorCentroCosto,
    fetchReporteEquiposAsignados,
    fetchReporteMonitoresAsignados,
    fetchReporteEquiposDisponibles,
    fetchReporteMonitoresDisponibles,
    fetchReporteActivosDevueltosEquipos,
    fetchReporteActivosDevueltosMonitores,
    fetchReporteCostosPorProveedor,
    fetchReporteCostosPorContrato,
    fetchReporteCostosPorCentroCosto,
} from '../api/reportes'
import { ContratoRentingResponse, ProveedorResponse, CentroCostoResponse } from '../types'

type ReportAction = (...params: unknown[]) => Promise<any[]>

const reportDefinitions = [
    {
        id: 'inventario-equipos',
        label: 'Inventario equipos',
        action: fetchReporteInventarioEquipos as ReportAction,
        params: [],
    },
    {
        id: 'inventario-monitores',
        label: 'Inventario monitores',
        action: fetchReporteInventarioMonitores as ReportAction,
        params: [],
    },
    {
        id: 'equipos-por-proveedor',
        label: 'Equipos por proveedor',
        action: fetchReporteEquiposPorProveedor as ReportAction,
        params: ['proveedorId'],
    },
    {
        id: 'monitores-por-proveedor',
        label: 'Monitores por proveedor',
        action: fetchReporteMonitoresPorProveedor as ReportAction,
        params: ['proveedorId'],
    },
    {
        id: 'equipos-por-contrato',
        label: 'Equipos por contrato',
        action: fetchReporteEquiposPorContrato as ReportAction,
        params: ['contratoId'],
    },
    {
        id: 'equipos-por-centro',
        label: 'Equipos por centro de costo',
        action: fetchReporteEquiposPorCentroCosto as ReportAction,
        params: ['centroCostoId'],
    },
    {
        id: 'equipos-asignados',
        label: 'Equipos asignados',
        action: fetchReporteEquiposAsignados as ReportAction,
        params: [],
    },
    {
        id: 'monitores-asignados',
        label: 'Monitores asignados',
        action: fetchReporteMonitoresAsignados as ReportAction,
        params: [],
    },
    {
        id: 'equipos-disponibles',
        label: 'Equipos disponibles',
        action: fetchReporteEquiposDisponibles as ReportAction,
        params: [],
    },
    {
        id: 'monitores-disponibles',
        label: 'Monitores disponibles',
        action: fetchReporteMonitoresDisponibles as ReportAction,
        params: [],
    },
    {
        id: 'equipos-devueltos',
        label: 'Equipos devueltos',
        action: fetchReporteActivosDevueltosEquipos as ReportAction,
        params: [],
    },
    {
        id: 'monitores-devueltos',
        label: 'Monitores devueltos',
        action: fetchReporteActivosDevueltosMonitores as ReportAction,
        params: [],
    },
    {
        id: 'costos-proveedor',
        label: 'Costos por proveedor',
        action: fetchReporteCostosPorProveedor as ReportAction,
        params: [],
    },
    {
        id: 'costos-contrato',
        label: 'Costos por contrato',
        action: fetchReporteCostosPorContrato as ReportAction,
        params: ['contratoId'],
    },
    {
        id: 'costos-centro',
        label: 'Costos por centro de costo',
        action: fetchReporteCostosPorCentroCosto as ReportAction,
        params: [],
    },
]

type ReportKey = (typeof reportDefinitions)[number]['id']

export function ReportesPage() {
    const [selectedReport, setSelectedReport] = useState<ReportKey>('inventario-equipos')
    const [selectedProveedor, setSelectedProveedor] = useState<number | ''>('')
    const [selectedContrato, setSelectedContrato] = useState<number | ''>('')
    const [selectedCentro, setSelectedCentro] = useState<number | ''>('')

    const proveedoresQuery = useQuery<ProveedorResponse[], Error>({ queryKey: ['proveedores'], queryFn: fetchProveedores })
    const contratosQuery = useQuery<ContratoRentingResponse[], Error>({ queryKey: ['contratos'], queryFn: fetchContratos })
    const centrosQuery = useQuery<CentroCostoResponse[], Error>({ queryKey: ['centros'], queryFn: fetchCentrosCosto })

    const reportDefinition = reportDefinitions.find((item) => item.id === selectedReport)!

    const reportQuery = useQuery<any[]>({
        queryKey: ['reporte', selectedReport, selectedProveedor, selectedContrato, selectedCentro],
        queryFn: async () => {
            if (selectedReport === 'equipos-por-proveedor' || selectedReport === 'monitores-por-proveedor') {
                if (!selectedProveedor) return []
                return reportDefinition.action(selectedProveedor)
            }
            if (selectedReport === 'equipos-por-contrato' || selectedReport === 'costos-contrato') {
                if (!selectedContrato) return []
                return reportDefinition.action(selectedContrato)
            }
            if (selectedReport === 'equipos-por-centro') {
                if (!selectedCentro) return []
                return reportDefinition.action(selectedCentro)
            }
            return reportDefinition.action()
        },
        enabled:
            selectedReport === 'inventario-equipos' ||
            selectedReport === 'inventario-monitores' ||
            selectedReport === 'equipos-asignados' ||
            selectedReport === 'monitores-asignados' ||
            selectedReport === 'equipos-disponibles' ||
            selectedReport === 'monitores-disponibles' ||
            selectedReport === 'equipos-devueltos' ||
            selectedReport === 'monitores-devueltos' ||
            selectedReport === 'costos-proveedor' ||
            (selectedReport === 'equipos-por-proveedor' && Boolean(selectedProveedor)) ||
            (selectedReport === 'monitores-por-proveedor' && Boolean(selectedProveedor)) ||
            (selectedReport === 'equipos-por-contrato' && Boolean(selectedContrato)) ||
            (selectedReport === 'equipos-por-centro' && Boolean(selectedCentro)) ||
            (selectedReport === 'costos-contrato' && Boolean(selectedContrato)),
    })

    const resultRows = Array.isArray(reportQuery.data) ? reportQuery.data : []
    const headers = useMemo(() => {
        if (resultRows.length === 0) return []
        return Object.keys(resultRows[0])
    }, [resultRows])

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-semibold text-slate-900">Reportes</h1>
                <p className="text-slate-600">Consulta y exporta los datos generados por el backend.</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="grid gap-4 lg:grid-cols-[1.5fr_2fr]">
                    <div>
                        <h2 className="mb-3 text-lg font-semibold text-slate-900">Seleccionar reporte</h2>
                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                            {reportDefinitions.map((report) => (
                                <button
                                    key={report.id}
                                    type="button"
                                    onClick={() => setSelectedReport(report.id)}
                                    className={
                                        selectedReport === report.id
                                            ? 'rounded-2xl bg-slate-900 px-4 py-3 text-left text-sm text-white'
                                            : 'rounded-2xl bg-slate-100 px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-200'
                                    }
                                >
                                    {report.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        {(selectedReport === 'equipos-por-proveedor' || selectedReport === 'monitores-por-proveedor') && (
                            <label className="block text-sm text-slate-700">
                                Proveedor
                                <select
                                    value={selectedProveedor}
                                    onChange={(event) => setSelectedProveedor(Number(event.target.value) || '')}
                                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
                                >
                                    <option value="">Seleccione proveedor</option>
                                    {proveedoresQuery.data?.map((proveedor) => (
                                        <option key={proveedor.id} value={proveedor.id}>
                                            {proveedor.nombre}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        )}
                        {selectedReport === 'equipos-por-contrato' && (
                            <label className="block text-sm text-slate-700">
                                Contrato
                                <select
                                    value={selectedContrato}
                                    onChange={(event) => setSelectedContrato(Number(event.target.value) || '')}
                                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
                                >
                                    <option value="">Seleccione contrato</option>
                                    {contratosQuery.data?.map((contrato) => (
                                        <option key={contrato.id} value={contrato.id}>
                                            {contrato.numeroContrato}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        )}
                        {selectedReport === 'costos-contrato' && (
                            <label className="block text-sm text-slate-700">
                                Contrato
                                <select
                                    value={selectedContrato}
                                    onChange={(event) => setSelectedContrato(Number(event.target.value) || '')}
                                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
                                >
                                    <option value="">Seleccione contrato</option>
                                    {contratosQuery.data?.map((contrato) => (
                                        <option key={contrato.id} value={contrato.id}>
                                            {contrato.numeroContrato}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        )}
                        {selectedReport === 'equipos-por-centro' && (
                            <label className="block text-sm text-slate-700">
                                Centro de costo
                                <select
                                    value={selectedCentro}
                                    onChange={(event) => setSelectedCentro(Number(event.target.value) || '')}
                                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
                                >
                                    <option value="">Seleccione centro</option>
                                    {centrosQuery.data?.map((centro) => (
                                        <option key={centro.id} value={centro.id}>
                                            {centro.codigo}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        )}
                    </div>
                </div>

                <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900">Resultados</h3>
                            <p className="text-sm text-slate-600">Reporte seleccionado: {reportDefinition.label}</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => reportQuery.refetch()}
                            className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                        >
                            Refrescar
                        </button>
                    </div>

                    {reportQuery.isLoading ? (
                        <div className="rounded-2xl bg-white p-6 text-sm text-slate-700">Cargando reporte...</div>
                    ) : reportQuery.isError ? (
                        <div className="rounded-2xl bg-rose-50 p-6 text-sm text-rose-700">Error al cargar reporte.</div>
                    ) : resultRows.length === 0 ? (
                        <div className="rounded-2xl bg-white p-6 text-sm text-slate-700">No hay datos para este reporte.</div>
                    ) : (
                        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                                <thead className="bg-slate-50 text-slate-600">
                                    <tr>
                                        {headers.map((header) => (
                                            <th key={header} className="px-4 py-4 font-semibold capitalize">
                                                {header.replace(/([A-Z])/g, ' $1')}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 bg-white">
                                    {resultRows.map((row, index) => (
                                        <tr key={index} className="hover:bg-slate-50">
                                            {headers.map((header) => (
                                                <td key={header} className="px-4 py-4 text-slate-700">
                                                    {String((row as any)[header] ?? '')}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
