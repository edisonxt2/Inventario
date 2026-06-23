import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { fetchEquipos } from '../api/equipos'
import { fetchMonitores } from '../api/monitores'
import { fetchUsuarios } from '../api/catalog'
import { asignarEquipo, asignarMonitor, desasignarEquipo, desasignarMonitor, cambiarUsuarioEquipo, cambiarUsuarioMonitor } from '../api/asignaciones'
import { EquipoResponse, MonitorResponse, UsuarioResponse, AsignacionRequest } from '../types'

const asignacionSchema = z.object({
    activoId: z.number().min(1, 'Activo requerido'),
    usuarioId: z.number().min(1, 'Usuario requerido'),
    observacion: z.string().optional(),
})

type AsignacionForm = z.infer<typeof asignacionSchema>

export function AsignacionesPage() {
    const queryClient = useQueryClient()
    const [assetType, setAssetType] = useState<'equipos' | 'monitores'>('equipos')
    const [actionType, setActionType] = useState<'asignar' | 'desasignar' | 'cambiar'>('asignar')
    const [statusMessage, setStatusMessage] = useState<string | null>(null)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const equiposQuery = useQuery<EquipoResponse[], Error>({ queryKey: ['equipos'], queryFn: fetchEquipos })
    const monitoresQuery = useQuery<MonitorResponse[], Error>({ queryKey: ['monitores'], queryFn: fetchMonitores })
    const usuariosQuery = useQuery<UsuarioResponse[], Error>({ queryKey: ['usuarios'], queryFn: fetchUsuarios })

    const asignarEquipoMutation = useMutation<EquipoResponse, Error, AsignacionRequest>({
        mutationFn: asignarEquipo,
    })
    const asignarMonitorMutation = useMutation<MonitorResponse, Error, AsignacionRequest>({
        mutationFn: asignarMonitor,
    })
    const desasignarEquipoMutation = useMutation<EquipoResponse, Error, number>({
        mutationFn: (equipoId: number) => desasignarEquipo(equipoId),
    })
    const desasignarMonitorMutation = useMutation<MonitorResponse, Error, number>({
        mutationFn: (monitorId: number) => desasignarMonitor(monitorId),
    })
    const cambiarUsuarioEquipoMutation = useMutation<EquipoResponse, Error, { activoId: number; usuarioId: number; observacion?: string }>({
        mutationFn: ({ activoId, usuarioId, observacion }) => cambiarUsuarioEquipo(activoId, { activoId, usuarioId, observacion }),
    })
    const cambiarUsuarioMonitorMutation = useMutation<MonitorResponse, Error, { activoId: number; usuarioId: number; observacion?: string }>({
        mutationFn: ({ activoId, usuarioId, observacion }) => cambiarUsuarioMonitor(activoId, { activoId, usuarioId, observacion }),
    })

    const form = useForm<AsignacionForm>({ resolver: zodResolver(asignacionSchema), defaultValues: { observacion: '' } })

    const equipos = equiposQuery.data ?? []
    const monitores = monitoresQuery.data ?? []
    const usuarios = usuariosQuery.data ?? []

    const activosDisponibles = useMemo(() => {
        const source = assetType === 'equipos' ? equipos : monitores
        if (actionType === 'asignar') {
            return source.filter((item) => item.estado === 'EN_BODEGA')
        }
        return source.filter((item) => item.estado === 'ASIGNADO')
    }, [assetType, actionType, equipos, monitores])

    const usuariosActivos = useMemo(() => usuarios.filter((user) => user.estado === 'ACTIVO'), [usuarios])

    const handleSuccess = (message: string) => {
        queryClient.invalidateQueries({ queryKey: ['equipos'] })
        queryClient.invalidateQueries({ queryKey: ['monitores'] })
        queryClient.invalidateQueries({ queryKey: ['usuarios'] })
        setStatusMessage(message)
        setErrorMessage(null)
        form.reset({ observacion: '' })
    }

    const handleError = (error: unknown) => {
        const message = error instanceof Error ? error.message : 'Ocurrió un error en el servidor'
        setErrorMessage(message)
        setStatusMessage(null)
    }

    const onSubmit = async (values: AsignacionForm) => {
        try {
            if (assetType === 'equipos') {
                if (actionType === 'asignar') {
                    await asignarEquipoMutation.mutateAsync(values)
                    handleSuccess('Equipo asignado correctamente.')
                }
                if (actionType === 'desasignar') {
                    await desasignarEquipoMutation.mutateAsync(values.activoId)
                    handleSuccess('Equipo desasignado correctamente.')
                }
                if (actionType === 'cambiar') {
                    await cambiarUsuarioEquipoMutation.mutateAsync({ activoId: values.activoId, usuarioId: values.usuarioId, observacion: values.observacion })
                    handleSuccess('Usuario del equipo actualizado correctamente.')
                }
            } else {
                if (actionType === 'asignar') {
                    await asignarMonitorMutation.mutateAsync(values)
                    handleSuccess('Monitor asignado correctamente.')
                }
                if (actionType === 'desasignar') {
                    await desasignarMonitorMutation.mutateAsync(values.activoId)
                    handleSuccess('Monitor desasignado correctamente.')
                }
                if (actionType === 'cambiar') {
                    await cambiarUsuarioMonitorMutation.mutateAsync({ activoId: values.activoId, usuarioId: values.usuarioId, observacion: values.observacion })
                    handleSuccess('Usuario del monitor actualizado correctamente.')
                }
            }
        } catch (error) {
            handleError(error)
        }
    }

    const assetLabel = assetType === 'equipos' ? 'Equipo' : 'Monitor'
    const actionLabel = actionType === 'asignar' ? 'Asignar' : actionType === 'desasignar' ? 'Desasignar' : 'Cambiar usuario'

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-semibold text-slate-900">Asignaciones</h1>
                <p className="text-slate-600">Asigna, desasigna o cambia usuario de equipos y monitores.</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-center gap-3">
                    {['equipos', 'monitores'].map((type) => (
                        <button
                            key={type}
                            type="button"
                            onClick={() => setAssetType(type as 'equipos' | 'monitores')}
                            className={
                                assetType === type
                                    ? 'rounded-full bg-slate-900 px-4 py-2 text-sm text-white'
                                    : 'rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700 hover:bg-slate-200'
                            }
                        >
                            {type === 'equipos' ? 'Equipos' : 'Monitores'}
                        </button>
                    ))}
                    {['asignar', 'desasignar', 'cambiar'].map((action) => (
                        <button
                            key={action}
                            type="button"
                            onClick={() => setActionType(action as 'asignar' | 'desasignar' | 'cambiar')}
                            className={
                                actionType === action
                                    ? 'rounded-full bg-slate-900 px-4 py-2 text-sm text-white'
                                    : 'rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700 hover:bg-slate-200'
                            }
                        >
                            {action === 'asignar' ? 'Asignar' : action === 'desasignar' ? 'Desasignar' : 'Cambiar usuario'}
                        </button>
                    ))}
                </div>

                <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 grid gap-6 lg:grid-cols-2">
                    <div className="space-y-3">
                        <label className="block text-sm text-slate-700">
                            {assetLabel}
                            <select
                                {...form.register('activoId', { valueAsNumber: true })}
                                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
                            >
                                <option value="">Seleccione activo</option>
                                {activosDisponibles.map((activo) => (
                                    <option key={activo.id} value={activo.id}>
                                        {activo.placa} • {activo.serial}
                                    </option>
                                ))}
                            </select>
                        </label>
                        {form.formState.errors.activoId && <p className="text-sm text-rose-600">{form.formState.errors.activoId.message}</p>}
                    </div>

                    {(actionType === 'asignar' || actionType === 'cambiar') && (
                        <div className="space-y-3">
                            <label className="block text-sm text-slate-700">
                                Usuario
                                <select
                                    {...form.register('usuarioId', { valueAsNumber: true })}
                                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
                                >
                                    <option value="">Seleccione usuario</option>
                                    {usuariosActivos.map((usuario) => (
                                        <option key={usuario.id} value={usuario.id}>
                                            {usuario.nombre} ({usuario.documento})
                                        </option>
                                    ))}
                                </select>
                            </label>
                            {form.formState.errors.usuarioId && <p className="text-sm text-rose-600">{form.formState.errors.usuarioId.message}</p>}
                        </div>
                    )}

                    <label className="block text-sm text-slate-700 lg:col-span-2">
                        Observación (opcional)
                        <textarea
                            {...form.register('observacion')}
                            className="mt-2 h-28 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
                        />
                    </label>

                    <button type="submit" className="rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-500">
                        {actionLabel}
                    </button>
                </form>

                {statusMessage && <div className="mt-6 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{statusMessage}</div>}
                {errorMessage && <div className="mt-6 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-800">{errorMessage}</div>}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold text-slate-900">Activos disponibles</h2>
                    <p className="text-sm text-slate-600">{actionType === 'asignar' ? 'Solo activos en bodega pueden asignarse.' : 'Solo activos asignados pueden desasignarse o cambiar de usuario.'}</p>
                    <div className="mt-4 space-y-2">
                        {activosDisponibles.length > 0 ? (
                            activosDisponibles.slice(0, 6).map((activo) => (
                                <div key={activo.id} className="rounded-2xl bg-white p-4 shadow-sm">
                                    <div className="text-sm font-semibold text-slate-900">{activo.placa}</div>
                                    <div className="text-sm text-slate-600">{activo.serial}</div>
                                </div>
                            ))
                        ) : (
                            <div className="rounded-2xl bg-white p-4 text-sm text-slate-600">No hay activos disponibles para esta acción.</div>
                        )}
                    </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold text-slate-900">Usuarios activos</h2>
                    <div className="mt-4 space-y-2">
                        {usuariosActivos.slice(0, 6).map((usuario) => (
                            <div key={usuario.id} className="rounded-2xl bg-white p-4 shadow-sm">
                                <div className="text-sm font-semibold text-slate-900">{usuario.nombre}</div>
                                <div className="text-sm text-slate-600">{usuario.correo}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
