export function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value)
}

export function formatDate(value: string) {
  return new Date(value).toLocaleDateString('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

export function formatDateTime(value: string) {
  return new Date(value).toLocaleString('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}
