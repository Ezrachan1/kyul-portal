// Group Portal auth — backed by the server session (httpOnly cookie).
export function useAuth() {
  const user = useState('kyul-user', () => null)
  const ready = useState('kyul-auth-ready', () => false)

  async function fetchMe() {
    try {
      const { user: u } = await $fetch('/api/auth/me')
      user.value = u
    } catch {
      user.value = null
    }
    ready.value = true
    return user.value
  }

  async function login(email, password) {
    const { user: u } = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    })
    user.value = u
    ready.value = true
    return u
  }

  async function logout() {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
    } catch {
      /* ignore */
    }
    user.value = null
  }

  const isAuthed = computed(() => !!user.value)
  const role = computed(() => user.value?.role || null)
  const isSuper = computed(() => role.value === 'super-admin')

  // super-admin passes everything
  function can(roles) {
    const r = role.value
    if (!r) return false
    if (r === 'super-admin') return true
    if (!roles || !roles.length) return true
    return roles.includes(r)
  }

  return { user, ready, isAuthed, role, isSuper, can, fetchMe, login, logout }
}
