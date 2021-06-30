export function isOnAccessPage(): boolean {
    const url = window.location.pathname
    if (url === '/dashboard') return true
    if (url.startsWith('/d/')) return true
    return false
}