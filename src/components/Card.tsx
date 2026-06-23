export function Card({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">{title}</h2>
            <div>{children}</div>
        </div>
    )
}
