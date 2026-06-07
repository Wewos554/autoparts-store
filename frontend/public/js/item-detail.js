// Получаем ID товара из URL (?id=...)
const urlParams = new URLSearchParams(window.location.search);
const itemId = urlParams.get('id');

async function loadItemDetail() {
  if (!itemId) {
    document.getElementById('itemDetail').innerHTML = '<p>Товар не найден</p>';
    return;
  }
  
  try {
    const item = await apiRequest(`/items/${itemId}`);
    document.getElementById('itemDetail').innerHTML = `
      <div class="card">
        <h1>${item.name}</h1>
        <p><strong>Бренд:</strong> ${item.brand}</p>
        <p><strong>Категория:</strong> ${item.category}</p>
        <p><strong>Цена:</strong> ${item.price} ₽</p>
        <p><strong>На складе:</strong> ${item.stock} шт.</p>
        ${item.imageUrl ? `<img src="${item.imageUrl}" style="max-width: 300px;">` : ''}
        <button id="addToCartBtn" style="margin-top: 20px;">🛒 Добавить в корзину</button>
      </div>
    `;
    
    document.getElementById('addToCartBtn')?.addEventListener('click', () => {
      alert('Товар добавлен в корзину (демо)');
    });
  } catch (err) {
    document.getElementById('itemDetail').innerHTML = '<p>Ошибка загрузки товара</p>';
  }
}

loadItemDetail();
