// Единая навигация для всех страниц
function updateNav() {
  const nav = document.getElementById('global-nav');
  if (!nav) return;
  
  const isAuth = isAuthenticated();
  
  if (isAuth) {
    // Получаем имя пользователя из localStorage (сохраняем при логине)
    const userName = localStorage.getItem('userName') || 'Пользователь';
    nav.innerHTML = `
      <a href="/">🏠 Главная</a>
      <a href="/about">📖 О нас</a>
      <a href="/contact">📞 Контакты</a>
      <a href="/favorites">❤️ Избранное</a>
      <a href="/orders">📦 Заказы</a>
      <a href="/profile">👤 Профиль</a>
      <a href="/settings">⚙️ Настройки</a>
      <span style="color: white; margin-left: 20px;">👋 ${userName}</span>
      <a href="#" id="logoutNavBtn" style="margin-left: 10px;">🚪 Выйти</a>
    `;
    const logoutBtn = document.getElementById('logoutNavBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        removeToken();
        localStorage.removeItem('userName');
        window.location.href = '/';
      });
    }
  } else {
    nav.innerHTML = `
      <a href="/">🏠 Главная</a>
      <a href="/about">📖 О нас</a>
      <a href="/contact">📞 Контакты</a>
      <a href="/auth/login">🔐 Войти</a>
      <a href="/auth/register">📝 Регистрация</a>
    `;
  }
}

// Вызываем при загрузке страницы
document.addEventListener('DOMContentLoaded', updateNav);
