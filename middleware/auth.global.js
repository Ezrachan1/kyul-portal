// Protects the Group Portal. The dashboard is client-rendered (ssr: false),
// so this runs on the client and checks the server session.
const ROUTE_ROLES = [
  { prefix: '/dashboard/system', roles: ['super-admin'] },
  { prefix: '/dashboard/users', roles: ['admin'] },
  { prefix: '/dashboard/settings', roles: ['admin'] },
  { prefix: '/dashboard/invoices', roles: ['admin', 'finance'] },
  { prefix: '/dashboard/portfolio', roles: ['admin', 'editor'] },
  { prefix: '/dashboard/news', roles: ['admin', 'editor'] },
  { prefix: '/dashboard/team', roles: ['admin', 'editor'] },
  { prefix: '/dashboard/documents', roles: ['admin', 'editor'] },
  { prefix: '/dashboard/data-room', roles: ['admin'] },
  { prefix: '/dashboard/inbox', roles: ['admin', 'editor'] },
]

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return
  if (!to.path.startsWith('/dashboard')) return
  if (to.path === '/dashboard/login') return

  const { user, ready, fetchMe, can } = useAuth()
  if (!ready.value) await fetchMe()

  if (!user.value) {
    return navigateTo({ path: '/dashboard/login', query: { redirect: to.fullPath } })
  }

  const rule = ROUTE_ROLES.find((r) => to.path.startsWith(r.prefix))
  if (rule && !can(rule.roles)) {
    return navigateTo('/dashboard')
  }
})
