import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
    fetchCentrosCosto,
    fetchContratos,
    fetchProveedores,
    fetchUsuarios,
    createProveedor,
    createCentroCosto,
    createContrato,
    createUsuario,
    deleteProveedor,
    deleteCentroCosto,
} from '../api/catalog'
import {
    CentroCostoRequest,
    CentroCostoResponse,
    ContratoRentingRequest,
    ContratoRentingResponse,
    ProveedorRequest,
    ProveedorResponse,
    UsuarioRequest,
    UsuarioResponse,
} from '../types'

const proveedorSchema = z.object({ nombre: z.string().min(3, 'Nombre requerido') })
const centroSchema = z.object({ codigo: z.string().min(3, 'Código requerido'), nombre: z.string().min(3, 'Nombre requerido') })
const contratoSchema = z.object({
    numeroContrato: z.string().min(3, 'Contrato requerido'),
    proveedorId: z.number().min(1, 'Proveedor requerido'),
    fechaInicio: z.string().min(10, 'Fecha inicio requerida'),
    fechaFin: z.string().min(10, 'Fecha fin requerida'),
})
const usuarioSchema = z.object({
    documento: z.string().min(4, 'Documento requerido'),
    nombre: z.string().min(3, 'Nombre requerido'),
    correo: z.string().email('Correo inválido'),
    centroCostoId: z.number().min(1, 'Centro de costo requerido'),
    estado: z.enum(['ACTIVO', 'RETIRADO']),
})

type ProveedorForm = z.infer<typeof proveedorSchema>
type CentroForm = z.infer<typeof centroSchema>
type ContratoForm = z.infer<typeof contratoSchema>
type UsuarioForm = z.infer<typeof usuarioSchema>

