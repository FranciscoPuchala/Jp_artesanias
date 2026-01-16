// JP Artesanías - Carrito Logic
document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    updateHeaderCartCount();
    setupEventListeners();
});

const renderCart = () => {
    const cartContainer = document.getElementById('cart-container');
    const subtotalElement = document.getElementById('subtotal-price');
    const totalElement = document.getElementById('total-price');
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart-msg">
                <p>Tu carrito está vacío</p>
                <a href="../Productos/Productos.html" class="checkout-button">Ir a la tienda</a>
            </div>
        `;
        subtotalElement.textContent = '$0';
        totalElement.textContent = '$0';
        return;
    }

    let subtotal = 0;
    cartContainer.innerHTML = '';

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.setAttribute('data-id', item.id);
        
        cartItem.innerHTML = `
            <img src="${item.image || '../Img/placeholder.jpg'}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p class="cart-item-price">$${item.price.toLocaleString()}</p>
            </div>
            <div class="cart-item-controls">
                <div class="quantity-selector">
                    <button class="qty-btn minus" onclick="updateQuantity('${item.id}', -1)">−</button>
                    <input type="number" class="qty-input" value="${item.quantity}" readonly>
                    <button class="qty-btn plus" onclick="updateQuantity('${item.id}', 1)">+</button>
                </div>
                <button class="remove-item" onclick="removeItem('${item.id}')" title="Eliminar">
                    ✕
                </button>
            </div>
        `;
        cartContainer.appendChild(cartItem);
    });

    subtotalElement.textContent = `$${subtotal.toLocaleString()}`;
    totalElement.textContent = `$${subtotal.toLocaleString()}`;
};

// Actualizar cantidad con persistencia en LocalStorage
window.updateQuantity = (id, change) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = cart.find(p => p.id === id);

    if (product) {
        product.quantity += change;
        if (product.quantity <= 0) {
            removeItem(id);
            return;
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        updateHeaderCartCount();
    }
};

// Eliminar producto
window.removeItem = (id) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(p => p.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateHeaderCartCount();
};

// Actualizar el número en el header (burbuja azul)
const updateHeaderCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, p) => sum + p.quantity, 0);
    const countBadge = document.querySelector('.cart-count');
    if (countBadge) {
        countBadge.textContent = totalItems;
    }
};

// Configurar botones globales
const setupEventListeners = () => {
    // Botón de Checkout
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            if (cart.length > 0) {
                // Redirección profesional con pequeña demora para la animación
                checkoutBtn.textContent = "Procesando...";
                setTimeout(() => {
                    window.location.href = '../Finalizar_compra/Finalizar_compra.html';
                }, 800);
            } else {
                showToast("El carrito está vacío");
            }
        });
    }

    // Menú móvil (reutilizado de productos.js)
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.querySelector('nav');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            nav.classList.toggle('mobile-active');
        });
    }
};

// Notificación simple tipo Toast
const showToast = (message) => {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
        background: #333; color: white; padding: 12px 25px; border-radius: 50px;
        z-index: 9999; font-size: 0.9rem; box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
};