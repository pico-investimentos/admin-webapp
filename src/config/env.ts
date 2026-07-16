const DEFAULT_API_URL = 'http://localhost:3000'

function parseUrl(value: string | undefined, fallback: string) {
  const candidate = value?.trim() || fallback

  try {
    return new URL(candidate).toString().replace(/\/$/, '')
  } catch {
    throw new Error('VITE_API_URL precisa ser uma URL absoluta válida.')
  }
}

export const env = Object.freeze({
  apiUrl: parseUrl(import.meta.env.VITE_API_URL, DEFAULT_API_URL),
})
