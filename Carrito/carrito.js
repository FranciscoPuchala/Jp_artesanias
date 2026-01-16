// JP Artesanías - Finalizar Compra Logic
document.addEventListener('DOMContentLoaded', () => {
    loadOrderSummary();
    updateHeaderCartCount();
    setupFormSubmit();
    initMobileMenu();
    handleScroll();
});

// Cargar resumen del pedido desde localStorage
const loadOrderSummary = () => {
    const orderItemsContainer = document.getElementById('order-items');
    const subtotalElement = document.getElementById('subtotal-price');
    const totalElement = document.getElementById('total-price');
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        orderItemsContainer.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; color: #666;">
                <p>Tu carrito está vacío</p>
                <a href="../Productos/Productos.html" style="color: #5dade2; text-decoration: none; font-weight: 600;">
                    Ir a la tienda
                </a>
            </div>
        `;
        subtotalElement.textContent = '$0';
        totalElement.textContent = '$0';
        return;
    }

    let subtotal = 0;
    orderItemsContainer.innerHTML = '';

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        
        orderItem.innerHTML = `
            <img src="${item.image || '../Img/placeholder.jpg'}" alt="${item.name}" class="order-item-img">
            <div class="order-item-info">
                <h4 class="order-item-name">${item.name}</h4>
                <div class="order-item-details">
                    <span>Cantidad: ${item.quantity}</span>
                    <span class="order-item-price">$${itemTotal.toLocaleString()}</span>
                </div>
            </div>
        `;
        orderItemsContainer.appendChild(orderItem);
    });

    subtotalElement.textContent = `$${subtotal.toLocaleString()}`;
    totalElement.textContent = `$${subtotal.toLocaleString()}`;
};

// Actualizar contador del carrito en el header
const updateHeaderCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, p) => sum + p.quantity, 0);
    const countBadge = document.querySelector('.cart-count');
    if (countBadge) {
        countBadge.textContent = totalItems;
    }
};

// Configurar envío del formulario
const setupFormSubmit = () => {
    const form = document.getElementById('checkout-form');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Validar que haya productos en el carrito
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            if (cart.length === 0) {
                showNotification('Tu carrito está vacío', 'error');
                return;
            }

            // Recopilar datos del formulario
            const formData = {
                // Información Personal
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                
                // Dirección
                address: document.getElementById('address').value,
                city: document.getElementById('city').value,
                postal: document.getElementById('postal').value,
                department: document.getElementById('department').value,
                
                // Método de Pago
                payment: document.querySelector('input[name="payment"]:checked').value,
                
                // Notas
                notes: document.getElementById('notes').value,
                
                // Productos
                items: cart,
                
                // Total
                total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                
                // Fecha
                date: new Date().toISOString()
            };

            console.log('Datos del pedido:', formData);

            // Simular envío (aquí iría la llamada a tu backend)
            const submitBtn = document.querySelector('.submit-order-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Procesando... ⏳';
            submitBtn.disabled = true;

            try {
                // Simular delay de procesamiento
                await new Promise(resolve => setTimeout(resolve, 2000));

                // Guardar pedido en localStorage (temporal)
                const orders = JSON.parse(localStorage.getItem('orders')) || [];
                orders.push(formData);
                localStorage.setItem('orders', JSON.stringify(orders));

                // Limpiar carrito
                localStorage.removeItem('cart');
                updateHeaderCartCount();

                // Mostrar éxito
                showSuccessModal(formData);

            } catch (error) {
                console.error('Error al procesar el pedido:', error);
                showNotification('Error al procesar el pedido. Intenta nuevamente.', 'error');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
};

// Mostrar modal de éxito
const showSuccessModal = (orderData) => {
    const modal = document.createElement('div');
    modal.className = 'success-modal';
    modal.innerHTML = `
        <div class="success-modal-content">
            <div class="success-icon">✓</div>
            <h2>¡Pedido Confirmado!</h2>
            <p>Gracias por tu compra, <strong>${orderData.name}</strong></p>
            <div class="order-details">
                <p>Hemos enviado un email de confirmación a:</p>
                <p style="color: #5dade2; font-weight: 600;">${orderData.email}</p>
                <div class="order-summary-box">
                    <p><strong>Total:</strong> $${orderData.total.toLocaleString()}</p>
                    <p><strong>Método de pago:</strong> ${getPaymentMethodName(orderData.payment)}</p>
                    <p><strong>Envío a:</strong> ${orderData.city}, ${orderData.department}</p>
                </div>
            </div>
            <div class="modal-actions">
                <a href="../index.html" class="btn-primary">Volver al Inicio</a>
                <a href="../Productos/Productos.html" class="btn-secondary">Seguir Comprando</a>
            </div>
        </div>
    `;

    // Agregar estilos del modal
    const style = document.createElement('style');
    style.textContent = `
        .success-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        }

        .success-modal-content {
            background: white;
            padding: 50px;
            border-radius: 24px;
            max-width: 500px;
            text-align: center;
            animation: scaleIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .success-icon {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #5dade2 0%, #3498db 100%);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 3em;
            margin: 0 auto 30px auto;
            animation: bounce 0.6s ease;
        }

        .success-modal-content h2 {
            font-size: 2em;
            margin: 0 0 15px 0;
            color: #1a1a1a;
        }

        .success-modal-content p {
            margin: 10px 0;
            color: #666;
            font-size: 1.1em;
        }

        .order-details {
            margin: 30px 0;
        }

        .order-summary-box {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 12px;
            margin-top: 20px;
        }

        .order-summary-box p {
            margin: 8px 0;
            color: #1a1a1a;
        }

        .modal-actions {
            display: flex;
            gap: 15px;
            margin-top: 30px;
        }

        .btn-primary, .btn-secondary {
            flex: 1;
            padding: 15px 25px;
            border-radius: 10px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
            display: inline-block;
        }

        .btn-primary {
            background: linear-gradient(135deg, #5dade2 0%, #3498db 100%);
            color: white;
        }

        .btn-primary:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(93, 173, 226, 0.4);
        }

        .btn-secondary {
            background: #f8f9fa;
            color: #1a1a1a;
            border: 2px solid #e0e0e0;
        }

        .btn-secondary:hover {
            background: white;
            transform: translateY(-3px);
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes scaleIn {
            from { transform: scale(0.8); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }

        @keyframes bounce {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(modal);
};

// Obtener nombre del método de pago
const getPaymentMethodName = (method) => {
    const methods = {
        'mercadopago': 'MercadoPago',
        'transferencia': 'Transferencia Bancaria',
        'efectivo': 'Efectivo'
    };
    return methods[method] || method;
};

// Mostrar notificación
const showNotification = (message, type = 'success') => {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #5dade2 0%, #3498db 100%)' : 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)'};
        color: white;
        padding: 20px 30px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        font-weight: 600;
        animation: slideInRight 0.4s ease;
        font-size: 1em;
        letter-spacing: 0.5px;
    `;
    notification.textContent = message;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.4s ease';
        setTimeout(() => notification.remove(), 400);
    }, 3000);
};

// Menú hamburguesa para móvil
const initMobileMenu = () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            nav.classList.toggle('active');
        });
    }
};

// Efecto de scroll en el header
const handleScroll = () => {
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
};

// Actualizar carrito si se modifica desde otra pestaña
window.addEventListener('storage', (e) => {
    if (e.key === 'cart') {
        loadOrderSummary();
        updateHeaderCartCount();
    }
});