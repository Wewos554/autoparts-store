// Проверка авторизации – если нет токена, кидаем на логин
if (!isAuthenticated()) {
  window.location.href = '/auth/login';
}

// Загрузка информации о пользователе
async function loadUserInfo() {
  try {
    const user = await apiRequest('/auth/me');
    document.getElementById('userInfo').innerHTML = `
      <p><strong>Имя:</strong> ${user.name}</p>
      <p><strong>Email:</strong> ${user.email}</p>
    `;
  } catch (err) {
    console.error(err);
  }
}

// Загрузка всех товаров
async function loadItems() {
  try {
    const items = await apiRequest('/items');
    renderItems(items);
  } catch (err) {
    console.error(err);
  }
}

// Отображение товаров с кнопками редактирования/удаления
function renderItems(items) {
  const container = document.getElementById('itemsList');
  if (!container) return;
if (items.length === 0) {
  container.innerHTML = '<p>Нет добавленных товаров. Создайте первый!</p>';
  return;
}
  if (!container) return;
  container.innerHTML = '';
  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h3>${item.name}</h3>
      <p><strong>Бренд:</strong> ${item.brand}</p>
      <p><strong>Категория:</strong> ${item.category}</p>
      <p><strong>Цена:</strong> ${item.price} ₽</p>
      <p><strong>На складе:</strong> ${item.stock}</p>
      <button data-id="${item._id}" class="editBtn">Редактировать</button>
      <button data-id="${item._id}" class="deleteBtn">Удалить</button>
    `;
    container.appendChild(card);
  });

  // Навесить обработчики на кнопки удаления
  document.querySelectorAll('.deleteBtn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      if (confirm('Удалить товар?')) {
        await apiRequest(`/items/${id}`, { method: 'DELETE' });
        loadItems(); // обновить список
      }
    });
  });

  // Обработчики на редактирование (упрощённо: через prompt)
  document.querySelectorAll('.editBtn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      const newPrice = prompt('Введите новую цену:');
      if (newPrice !== null) {
        await apiRequest(`/items/${id}`, {
          method: 'PUT',
          body: JSON.stringify({ price: Number(newPrice) })
        });
        loadItems();
      }
    });
  });
}

// Добавление нового товара
const itemForm = document.getElementById('itemForm');
if (itemForm) {
  itemForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newItem = {
      name: document.getElementById('itemName').value,
      brand: document.getElementById('itemBrand').value,
      category: document.getElementById('itemCategory').value,
      price: Number(document.getElementById('itemPrice').value),
      stock: Number(document.getElementById('itemStock').value) || 0,
      imageUrl: document.getElementById('itemImage').value
    };
    try {
      await apiRequest('/items', { method: 'POST', body: JSON.stringify(newItem) });
      itemForm.reset();
      loadItems();
    } catch (err) {
      alert('Ошибка: ' + err.message);
    }
  });
}

// Выход из системы
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    if (confirm('Вы уверены, что хотите выйти?')) {
      removeToken();
      window.location.href = '/auth/login';
    }
  });
}

// Загрузка данных при старте
loadUserInfo();
loadItems();