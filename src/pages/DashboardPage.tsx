import { useQuery } from '@tanstack/react-query'
import { api } from '../api/axios'
import { DashboardResponse, ApiError } from '../types'
import { AreaChart, Area, ResponsiveContainer, PieChart, Pie, Cell, Tooltip, CartesianGrid, XAxis, YAxis } from 'recharts'
import { useMemo } from 'react'

const statusColors = ['#0ea5e9', '#14b8a6', '#f59e0b', '#ef4444', '#64748b']

async function fetchDashboard() {
    const response = await api.get<DashboardResponse>('/api/dashboard')
    return response.data
}

export function DashboardPage() {
    const { data, isLoading, error } = useQuery<DashboardResponse, ApiError, DashboardResponse, ['dashboard']>({
        queryKey: ['dashboard'],
        queryFn: fetchDashboard,
    })

    const dataProveedor = useMemo(
        () =>
            data?.costoPorProveedor.map((item) => ({ name: item.proveedorNombre, value: item.costoMensual })) ?? [],
        [data],
    )

    const dataCentro = useMemo(
        () =>
            data?.costoPorCentroCosto.map((item) => ({ name: item.centroCostoCodigo, value: item.costoMensual })) ?? [],
        [data],
    )

    return (
        <div className="p-6">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-semibold text-slate-900">Dashboard</h1>
                    <p className="text-slate-600">Resumen de indicadores del inventario</p>
                </div>
            </div>

            {isLoading ? (
                <div>Cargando indicadores...</div>
            ) : error ? (
                <div className="rounded-2xl bg-rose-100 p-4 text-rose-700">{error.message}</div>
            ) : data ? (
                <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">
                        {[
                            { label: 'Total equipos', value: data.totalEquipos },
                            { label: 'Total monitores', value: data.totalMonitores },
                            { label: 'Equipos asignados', value: data.equiposAsignados },
                            { label: 'Equipos en bodega', value: data.equiposEnBodega },
                            { label: 'Monitores asignados', value: data.monitoresAsignados },
                            { label: 'Monitores en bodega', value: data.monitoresEnBodega },
                            { label: 'Equipos devueltos', value: data.equiposDevueltos },
                            { label: 'Monitores devueltos', value: data.monitoresDevueltos },
                        ].map((metric) => (
                            <div key={metric.label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                                <div className="text-sm text-slate-500">{metric.label}</div>
                                <div className="mt-3 text-3xl font-semibold text-slate-900">{metric.value}</div>
                            </div>
                        ))}
                    </div>

                    <div className="grid gap-4 xl:grid-cols-2">
                        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                            <h2 className="mb-4 text-xl font-semibold text-slate-900">Costo mensual por proveedor</h2>
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={dataProveedor} dataKey="value" nameKey="name" outerRadius={100} fill="#0ea5e9" label />
                                        {dataProveedor.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={statusColors[index % statusColors.length]} />
                                        ))}
                                        <Tooltip formatter={(value: number) => value.toFixed(2)} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                            <h2 className="mb-4 text-xl font-semibold text-slate-900">Costo mensual por centro de costo</h2>
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={dataCentro} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip formatter={(value: number) => value.toFixed(2)} />
                                        <Area type="monotone" dataKey="value" stroke="#0ea5e9" fill="url(#colorValue)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    )
}
