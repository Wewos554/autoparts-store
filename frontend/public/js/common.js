const API_BASE = 'https://autoparts-store-production.up.railway.app/api';

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

function showError(message) {
  alert('❌ Ошибка: ' + message);
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
    const fullUrl = API_BASE + url;
    console.log('Запрос к:', fullUrl);
    
    const response = await fetch(fullUrl, {
      ...options,
      headers
    });

    console.log('Статус ответа:', response.status);

    if (response.status === 401) {
      removeToken();
      localStorage.removeItem('userName');
      if (!window.location.pathname.includes('/auth/login') && 
          !window.location.pathname.includes('/auth/register')) {
        showError('Сессия истекла. Пожалуйста, войдите снова.');
        window.location.href = '/auth/login';
      }
      throw new Error('Сессия истекла. Войдите снова.');
    }

    if (response.status === 404) {
      throw new Error('Запрашиваемые данные не найдены');
    }

    if (response.status === 500) {
      throw new Error('Ошибка сервера. Попробуйте позже.');
    }

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Ошибка запроса');
    }
    return data;
  } catch (err) {
    let errorMessage = err.message;
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      errorMessage = 'Нет соединения с сервером. Проверьте что бэкенд запущен: ' + API_BASE;
    }
    showError(errorMessage);
    throw new Error(errorMessage);
  } finally {
    hideSpinner();
  }
}
