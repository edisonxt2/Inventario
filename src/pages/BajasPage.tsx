import { useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { fetchEquipos } from '../api/equipos'
import { fetchMonitores } from '../api/monitores'
import { fetchBajasEquipos, fetchBajasMonitores, fetchDocumentos, subirBajaEquipo, subirBajaMonitor, descargarDocumento } from '../api/bajas'
import { EquipoResponse, MonitorResponse, TipoEntidad, BajaRequest } from '../types'

const bajaSchema = z.object({
    tipoEntidad: z.enum(['EQUIPO', 'MONITOR']),
    activoId: z.number().min(1, 'Activo requerido'),
    observacion: z.string().optional(),
})

type BajaForm = z.infer<typeof bajaSchema>

export function BajasPage() {
    const queryClient = useQueryClient()
    const [archivo, setArchivo] = useState<File | null>(null)
    const [statusMessage, setStatusMessage] = useState<string | null>(null)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const equiposQuery = useQuery<EquipoResponse[], Error>({ queryKey: ['equipos'], queryFn: fetchEquipos })
    const monitoresQuery = useQuery<MonitorResponse[], Error>({ queryKey: ['monitores'], queryFn: fetchMonitores })

    const form = useForm<BajaForm>({
        resolver: zodResolver(bajaSchema),
        defaultValues: { tipoEntidad: 'EQUIPO', observacion: '' },
    })

    const equipos = equiposQuery.data ?? []
    const monitores = monitoresQuery.data ?? []
    const bajasEquiposQuery = useQuery<EquipoResponse[], Error>({ queryKey: ['bajas-equipos'], queryFn: fetchBajasEquipos })
    const bajasMonitoresQuery = useQuery<MonitorResponse[], Error>({ queryKey: ['bajas-monitores'], queryFn: fetchBajasMonitores })
    const tipoEntidad = form.watch('tipoEntidad')
    const activoId = form.watch('activoId')

    const activos = useMemo(() => {
        return tipoEntidad === 'EQUIPO' ? equipos : monitores
    }, [tipoEntidad, equipos, monitores])

    const documentosQuery = useQuery({
        queryKey: ['documentos', tipoEntidad, activoId],
        queryFn: async () => fetchDocumentos(tipoEntidad as TipoEntidad, activoId),
        enabled: Boolean(activoId),
    })

    const handleSuccess = (message: string) => {
        setStatusMessage(message)
        setErrorMessage(null)
        setArchivo(null)
        form.reset({ tipoEntidad, observacion: '' })
        queryClient.invalidateQueries({ queryKey: ['documentos', tipoEntidad, activoId] })
    }

    const handleError = (error: unknown) => {
        const message = error instanceof Error ? error.message : 'Ocurrió un error en el servidor'
        setErrorMessage(message)
        setStatusMessage(null)
    }

    const onSubmit = async (values: BajaForm) => {
        try {
            const payload: BajaRequest = { observacion: values.observacion }
            if (values.tipoEntidad === 'EQUIPO') {
                await subirBajaEquipo(values.activoId, payload, archivo ?? undefined)
                handleSuccess('Baja de equipo registrada correctamente.')
            } else {
                await subirBajaMonitor(values.activoId, payload, archivo ?? undefined)
                handleSuccess('Baja de monitor registrada correctamente.')
            }
            queryClient.invalidateQueries({ queryKey: ['equipos'] })
            queryClient.invalidateQueries({ queryKey: ['monitores'] })
        } catch (error) {
            handleError(error)
        }
    }

    const downloadFile = async (documentoId: number, nombreArchivo: string) => {
        try {
            const blob = await descargarDocumento(documentoId)
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = nombreArchivo
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
        } catch (error) {
            handleError(error)
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-semibold text-slate-900">Bajas</h1>
                <p className="text-slate-600">Registra devoluciones y certificados de baja para equipos y monitores.</p>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-xl font-semibold text-slate-900">Registrar baja</h2>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <label className="block text-sm text-slate-700">
                            Tipo de activo
                            <select
                                {...form.register('tipoEntidad')}
                                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
                            >
                                <option value="EQUIPO">Equipo</option>
                                <option value="MONITOR">Monitor</option>
                            </select>
                        </label>

                        <label className="block text-sm text-slate-700">
                            Activo
                            <select
                                {...form.register('activoId', { valueAsNumber: true })}
                                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
                            >
                                <option value="">Seleccione activo</option>
                                {activos.map((activo) => (
                                    <option key={activo.id} value={activo.id}>
                                        {activo.placa} • {activo.serial}
                                    </option>
                                ))}
                            </select>
                        </label>
                        {form.formState.errors.activoId && <p className="text-sm text-rose-600">{form.formState.errors.activoId.message}</p>}

                        <label className="block text-sm text-slate-700">
                            Observación
                            <textarea
                                {...form.register('observacion')}
                                className="mt-2 h-28 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
                            />
                        </label>

                        <label className="block text-sm text-slate-700">
                            Certificado / Documento (opcional)
                            <input
                                type="file"
                                accept=".pdf,image/*"
                                onChange={(event) => setArchivo(event.target.files?.[0] ?? null)}
                                className="mt-2 w-full text-sm text-slate-900"
                            />
                        </label>

                        <button type="submit" className="rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-500">
                            Registrar baja
                        </button>

                        {statusMessage && <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{statusMessage}</div>}
                        {errorMessage && <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-800">{errorMessage}</div>}
                    </form>
                </section>

                <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                    <h2 className="mb-4 text-xl font-semibold text-slate-900">Documentos de baja</h2>
                    <p className="text-sm text-slate-600">Selecciona un activo para ver sus documentos de baja.</p>

                    <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                            <thead className="bg-slate-50 text-slate-600">
                                <tr>
                                    <th className="px-4 py-4 font-semibold">Archivo</th>
                                    <th className="px-4 py-4 font-semibold">Tipo</th>
                                    <th className="px-4 py-4 font-semibold">Fecha</th>
                                    <th className="px-4 py-4 font-semibold">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                                {documentosQuery.isLoading ? (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-4 text-slate-700">
                                            Cargando documentos...
                                        </td>
                                    </tr>
                                ) : documentosQuery.data?.length ? (
                                    documentosQuery.data.map((documento) => (
                                        <tr key={documento.id}>
                                            <td className="px-4 py-4 text-slate-900">{documento.nombreArchivo}</td>
                                            <td className="px-4 py-4 text-slate-700">{documento.tipoArchivo}</td>
                                            <td className="px-4 py-4 text-slate-700">{new Date(documento.fechaSubida).toLocaleString()}</td>
                                            <td className="px-4 py-4">
                                                <button
                                                    type="button"
                                                    onClick={() => downloadFile(documento.id, documento.nombreArchivo)}
                                                    className="rounded-2xl bg-sky-600 px-3 py-2 text-xs font-semibold text-white hover:bg-sky-500"
                                                >
                                                    Descargar
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-4 text-slate-600">
                                            No hay documentos asociados a este activo.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
    )
}
