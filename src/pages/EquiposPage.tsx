import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { fetchEquipos, createEquipo, updateEquipo, deleteEquipo } from '../api/equipos'
import { fetchProveedores, fetchContratos } from '../api/catalog'
import { EquipoResponse, EquipoRequest, ProveedorResponse, ContratoRentingResponse } from '../types'
import { BadgeEstado } from '../components/BadgeEstado'
import { formatDate, formatCurrency } from '../utils/formatters'

const equipoSchema = z.object({
    placa: z.string().min(2, 'Placa requerida'),
    serial: z.string().min(2, 'Serial requerido'),
    tipo: z.enum(['LAPTOP', 'DESKTOP']),
    marca: z.string().min(2, 'Marca requerida'),
    modelo: z.string().min(2, 'Modelo requerido'),
    procesador: z.string().optional(),
    ram: z.string().optional(),
    almacenamiento: z.string().optional(),
    sistemaOperativo: z.string().optional(),
    fechaIngreso: z.string().min(10, 'Fecha de ingreso requerida'),
    valorMensual: z.number().min(0, 'Valor mensual requerido'),
    observaciones: z.string().optional(),
    proveedorId: z.number().min(1, 'Proveedor requerido'),
    contratoId: z.number().min(1, 'Contrato requerido'),
})

type EquipoForm = z.infer<typeof equipoSchema>

