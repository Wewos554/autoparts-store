async function loadUserSettings() {
  try {
    const user = await apiRequest('/auth/me');
    document.getElementById('settingsName').value = user.name;
    document.getElementById('settingsEmail').value = user.email;
  } catch (err) {
    console.error(err);
  }
}

document.getElementById('settingsForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('settingsName').value;
  const email = document.getElementById('settingsEmail').value;
  const password = document.getElementById('settingsPassword').value;
  const errorDiv = document.getElementById('settingsError');
  
  // Клиентская валидация
  if (!name || !email) {
    errorDiv.textContent = 'Имя и email обязательны';
    return;
  }
  if (!email.includes('@')) {
    errorDiv.textContent = 'Некорректный email';
    return;
  }
  if (password && password.length < 6) {
    errorDiv.textContent = 'Пароль должен быть минимум 6 символов';
    return;
  }
  
  try {
    // Здесь будет запрос на обновление профиля
    // Пока просто показываем успех
    errorDiv.style.color = 'green';
    errorDiv.textContent = 'Настройки сохранены!';
    setTimeout(() => errorDiv.textContent = '', 3000);
  } catch (err) {
    errorDiv.style.color = 'red';
    errorDiv.textContent = err.message;
  }
});

loadUserSettings();
