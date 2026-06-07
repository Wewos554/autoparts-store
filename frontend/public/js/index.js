let allItems = [];
let displayedCount = 6;
let isLoading = false;

async function loadAllItems() {
  try {
    allItems = await apiRequest('/items');
    applyFiltersAndRender();
  } catch (err) {
    document.getElementById('itemsList').innerHTML = '<p class="error">Ошибка загрузки товаров</p>';
  }
}

function applyFiltersAndRender() {
  let filtered = [...allItems];
  
  // Поиск
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  if (searchTerm) {
    filtered = filtered.filter(item => 
      item.name.toLowerCase().includes(searchTerm) || 
      item.brand.toLowerCase().includes(searchTerm)
    );
  }
  
  // Фильтр по категории
  const category = document.getElementById('categoryFilter').value;
  if (category) {
    filtered = filtered.filter(item => item.category === category);
  }
  
  // Фильтр по цене
  const maxPrice = parseInt(document.getElementById('maxPrice').value);
  if (maxPrice) {
    filtered = filtered.filter(item => item.price <= maxPrice);
  }
  
  // Сортировка
  const sortBy = document.getElementById('sortBy').value;
  if (sortBy === 'priceAsc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'priceDesc') {
    filtered.sort((a, b) => b.price - a.price);
  } else {
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
  
  renderItems(filtered.slice(0, displayedCount));
  
  // Показать/скрыть кнопку "Загрузить ещё"
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  if (loadMoreBtn) {
    loadMoreBtn.style.display = filtered.length > displayedCount ? 'block' : 'none';
  }
}

function renderItems(items) {
  const container = document.getElementById('itemsList');
  if (!container) return;
  
  if (items.length === 0) {
    container.innerHTML = '<p>Товары не найдены</p>';
    return;
  }
  
  container.innerHTML = items.map(item => `
    <div class="card">
      <h3><a href="/item.html?id=${item._id}" style="text-decoration: none; color: inherit;">${item.name}</a></h3>
      <p><strong>Бренд:</strong> ${item.brand}</p>
      <p><strong>Категория:</strong> ${item.category}</p>
      <p><strong>Цена:</strong> ${item.price} ₽</p>
      <button data-id="${item._id}" class="favorite-btn">❤️ В избранное</button>
    </div>
  `).join('');
  
  // Обработчики для избранного
  document.querySelectorAll('.favorite-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      if (!isAuthenticated()) {
        alert('Войдите в аккаунт, чтобы добавить в избранное');
        window.location.href = '/auth/login';
        return;
      }
      try {
        await apiRequest('/favorites', { method: 'POST', body: JSON.stringify({ itemId: id }) });
        alert('Добавлено в избранное!');
      } catch (err) {
        alert(err.message);
      }
    });
  });
}

// Загрузить ещё
document.getElementById('loadMoreBtn')?.addEventListener('click', () => {
  displayedCount += 6;
  applyFiltersAndRender();
});

// Применить фильтры
document.getElementById('applyFiltersBtn')?.addEventListener('click', () => {
  displayedCount = 6;
  applyFiltersAndRender();
});

// Поиск по Enter
document.getElementById('searchInput')?.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    displayedCount = 6;
    applyFiltersAndRender();
  }
});

loadAllItems();
