import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { fetchUsuariosSistema, createUsuarioSistema, desactivarUsuarioSistema } from '../api/usuariosSistema'
import { UsuarioSistemaResponse } from '../types'

const usuarioSistemaSchema = z.object({
    username: z.string().min(4, 'Usuario requerido'),
    password: z.string().min(6, 'Contraseña requerida'),
    rol: z.enum(['ADMIN', 'EDITOR', 'LECTOR']),
})

type UsuarioSistemaForm = z.infer<typeof usuarioSistemaSchema>

export function UsuariosSistemaPage() {
    const queryClient = useQueryClient()
    const [statusMessage, setStatusMessage] = useState<string | null>(null)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const usuariosSistemaQuery = useQuery<UsuarioSistemaResponse[], Error>({ queryKey: ['usuarios-sistema'], queryFn: fetchUsuariosSistema })

    const createMutation = useMutation<UsuarioSistemaResponse, Error, { username: string; password: string; rol: 'ADMIN' | 'EDITOR' | 'LECTOR' }>({
        mutationFn: createUsuarioSistema,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['usuarios-sistema'] })
            setStatusMessage('Usuario creado correctamente.')
            setErrorMessage(null)
        },
        onError: (error: unknown) => {
            const message = error instanceof Error ? error.message : 'Error creando usuario'
            setErrorMessage(message)
            setStatusMessage(null)
        },
    })

    const desactivarMutation = useMutation<UsuarioSistemaResponse, Error, number>({
        mutationFn: desactivarUsuarioSistema,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['usuarios-sistema'] })
            setStatusMessage('Usuario desactivado correctamente.')
            setErrorMessage(null)
        },
        onError: (error: unknown) => {
            const message = error instanceof Error ? error.message : 'Error desactivando usuario'
            setErrorMessage(message)
            setStatusMessage(null)
        },
    })

    const form = useForm<UsuarioSistemaForm>({
        resolver: zodResolver(usuarioSistemaSchema),
        defaultValues: { rol: 'EDITOR' },
    })

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-semibold text-slate-900">Usuarios del sistema</h1>
                <p className="text-slate-600">Administra cuentas ADMIN, EDITOR y LECTOR.</p>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1fr_1.5fr]">
                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-xl font-semibold text-slate-900">Crear usuario</h2>
                    <form
                        onSubmit={form.handleSubmit(async (values) => {
                            await createMutation.mutateAsync(values)
                            form.reset({ rol: 'EDITOR' })
                        })}
                        className="space-y-4"
                    >
                        <label className="block text-sm text-slate-700">
                            Usuario
                            <input
                                {...form.register('username')}
                                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
                            />
                            {form.formState.errors.username && (
                                <span className="text-sm text-rose-600">{form.formState.errors.username.message}</span>
                            )}
                        </label>

                        <label className="block text-sm text-slate-700">
                            Contraseña
                            <input
                                type="password"
                                {...form.register('password')}
                                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
                            />
                            {form.formState.errors.password && (
                                <span className="text-sm text-rose-600">{form.formState.errors.password.message}</span>
                            )}
                        </label>

                        <label className="block text-sm text-slate-700">
                            Rol
                            <select
                                {...form.register('rol')}
                                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-sky-400"
                            >
                                <option value="ADMIN">ADMIN</option>
                                <option value="EDITOR">EDITOR</option>
                                <option value="LECTOR">LECTOR</option>
                            </select>
                        </label>

                        <button type="submit" className="rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-500">
                            Crear usuario
                        </button>

                        {statusMessage && <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{statusMessage}</div>}
                        {errorMessage && <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-800">{errorMessage}</div>}
                    </form>
                </section>

                <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                    <h2 className="mb-4 text-xl font-semibold text-slate-900">Usuarios existentes</h2>
                    {usuariosSistemaQuery.isLoading ? (
                        <div>Cargando usuarios...</div>
                    ) : usuariosSistemaQuery.isError ? (
                        <div className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">Error al cargar usuarios del sistema.</div>
                    ) : (
                        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                                <thead className="bg-slate-50 text-slate-600">
                                    <tr>
                                        <th className="px-4 py-4 font-semibold">Usuario</th>
                                        <th className="px-4 py-4 font-semibold">Rol</th>
                                        <th className="px-4 py-4 font-semibold">Activo</th>
                                        <th className="px-4 py-4 font-semibold">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 bg-white">
                                    {usuariosSistemaQuery.data?.map((user) => (
                                        <tr key={user.id} className="hover:bg-slate-50">
                                            <td className="px-4 py-4 text-slate-900">{user.username}</td>
                                            <td className="px-4 py-4 text-slate-700">{user.rol}</td>
                                            <td className="px-4 py-4 text-slate-700">{user.activo ? 'Sí' : 'No'}</td>
                                            <td className="px-4 py-4 text-slate-700">
                                                {user.activo ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => desactivarMutation.mutateAsync(user.id)}
                                                        className="rounded-2xl bg-rose-500 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-400"
                                                    >
                                                        Desactivar
                                                    </button>
                                                ) : (
                                                    <span className="text-xs text-slate-500">Inactivo</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>
        </div>
    )
}