export function EquiposPage() {
    const queryClient = useQueryClient()
    const [search, setSearch] = useState('')
    const [showForm, setShowForm] = useState(false)
    const [editingEquipo, setEditingEquipo] = useState<EquipoResponse | null>(null)
    const [statusMessage, setStatusMessage] = useState<string | null>(null)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const equiposQuery = useQuery<EquipoResponse[], Error>({ queryKey: ['equipos'], queryFn: fetchEquipos })
    const proveedoresQuery = useQuery<ProveedorResponse[], Error>({ queryKey: ['proveedores'], queryFn: fetchProveedores })
    const contratosQuery = useQuery<ContratoRentingResponse[], Error>({ queryKey: ['contratos'], queryFn: fetchContratos })

    const createMutation = useMutation<EquipoResponse, Error, EquipoRequest>({
        mutationFn: createEquipo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['equipos'] })
            setStatusMessage('Equipo creado correctamente.')
            setErrorMessage(null)
            setShowForm(false)
            setEditingEquipo(null)
        },
        onError: (error) => {
            setErrorMessage(error.message)
            setStatusMessage(null)
        },
    })

    const updateMutation = useMutation<EquipoResponse, Error, EquipoRequest>({
        mutationFn: async (payload) => {
            if (!editingEquipo) throw new Error('No hay equipo seleccionado')
            return updateEquipo(editingEquipo.id, payload)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['equipos'] })
            setStatusMessage('Equipo actualizado correctamente.')
            setErrorMessage(null)
            setShowForm(false)
            setEditingEquipo(null)
        },
        onError: (error) => {
            setErrorMessage(error.message)
            setStatusMessage(null)
        },
    })

    const deleteMutation = useMutation<void, Error, number>({
        mutationFn: deleteEquipo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['equipos'] })
            setStatusMessage('Equipo eliminado correctamente.')
            setErrorMessage(null)
        },
        onError: (error) => {
            setErrorMessage(error.message)
            setStatusMessage(null)
        },
    })

    const form = useForm<EquipoForm>({
        resolver: zodResolver(equipoSchema),
        defaultValues: {
            placa: '',
            serial: '',
            tipo: 'LAPTOP',
            marca: '',
            modelo: '',
            procesador: '',
            ram: '',
            almacenamiento: '',
            sistemaOperativo: '',
            fechaIngreso: new Date().toISOString().slice(0, 10),
            valorMensual: 0,
            observaciones: '',
            proveedorId: 0,
            contratoId: 0,
        },
    })

    const equipos = equiposQuery.data ?? []
    const proveedores = proveedoresQuery.data ?? []
    const contratos = contratosQuery.data ?? []
    const isLoading = equiposQuery.isLoading
    const error = equiposQuery.error

    const filtered = equipos.filter((item) => {
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
        setEditingEquipo(null)
        setShowForm((current) => !current)
        setStatusMessage(null)
        setErrorMessage(null)
        form.reset({
            placa: '',
            serial: '',
            tipo: 'LAPTOP',
            marca: '',
            modelo: '',
            procesador: '',
            ram: '',
            almacenamiento: '',
            sistemaOperativo: '',
            fechaIngreso: new Date().toISOString().slice(0, 10),
            valorMensual: 0,
            observaciones: '',
            proveedorId: 0,
            contratoId: 0,
        })
    }

    const handleEdit = (equipo: EquipoResponse) => {
        setEditingEquipo(equipo)
        setShowForm(true)
        setStatusMessage(null)
        setErrorMessage(null)
        form.reset({
            placa: equipo.placa,
            serial: equipo.serial,
            tipo: equipo.tipo,
            marca: equipo.marca,
            modelo: equipo.modelo,
            procesador: equipo.procesador ?? '',
            ram: equipo.ram ?? '',
            almacenamiento: equipo.almacenamiento ?? '',
            sistemaOperativo: equipo.sistemaOperativo ?? '',
            fechaIngreso: equipo.fechaIngreso,
            valorMensual: equipo.valorMensual,
            observaciones: equipo.observaciones ?? '',
            proveedorId: equipo.proveedorId,
            contratoId: equipo.contratoId,
        })
    }

    const onSubmit = async (values: EquipoForm) => {
        if (editingEquipo) {
            await updateMutation.mutateAsync(values)
        } else {
            await createMutation.mutateAsync(values)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-semibold text-slate-900">Equipos</h1>
                    <p className="text-slate-600">Inventario operativo de equipos.</p>
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
                        {showForm ? 'Ocultar formulario' : editingEquipo ? 'Editar equipo' : 'Nuevo equipo'}
                    </button>
                </div>
            </div>

            {showForm && (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-xl font-semibold text-slate-900">{editingEquipo ? 'Editar equipo' : 'Crear nuevo equipo'}</h2>
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
                            Tipo
                            <select
                                {...form.register('tipo')}
                                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
                            >
                                <option value="LAPTOP">Laptop</option>
                                <option value="DESKTOP">Desktop</option>
                            </select>
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
                            Contrato
                            <select
                                {...form.register('contratoId', { valueAsNumber: true })}
                                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
                            >
                                <option value="0">Seleccione contrato</option>
                                {contratos.map((contrato) => (
                                    <option key={contrato.id} value={contrato.id}>
                                        {contrato.numeroContrato}
                                    </option>
                                ))}
                            </select>
                            {form.formState.errors.contratoId && <p className="text-sm text-rose-600">{form.formState.errors.contratoId.message}</p>}
                        </label>
                        <label className="block text-sm text-slate-700">
                            Fecha ingreso
                            <input
                                type="date"
                                {...form.register('fechaIngreso')}
                                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
                            />
                            {form.formState.errors.fechaIngreso && <p className="text-sm text-rose-600">{form.formState.errors.fechaIngreso.message}</p>}
                        </label>
                        <label className="block text-sm text-slate-700">
                            Valor mensual
                            <input
                                type="number"
                                step="0.01"
                                {...form.register('valorMensual', { valueAsNumber: true })}
                                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
                            />
                            {form.formState.errors.valorMensual && <p className="text-sm text-rose-600">{form.formState.errors.valorMensual.message}</p>}
                        </label>
                        <label className="block text-sm text-slate-700 lg:col-span-2">
                            Procesador
                            <input
                                {...form.register('procesador')}
                                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
                            />
                        </label>
                        <label className="block text-sm text-slate-700 lg:col-span-2">
                            RAM
                            <input
                                {...form.register('ram')}
                                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
                            />
                        </label>
                        <label className="block text-sm text-slate-700 lg:col-span-2">
                            Almacenamiento
                            <input
                                {...form.register('almacenamiento')}
                                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
                            />
                        </label>
                        <label className="block text-sm text-slate-700 lg:col-span-2">
                            Sistema operativo
                            <input
                                {...form.register('sistemaOperativo')}
                                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
                            />
                        </label>
                        <label className="block text-sm text-slate-700 lg:col-span-2">
                            Observaciones
                            <textarea
                                {...form.register('observaciones')}
                                className="mt-2 h-28 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
                            />
                        </label>
                        <div className="lg:col-span-2 flex flex-wrap gap-3">
                            <button
                                type="submit"
                                className="rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-500"
                            >
                                {editingEquipo ? 'Guardar cambios' : 'Crear equipo'}
                            </button>
                            {editingEquipo && (
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
                <div>Cargando equipos...</div>
            ) : error ? (
                <div className="rounded-3xl border border-rose-200 bg-rose-50 p-4 text-rose-700">Error al cargar equipos.</div>
            ) : (
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                        <thead className="bg-slate-50 text-slate-600">
                            <tr>
                                <th className="px-4 py-4 font-semibold">Placa</th>
                                <th className="px-4 py-4 font-semibold">Serial</th>
                                <th className="px-4 py-4 font-semibold">Tipo</th>
                                <th className="px-4 py-4 font-semibold">Usuario</th>
                                <th className="px-4 py-4 font-semibold">Estado</th>
                                <th className="px-4 py-4 font-semibold">Ingreso</th>
                                <th className="px-4 py-4 font-semibold">Valor</th>
                                <th className="px-4 py-4 font-semibold">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                            {filtered.map((equipo) => (
                                <tr key={equipo.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-4 text-slate-900">{equipo.placa}</td>
                                    <td className="px-4 py-4 text-slate-500">{equipo.serial}</td>
                                    <td className="px-4 py-4 text-slate-500">{equipo.tipo}</td>
                                    <td className="px-4 py-4 text-slate-700">{equipo.usuarioAsignadoNombre ?? 'Sin asignar'}</td>
                                    <td className="px-4 py-4"><BadgeEstado estado={equipo.estado} /></td>
                                    <td className="px-4 py-4 text-slate-500">{formatDate(equipo.fechaIngreso)}</td>
                                    <td className="px-4 py-4 text-slate-700">{formatCurrency(equipo.valorMensual)}</td>
                                    <td className="px-4 py-4 space-x-2 text-slate-700">
                                        <button
                                            type="button"
                                            onClick={() => handleEdit(equipo)}
                                            className="rounded-2xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => deleteMutation.mutate(equipo.id)}
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
