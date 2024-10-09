document.addEventListener('DOMContentLoaded', function () {
  const productForm = document.getElementById('product-form');
  const sellForm = document.getElementById('sell-form');
  const inventoryTableBody = document.getElementById('inventory-table').querySelector('tbody');
  const totalProductsElem = document.getElementById('total-products');
  const totalAppliancesElem = document.getElementById('total-appliances');
  const totalJewelryElem = document.getElementById('total-jewelry');
  const totalClothingElem = document.getElementById('total-clothing');

  let products = JSON.parse(localStorage.getItem('products')) || [];

  function saveProducts() {
      localStorage.setItem('products', JSON.stringify(products));
  }

  function calculateTotals() {
      let totalProducts = 0;
      let totalAppliances = 0;
      let totalJewelry = 0;
      let totalClothing = 0;

      products.forEach(product => {
          totalProducts += product.quantity;
          if (product.category === 'Electrodomésticos') {
              totalAppliances += product.quantity;
          } else if (product.category === 'Joyas') {
              totalJewelry += product.quantity;
          } else if (product.category === 'Ropa') {
              totalClothing += product.quantity;
          }
      });

      totalProductsElem.textContent = totalProducts;
      totalAppliancesElem.textContent = totalAppliances;
      totalJewelryElem.textContent = totalJewelry;
      totalClothingElem.textContent = totalClothing;
  }

  function renderProducts() {
      inventoryTableBody.innerHTML = '';
      products.forEach((product, index) => {
          const row = document.createElement('tr');
          row.innerHTML = `
              <td>${product.category}</td>
              <td>${product.description}</td>
              <td>${product.price.toFixed(2)}</td>
              <td>${product.quantity}</td>
              <td class="actions">
                  <button class="edit" onclick="editProduct(${index})">Editar</button>
                  <button class="delete" onclick="deleteProduct(${index})">Eliminar</button>
              </td>
          `;
          inventoryTableBody.appendChild(row);
      });

      calculateTotals();
  }

  window.editProduct = function (index) {
      const product = products[index];
      document.getElementById('product-id').value = index;
      document.getElementById('category').value = product.category;
      document.getElementById('description').value = product.description;
      document.getElementById('price').value = product.price;
      document.getElementById('quantity').value = product.quantity;
  };

  window.deleteProduct = function (index) {
      products.splice(index, 1);
      saveProducts();
      renderProducts();
  };

  productForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const id = document.getElementById('product-id').value;
      const category = document.getElementById('category').value;
      const description = document.getElementById('description').value;
      const price = parseFloat(document.getElementById('price').value);
      const quantity = parseInt(document.getElementById('quantity').value);

      if (id) {
          const product = products[id];
          product.category = category;
          product.description = description;
          product.price = price;
          product.quantity = quantity;
      } else {
          const existingProduct = products.find(product => product.category === category && product.description === description);
          if (existingProduct) {
              existingProduct.quantity += quantity;
          } else {
              products.push({ category, description, price, quantity });
          }
      }

      saveProducts();
      renderProducts();
      productForm.reset();
      document.getElementById('product-id').value = '';
  });

  sellForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const category = document.getElementById('sell-category').value;
      const description = document.getElementById('sell-description').value;
      const quantity = parseInt(document.getElementById('sell-quantity').value);

      const product = products.find(product => product.category === category && product.description === description);

      if (product && product.quantity >= quantity) {
          product.quantity -= quantity;
          saveProducts();
          renderProducts();
          alert('Venta realizada con éxito!');
      } else if (product) {
          alert('No se puede manejar saldos negativos');
      } else {
          alert('Producto no encontrado.');
      }

      sellForm.reset();
  });

  renderProducts();
});

