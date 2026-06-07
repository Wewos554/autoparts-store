// Защита приватных страниц
const privatePages = ['/profile', '/favorites', '/orders', '/settings'];
const currentPath = window.location.pathname;

if (privatePages.includes(currentPath) && !isAuthenticated()) {
  console.log('Доступ запрещён, редирект на логин');
  window.location.href = '/auth/login';
}
