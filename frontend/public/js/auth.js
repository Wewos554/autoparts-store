// Регистрация
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('errorMessage');

    if (!name || !email || !password) {
      errorDiv.textContent = 'Заполните все поля';
      return;
    }
    if (password.length < 6) {
      errorDiv.textContent = 'Пароль минимум 6 символов';
      return;
    }
    if (!email.includes('@')) {
      errorDiv.textContent = 'Введите корректный email';
      return;
    }

    try {
      console.log('Отправка регистрации...');
      const result = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password })
      });
      console.log('Регистрация успешна:', result);
      alert('Регистрация успешна! Теперь войдите.');
      window.location.href = '/auth/login';
    } catch (err) {
      console.error('Ошибка регистрации:', err);
      errorDiv.textContent = err.message;
    }
  });
}

// Логин
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('errorMessage');

    if (!email || !password) {
      errorDiv.textContent = 'Заполните все поля';
      return;
    }

    try {
      console.log('Отправка логина...');
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      console.log('Логин успешен:', data);
      setToken(data.token);
      localStorage.setItem('userName', data.user.name);
      alert('Вход выполнен!');
      window.location.href = '/profile';
    } catch (err) {
      console.error('Ошибка логина:', err);
      errorDiv.textContent = err.message;
    }
  });
}