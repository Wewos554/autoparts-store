const API_BASE = '/api';

function getToken() {
  return localStorage.getItem('token');
}

function setToken(token) {
  localStorage.setItem('token', token);
}

function removeToken() {
  localStorage.removeItem('token');
  localStorage.removeItem('userName');
}

function isAuthenticated() {
  return !!getToken();
}

function showSpinner() {
  let spinner = document.getElementById('globalSpinner');
  if (!spinner) {
    spinner = document.createElement('div');
    spinner.id = 'globalSpinner';
    spinner.className = 'global-spinner';
    spinner.innerHTML = '<div class="spinner"></div>';
    document.body.appendChild(spinner);
  }
  spinner.style.display = 'flex';
}

function hideSpinner() {
  const spinner = document.getElementById('globalSpinner');
  if (spinner) spinner.style.display = 'none';
}

async function apiRequest(url, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  showSpinner();
  try {
    const response = await fetch(API_BASE + url, {
      ...options,
      headers
    });

    // Обработка 401 (неавторизован)
    if (response.status === 401) {
      removeToken();
      localStorage.removeItem('userName');
      if (!window.location.pathname.includes('/auth/login') && 
          !window.location.pathname.includes('/auth/register')) {
        alert('Сессия истекла. Пожалуйста, войдите снова.');
        window.location.href = '/auth/login';
      }
      throw new Error('Сессия истекла. Войдите снова.');
    }

    // Обработка 404
    if (response.status === 404) {
      throw new Error('Запрашиваемые данные не найдены');
    }

    // Обработка 500
    if (response.status === 500) {
      throw new Error('Ошибка сервера. Попробуйте позже.');
    }

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Ошибка запроса');
    }
    return data;
  } catch (err) {
    // Показываем понятное сообщение пользователю
    let errorMessage = err.message;
    
    // Обработка ошибок сети (нет соединения)
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      errorMessage = '❌ Нет соединения с сервером. Проверьте интернет и попробуйте снова.';
    }
    
    // Обработка ошибок парсинга JSON
    if (err.message === 'Unexpected end of JSON input') {
      errorMessage = '❌ Ошибка получения данных от сервера.';
    }
    
    throw new Error(errorMessage);
  } finally {
    hideSpinner();
  }
}