export function NotFoundPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-16">
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                <h1 className="mb-4 text-3xl font-semibold text-slate-900">404</h1>
                <p className="mb-6 text-slate-600">La página que buscas no existe.</p>
                <a href="/" className="rounded-2xl bg-slate-900 px-5 py-3 text-white hover:bg-slate-800">Ir al inicio</a>
            </div>
        </div>
    )
}