export function CatalogosPage() {
    const queryClient = useQueryClient()
    const [activeTab, setActiveTab] = useState<'proveedores' | 'centros' | 'contratos' | 'usuarios'>('proveedores')

    const proveedoresQuery = useQuery<ProveedorResponse[], Error>({ queryKey: ['proveedores'], queryFn: fetchProveedores })
    const centrosQuery = useQuery<CentroCostoResponse[], Error>({ queryKey: ['centros'], queryFn: fetchCentrosCosto })
    const contratosQuery = useQuery<ContratoRentingResponse[], Error>({ queryKey: ['contratos'], queryFn: fetchContratos })
    const usuariosQuery = useQuery<UsuarioResponse[], Error>({ queryKey: ['usuarios'], queryFn: fetchUsuarios })

    const proveedorMutation = useMutation<ProveedorResponse, Error, ProveedorRequest>({
        mutationFn: createProveedor,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['proveedores'] }),
    })
    const centroMutation = useMutation<CentroCostoResponse, Error, CentroCostoRequest>({
        mutationFn: createCentroCosto,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['centros'] }),
    })
    const contratoMutation = useMutation<ContratoRentingResponse, Error, ContratoRentingRequest>({
        mutationFn: createContrato,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['contratos'] }),
    })
    const usuarioMutation = useMutation<UsuarioResponse, Error, UsuarioRequest>({
        mutationFn: createUsuario,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['usuarios'] }),
    })
    const proveedorDeleteMutation = useMutation<void, Error, number>({
        mutationFn: deleteProveedor,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['proveedores'] }),
    })
    const centroDeleteMutation = useMutation<void, Error, number>({
        mutationFn: deleteCentroCosto,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['centros'] }),
    })

    const proveedorForm = useForm<ProveedorForm>({ resolver: zodResolver(proveedorSchema) })
    const centroForm = useForm<CentroForm>({ resolver: zodResolver(centroSchema) })
    const contratoForm = useForm<ContratoForm>({ resolver: zodResolver(contratoSchema) })
    const usuarioForm = useForm<UsuarioForm>({
        resolver: zodResolver(usuarioSchema),
        defaultValues: { estado: 'ACTIVO' },
    })

    const proveedores = proveedoresQuery.data ?? []
    const centros = centrosQuery.data ?? []
    const contratos = contratosQuery.data ?? []
    const usuarios = usuariosQuery.data ?? []

    const proveedorOptions = useMemo(() => proveedores.map((item) => ({ value: item.id, label: item.nombre })), [proveedores])
    const centroOptions = useMemo(() => centros.map((item) => ({ value: item.id, label: item.codigo })), [centros])

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-semibold text-slate-900">Catálogos</h1>
                <p className="text-slate-600">Gestiona proveedores, centros de costo, contratos y usuarios empleados.</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap gap-2">
                    {['proveedores', 'centros', 'contratos', 'usuarios'].map((tab) => (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => setActiveTab(tab as typeof activeTab)}
                            className={
                                activeTab === tab
                                    ? 'rounded-full bg-slate-900 px-4 py-2 text-sm text-white'
                                    : 'rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700 hover:bg-slate-200'
                            }
                        >
                            {tab === 'proveedores' ? 'Proveedores' : tab === 'centros' ? 'Centros' : tab === 'contratos' ? 'Contratos' : 'Usuarios'}
                        </button>
                    ))}
                </div>

                {activeTab === 'proveedores' && (
                    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_2fr]">
                        <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                            <h2 className="mb-4 text-xl font-semibold text-slate-900">Nuevo proveedor</h2>
                            <form
                                onSubmit={proveedorForm.handleSubmit(async (values) => {
                                    await proveedorMutation.mutateAsync(values)
                                    proveedorForm.reset()
                                })}
                                className="space-y-4"
                            >
                                <label className="block text-sm text-slate-700">
                                    Nombre
                                    <input
                                        {...proveedorForm.register('nombre')}
                                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
                                    />
                                    {proveedorForm.formState.errors.nombre && (
                                        <span className="text-sm text-rose-600">{proveedorForm.formState.errors.nombre.message}</span>
                                    )}
                                </label>
                                <button type="submit" className="rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-500">
                                    Crear proveedor
                                </button>
                            </form>
                        </section>

                        <section>
                            <h2 className="mb-4 text-xl font-semibold text-slate-900">Listado de proveedores</h2>
                            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                                <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                                    <thead className="bg-slate-50 text-slate-600">
                                        <tr>
                                            <th className="px-4 py-4 font-semibold">ID</th>
                                            <th className="px-4 py-4 font-semibold">Nombre</th>
                                            <th className="px-4 py-4 font-semibold">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 bg-white">
                                        {proveedores.map((item) => (
                                            <tr key={item.id}>
                                                <td className="px-4 py-4 text-slate-700">{item.id}</td>
                                                <td className="px-4 py-4 text-slate-900">{item.nombre}</td>
                                                <td className="px-4 py-4 text-slate-700">
                                                    <button
                                                        type="button"
                                                        onClick={() => proveedorDeleteMutation.mutate(item.id)}
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
                        </section>
                    </div>
                )}

                {activeTab === 'centros' && (
                    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_2fr]">
                        <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                            <h2 className="mb-4 text-xl font-semibold text-slate-900">Nuevo centro de costo</h2>
                            <form
                                onSubmit={centroForm.handleSubmit(async (values) => {
                                    await centroMutation.mutateAsync(values)
                                    centroForm.reset()
                                })}
                                className="space-y-4"
                            >
                                <label className="block text-sm text-slate-700">
                                    Código
                                    <input
                                        {...centroForm.register('codigo')}
                                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
                                    />
                                    {centroForm.formState.errors.codigo && (
                                        <span className="text-sm text-rose-600">{centroForm.formState.errors.codigo.message}</span>
                                    )}
                                </label>
                                <label className="block text-sm text-slate-700">
                                    Nombre
                                    <input
                                        {...centroForm.register('nombre')}
                                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
                                    />
                                    {centroForm.formState.errors.nombre && (
                                        <span className="text-sm text-rose-600">{centroForm.formState.errors.nombre.message}</span>
                                    )}
                                </label>
                                <button type="submit" className="rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-500">
                                    Crear centro
                                </button>
                            </form>
                        </section>

                        <section>
                            <h2 className="mb-4 text-xl font-semibold text-slate-900">Listado de centros</h2>
                            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                                <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                                    <thead className="bg-slate-50 text-slate-600">
                                        <tr>
                                            <th className="px-4 py-4 font-semibold">ID</th>
                                            <th className="px-4 py-4 font-semibold">Código</th>
                                            <th className="px-4 py-4 font-semibold">Nombre</th>
                                            <th className="px-4 py-4 font-semibold">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 bg-white">
                                        {centros.map((item) => (
                                            <tr key={item.id}>
                                                <td className="px-4 py-4 text-slate-700">{item.id}</td>
                                                <td className="px-4 py-4 text-slate-900">{item.codigo}</td>
                                                <td className="px-4 py-4 text-slate-700">{item.nombre}</td>
                                                <td className="px-4 py-4 text-slate-700">
                                                    <button
                                                        type="button"
                                                        onClick={() => centroDeleteMutation.mutate(item.id)}
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
                        </section>
                    </div>
                )}

                {activeTab === 'contratos' && (
                    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_2fr]">
                        <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                            <h2 className="mb-4 text-xl font-semibold text-slate-900">Nuevo contrato</h2>
                            <form
                                onSubmit={contratoForm.handleSubmit(async (values) => {
                                    await contratoMutation.mutateAsync(values)
                                    contratoForm.reset()
                                })}
                                className="space-y-4"
                            >
                                <label className="block text-sm text-slate-700">
                                    Número contrato
                                    <input
                                        {...contratoForm.register('numeroContrato')}
                                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
                                    />
                                    {contratoForm.formState.errors.numeroContrato && (
                                        <span className="text-sm text-rose-600">{contratoForm.formState.errors.numeroContrato.message}</span>
                                    )}
                                </label>
                                <label className="block text-sm text-slate-700">
                                    Proveedor
                                    <select
                                        {...contratoForm.register('proveedorId', { valueAsNumber: true })}
                                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
                                    >
                                        <option value="">Seleccione proveedor</option>
                                        {proveedorOptions.map((item) => (
                                            <option key={item.value} value={item.value}>{item.label}</option>
                                        ))}
                                    </select>
                                    {contratoForm.formState.errors.proveedorId && (
                                        <span className="text-sm text-rose-600">{contratoForm.formState.errors.proveedorId.message}</span>
                                    )}
                                </label>
                                <label className="block text-sm text-slate-700">
                                    Fecha inicio
                                    <input
                                        type="date"
                                        {...contratoForm.register('fechaInicio')}
                                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
                                    />
                                    {contratoForm.formState.errors.fechaInicio && (
                                        <span className="text-sm text-rose-600">{contratoForm.formState.errors.fechaInicio.message}</span>
                                    )}
                                </label>
                                <label className="block text-sm text-slate-700">
                                    Fecha fin
                                    <input
                                        type="date"
                                        {...contratoForm.register('fechaFin')}
                                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
                                    />
                                    {contratoForm.formState.errors.fechaFin && (
                                        <span className="text-sm text-rose-600">{contratoForm.formState.errors.fechaFin.message}</span>
                                    )}
                                </label>
                                <button type="submit" className="rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-500">
                                    Crear contrato
                                </button>
                            </form>
                        </section>

                        <section>
                            <h2 className="mb-4 text-xl font-semibold text-slate-900">Listado de contratos</h2>
                            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                                <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                                    <thead className="bg-slate-50 text-slate-600">
                                        <tr>
                                            <th className="px-4 py-4 font-semibold">ID</th>
                                            <th className="px-4 py-4 font-semibold">Contrato</th>
                                            <th className="px-4 py-4 font-semibold">Proveedor</th>
                                            <th className="px-4 py-4 font-semibold">Inicio</th>
                                            <th className="px-4 py-4 font-semibold">Fin</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 bg-white">
                                        {contratos.map((item) => (
                                            <tr key={item.id}>
                                                <td className="px-4 py-4 text-slate-700">{item.id}</td>
                                                <td className="px-4 py-4 text-slate-900">{item.numeroContrato}</td>
                                                <td className="px-4 py-4 text-slate-700">{item.proveedorNombre}</td>
                                                <td className="px-4 py-4 text-slate-700">{item.fechaInicio}</td>
                                                <td className="px-4 py-4 text-slate-700">{item.fechaFin}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === 'usuarios' && (
                    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_2fr]">
                        <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                            <h2 className="mb-4 text-xl font-semibold text-slate-900">Nuevo usuario</h2>
                            <form
                                onSubmit={usuarioForm.handleSubmit(async (values) => {
                                    await usuarioMutation.mutateAsync(values)
                                    usuarioForm.reset({ estado: 'ACTIVO' })
                                })}
                                className="space-y-4"
                            >
                                <label className="block text-sm text-slate-700">
                                    Documento
                                    <input
                                        {...usuarioForm.register('documento')}
                                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
                                    />
                                    {usuarioForm.formState.errors.documento && (
                                        <span className="text-sm text-rose-600">{usuarioForm.formState.errors.documento.message}</span>
                                    )}
                                </label>
                                <label className="block text-sm text-slate-700">
                                    Nombre
                                    <input
                                        {...usuarioForm.register('nombre')}
                                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
                                    />
                                    {usuarioForm.formState.errors.nombre && (
                                        <span className="text-sm text-rose-600">{usuarioForm.formState.errors.nombre.message}</span>
                                    )}
                                </label>
                                <label className="block text-sm text-slate-700">
                                    Correo
                                    <input
                                        type="email"
                                        {...usuarioForm.register('correo')}
                                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
                                    />
                                    {usuarioForm.formState.errors.correo && (
                                        <span className="text-sm text-rose-600">{usuarioForm.formState.errors.correo.message}</span>
                                    )}
                                </label>
                                <label className="block text-sm text-slate-700">
                                    Centro de costo
                                    <select
                                        {...usuarioForm.register('centroCostoId', { valueAsNumber: true })}
                                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
                                    >
                                        <option value="">Seleccione centro</option>
                                        {centroOptions.map((item) => (
                                            <option key={item.value} value={item.value}>{item.label}</option>
                                        ))}
                                    </select>
                                    {usuarioForm.formState.errors.centroCostoId && (
                                        <span className="text-sm text-rose-600">{usuarioForm.formState.errors.centroCostoId.message}</span>
                                    )}
                                </label>
                                <label className="block text-sm text-slate-700">
                                    Estado
                                    <select
                                        {...usuarioForm.register('estado')}
                                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
                                    >
                                        <option value="ACTIVO">ACTIVO</option>
                                        <option value="RETIRADO">RETIRADO</option>
                                    </select>
                                </label>
                                <button type="submit" className="rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-500">
                                    Crear usuario
                                </button>
                            </form>
                        </section>

                        <section>
                            <h2 className="mb-4 text-xl font-semibold text-slate-900">Listado de usuarios</h2>
                            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                                <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                                    <thead className="bg-slate-50 text-slate-600">
                                        <tr>
                                            <th className="px-4 py-4 font-semibold">ID</th>
                                            <th className="px-4 py-4 font-semibold">Documento</th>
                                            <th className="px-4 py-4 font-semibold">Nombre</th>
                                            <th className="px-4 py-4 font-semibold">Correo</th>
                                            <th className="px-4 py-4 font-semibold">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 bg-white">
                                        {usuarios.map((item) => (
                                            <tr key={item.id}>
                                                <td className="px-4 py-4 text-slate-700">{item.id}</td>
                                                <td className="px-4 py-4 text-slate-900">{item.documento}</td>
                                                <td className="px-4 py-4 text-slate-700">{item.nombre}</td>
                                                <td className="px-4 py-4 text-slate-700">{item.correo}</td>
                                                <td className="px-4 py-4 text-slate-700">{item.estado}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>
                )}
            </div>
        </div>
    )
}
