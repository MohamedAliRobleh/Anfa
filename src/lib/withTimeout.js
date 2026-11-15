// Guards a promise-based call (e.g. a Supabase query) so a slow or hanging
// network — an outage, a misconfigured project, a sandboxed/offline
// environment — can never block the site. Resolves/rejects with whichever
// settles first.
export function withTimeout(promise, ms = 5000) {
  let timer
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('Request timed out')), ms)
  })
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer))
}
