function parseApiUrl(value: string | undefined): string {
  const candidate = value?.trim() ?? ''

  if (!candidate) {
    return ''
  }

  try {
    return new URL(candidate).toString().replace(/\/$/, '')
  } catch {
    throw new Error('VITE_API_URL precisa ser uma URL absoluta válida.')
  }
}

export const env = Object.freeze({
  apiUrl: parseApiUrl(import.meta.env.VITE_API_URL),
})
