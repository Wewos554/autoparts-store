async function loadFavorites() {
  const container = document.getElementById('favoritesList');
  const spinner = document.getElementById('loadingSpinner');
  
  spinner.style.display = 'block';
  try {
    const items = await apiRequest('/favorites');
    spinner.style.display = 'none';
    
    if (items.length === 0) {
      container.innerHTML = '<p>У вас пока нет избранных товаров. <a href="/">Перейти в каталог</a></p>';
      return;
    }
    
    container.innerHTML = items.map(item => `
      <div class="card">
        <h3>${item.name}</h3>
        <p><strong>Бренд:</strong> ${item.brand}</p>
        <p><strong>Категория:</strong> ${item.category}</p>
        <p><strong>Цена:</strong> ${item.price} ₽</p>
        <button data-id="${item._id}" class="remove-favorite-btn">❌ Удалить из избранного</button>
      </div>
    `).join('');
    
    // Обработчики удаления
    document.querySelectorAll('.remove-favorite-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        await apiRequest(`/favorites/${id}`, { method: 'DELETE' });
        loadFavorites(); // обновить список
      });
    });
  } catch (err) {
    spinner.style.display = 'none';
    container.innerHTML = '<p class="error">Ошибка загрузки избранного</p>';
  }
}

loadFavorites();
