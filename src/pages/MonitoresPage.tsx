import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { fetchMonitores, createMonitor, updateMonitor, deleteMonitor } from '../api/monitores'
import { fetchProveedores } from '../api/catalog'
import { MonitorResponse, MonitorRequest, ProveedorResponse } from '../types'
import { BadgeEstado } from '../components/BadgeEstado'

const monitorSchema = z.object({
    placa: z.string().min(2, 'Placa requerida'),
    serial: z.string().min(2, 'Serial requerido'),
    marca: z.string().min(2, 'Marca requerida'),
    modelo: z.string().min(2, 'Modelo requerido'),
    proveedorId: z.number().min(1, 'Proveedor requerido'),
    estado: z.enum(['EN_BODEGA', 'ASIGNADO', 'DEVUELTO_PROVEEDOR']),
})

type MonitorForm = z.infer<typeof monitorSchema>

export function MonitoresPage() {
    const queryClient = useQueryClient()
    const [search, setSearch] = useState('')
    const [showForm, setShowForm] = useState(false)
    const [editingMonitor, setEditingMonitor] = useState<MonitorResponse | null>(null)
    const [statusMessage, setStatusMessage] = useState<string | null>(null)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const monitoresQuery = useQuery<MonitorResponse[], Error>({ queryKey: ['monitores'], queryFn: fetchMonitores })
    const proveedoresQuery = useQuery<ProveedorResponse[], Error>({ queryKey: ['proveedores'], queryFn: fetchProveedores })

    const createMutation = useMutation<MonitorResponse, Error, MonitorRequest>({
        mutationFn: createMonitor,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['monitores'] })
            setStatusMessage('Monitor creado correctamente.')
            setErrorMessage(null)
            setShowForm(false)
            setEditingMonitor(null)
        },
        onError: (error) => {
            setErrorMessage(error.message)
            setStatusMessage(null)
        },
    })

    const updateMutation = useMutation<MonitorResponse, Error, MonitorRequest>({
        mutationFn: async (payload) => {
            if (!editingMonitor) throw new Error('No hay monitor seleccionado')
            return updateMonitor(editingMonitor.id, payload)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['monitores'] })
            setStatusMessage('Monitor actualizado correctamente.')
            setErrorMessage(null)
            setShowForm(false)
            setEditingMonitor(null)
        },
        onError: (error) => {
            setErrorMessage(error.message)
            setStatusMessage(null)
        },
    })

    const deleteMutation = useMutation<void, Error, number>({
        mutationFn: deleteMonitor,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['monitores'] })
            setStatusMessage('Monitor eliminado correctamente.')
            setErrorMessage(null)
        },
        onError: (error) => {
            setErrorMessage(error.message)
            setStatusMessage(null)
        },
    })

    const form = useForm<MonitorForm>({
        resolver: zodResolver(monitorSchema),
        defaultValues: {
            placa: '',
            serial: '',
            marca: '',
            modelo: '',
            proveedorId: 0,
            estado: 'EN_BODEGA',
        },
    })

    const monitores = monitoresQuery.data ?? []
    const proveedores = proveedoresQuery.data ?? []
    const isLoading = monitoresQuery.isLoading
    const error = monitoresQuery.error

    const filtered = monitores.filter((item) => {
        const term = search.toLowerCase()
        return (
            item.placa.toLowerCase().includes(term) ||
            item.serial.toLowerCase().includes(term) ||
            item.marca.toLowerCase().includes(term) ||
            item.modelo.toLowerCase().includes(term) ||
            item.usuarioAsignadoNombre?.toLowerCase().includes(term)
        )
    })

    const startNew = () => {
        setEditingMonitor(null)
        setShowForm((current) => !current)
        setStatusMessage(null)
        setErrorMessage(null)
        form.reset({ placa: '', serial: '', marca: '', modelo: '', proveedorId: 0, estado: 'EN_BODEGA' })
    }

    const handleEdit = (monitor: MonitorResponse) => {
        setEditingMonitor(monitor)
        setShowForm(true)
        setStatusMessage(null)
        setErrorMessage(null)
        form.reset({
            placa: monitor.placa,
            serial: monitor.serial,
            marca: monitor.marca,
            modelo: monitor.modelo,
            proveedorId: monitor.proveedorId,
            estado: monitor.estado,
        })
    }

    const onSubmit = async (values: MonitorForm) => {
        if (editingMonitor) {
            await updateMutation.mutateAsync(values)
        } else {
            await createMutation.mutateAsync(values)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-semibold text-slate-900">Monitores</h1>
                    <p className="text-slate-600">Inventario operativo de monitores.</p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-400 sm:w-80"
                        placeholder="Buscar por placa, serial, marca, modelo o usuario"
                    />
                    <button
                        type="button"
                        onClick={startNew}
                        className="rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-500"
                    >
                        {showForm ? 'Ocultar formulario' : editingMonitor ? 'Editar monitor' : 'Nuevo monitor'}
                    </button>
                </div>
            </div>

            {showForm && (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-xl font-semibold text-slate-900">{editingMonitor ? 'Editar monitor' : 'Crear nuevo monitor'}</h2>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 lg:grid-cols-2">
                        <label className="block text-sm text-slate-700">
                            Placa
                            <input
                                {...form.register('placa')}
                                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
                            />
                            {form.formState.errors.placa && <p className="text-sm text-rose-600">{form.formState.errors.placa.message}</p>}
                        </label>
                        <label className="block text-sm text-slate-700">
                            Serial
                            <input
                                {...form.register('serial')}
                                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
                            />
                            {form.formState.errors.serial && <p className="text-sm text-rose-600">{form.formState.errors.serial.message}</p>}
                        </label>
                        <label className="block text-sm text-slate-700">
                            Marca
                            <input
                                {...form.register('marca')}
                                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
                            />
                            {form.formState.errors.marca && <p className="text-sm text-rose-600">{form.formState.errors.marca.message}</p>}
                        </label>
                        <label className="block text-sm text-slate-700">
                            Modelo
                            <input
                                {...form.register('modelo')}
                                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
                            />
                            {form.formState.errors.modelo && <p className="text-sm text-rose-600">{form.formState.errors.modelo.message}</p>}
                        </label>
                        <label className="block text-sm text-slate-700">
                            Proveedor
                            <select
                                {...form.register('proveedorId', { valueAsNumber: true })}
                                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
                            >
                                <option value="0">Seleccione proveedor</option>
                                {proveedores.map((proveedor) => (
                                    <option key={proveedor.id} value={proveedor.id}>
                                        {proveedor.nombre}
                                    </option>
                                ))}
                            </select>
                            {form.formState.errors.proveedorId && <p className="text-sm text-rose-600">{form.formState.errors.proveedorId.message}</p>}
                        </label>
                        <label className="block text-sm text-slate-700">
                            Estado
                            <select
                                {...form.register('estado')}
                                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
                            >
                                <option value="EN_BODEGA">En bodega</option>
                                <option value="ASIGNADO">Asignado</option>
                                <option value="DEVUELTO_PROVEEDOR">Devuelto proveedor</option>
                            </select>
                            {form.formState.errors.estado && <p className="text-sm text-rose-600">{form.formState.errors.estado.message}</p>}
                        </label>
                        <div className="lg:col-span-2 flex flex-wrap gap-3">
                            <button
                                type="submit"
                                className="rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-500"
                            >
                                {editingMonitor ? 'Guardar cambios' : 'Crear monitor'}
                            </button>
                            {editingMonitor && (
                                <button
                                    type="button"
                                    onClick={startNew}
                                    className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                                >
                                    Cancelar edición
                                </button>
                            )}
                        </div>
                    </form>
                    {statusMessage && <div className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{statusMessage}</div>}
                    {errorMessage && <div className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-800">{errorMessage}</div>}
                </div>
            )}

            {isLoading ? (
                <div>Cargando monitores...</div>
            ) : error ? (
                <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-rose-700">Error al cargar monitores.</div>
            ) : (
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                        <thead className="bg-slate-50 text-slate-600">
                            <tr>
                                <th className="px-4 py-4 font-semibold">Placa</th>
                                <th className="px-4 py-4 font-semibold">Serial</th>
                                <th className="px-4 py-4 font-semibold">Marca</th>
                                <th className="px-4 py-4 font-semibold">Modelo</th>
                                <th className="px-4 py-4 font-semibold">Usuario</th>
                                <th className="px-4 py-4 font-semibold">Estado</th>
                                <th className="px-4 py-4 font-semibold">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                            {filtered.map((monitor) => (
                                <tr key={monitor.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-4 text-slate-900">{monitor.placa}</td>
                                    <td className="px-4 py-4 text-slate-500">{monitor.serial}</td>
                                    <td className="px-4 py-4 text-slate-500">{monitor.marca}</td>
                                    <td className="px-4 py-4 text-slate-500">{monitor.modelo}</td>
                                    <td className="px-4 py-4 text-slate-700">{monitor.usuarioAsignadoNombre ?? 'Sin asignar'}</td>
                                    <td className="px-4 py-4"><BadgeEstado estado={monitor.estado} /></td>
                                    <td className="px-4 py-4 space-x-2 text-slate-700">
                                        <button
                                            type="button"
                                            onClick={() => handleEdit(monitor)}
                                            className="rounded-2xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => deleteMutation.mutate(monitor.id)}
                                            className="rounded-2xl bg-rose-500 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-400"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
