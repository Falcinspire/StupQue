export function getCurrentBrowserUrl() {
    const location = window.location;
    return `${location.protocol}//${location.host}${location.pathname}`;
}