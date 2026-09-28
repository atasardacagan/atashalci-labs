// First visits stay English. Only a saved, explicit choice redirects the root.
try {
  const paths = typeof document === 'undefined' ? {} : document.currentScript?.dataset || {};
  const english = paths.enPath || '/', turkish = paths.trPath || '/tr';
  if (location.pathname === english && localStorage.getItem('al.language') === 'tr') {
    location.replace(turkish + location.search + location.hash);
  }
} catch { /* Private or blocked storage keeps the URL's explicit language. */ }
