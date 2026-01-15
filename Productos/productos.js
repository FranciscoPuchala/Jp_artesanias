// Actualizar el contador del carrito
const updateCartCount = () => {
    const cartButton = document.querySelector('.cart-button');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, product) => sum + product.quantity, 0);
    
    const countElement = cartButton.querySelector('.cart-count');
    if (countElement) {
        countElement.textContent = totalItems;
    }
};

// Efecto de scroll en el header
const handleScroll = () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
};

// Animación de aparición para las tarjetas al hacer scroll
const observeCards = () => {
    const cards = document.querySelectorAll('.model-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    cards.forEach(card => {
        observer.observe(card);
    });
};

// Funcionalidad para los botones de selección de modelo
const initModelButtons = () => {
    const selectButtons = document.querySelectorAll('.select-model-btn');
    
    selectButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const modelType = button.getAttribute('data-model');
            
            // Guardar el modelo seleccionado en localStorage
            localStorage.setItem('selectedModel', modelType);
            
            // Animación de click
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = '';
            }, 150);
            
            // Aquí redirigirías a la página de personalización
            // window.location.href = `personalizar.html?modelo=${modelType}`;
            
            console.log(`Modelo seleccionado: ${modelType}`);
            
            // Feedback visual temporal
            showNotification(`Has seleccionado el modelo ${modelType.charAt(0).toUpperCase() + modelType.slice(1)}`);
        });
    });
    
    // También hacer clickeable toda la tarjeta
    const modelCards = document.querySelectorAll('.model-card');
    modelCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Si el click no fue en el botón, simular click en el botón
            if (!e.target.classList.contains('select-model-btn') && !e.target.classList.contains('btn-arrow')) {
                const button = card.querySelector('.select-model-btn');
                button.click();
            }
        });
    });
};

// Funcionalidad para los botones de selección de bombilla
const initBombillaButtons = () => {
    const selectButtons = document.querySelectorAll('.select-bombilla-btn');
    
    selectButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const bombillaType = button.getAttribute('data-bombilla');
            
            // Guardar la bombilla seleccionada en localStorage
            localStorage.setItem('selectedBombilla', bombillaType);
            
            // Animación de click
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = '';
            }, 150);
            
            // Aquí redirigirías a la página de personalización
            // window.location.href = `personalizar-bombilla.html?bombilla=${bombillaType}`;
            
            console.log(`Bombilla seleccionada: ${bombillaType}`);
            
            // Feedback visual temporal
            showNotification(`Has seleccionado la bombilla ${bombillaType.charAt(0).toUpperCase() + bombillaType.slice(1)}`);
        });
    });
    
    // También hacer clickeable toda la tarjeta
    const bombillaCards = document.querySelectorAll('.bombilla-card');
    bombillaCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Si el click no fue en el botón, simular click en el botón
            if (!e.target.classList.contains('select-bombilla-btn') && !e.target.classList.contains('btn-arrow')) {
                const button = card.querySelector('.select-bombilla-btn');
                button.click();
            }
        });
    });
};

// Función para mostrar notificaciones
const showNotification = (message) => {
    // Remover notificación anterior si existe
    const existingNotification = document.querySelector('.notification-toast');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'notification-toast';
    notification.textContent = message;
    
    // Estilos inline para la notificación
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        background: linear-gradient(135deg, #5dade2 0%, #3498db 100%);
        color: white;
        padding: 20px 30px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(93, 173, 226, 0.3);
        z-index: 10000;
        font-weight: 600;
        animation: slideInRight 0.4s ease, slideOutRight 0.4s ease 2.5s;
        font-size: 1em;
        letter-spacing: 0.5px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
};

// Agregar animaciones CSS dinámicamente
const addAnimationStyles = () => {
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
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
};

// Parallax desactivado
const initParallax = () => {
    // Función vacía - parallax desactivado
};

// Menú hamburguesa para móvil
const initMobileMenu = () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            nav.classList.toggle('mobile-active');
        });
    }
};

// Inicializar todo cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    observeCards();
    initModelButtons();
    initBombillaButtons();
    addAnimationStyles();
    initParallax();
    initMobileMenu();
    
    // Listener para el scroll
    window.addEventListener('scroll', handleScroll);
    
    // Smooth scroll para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Actualizar carrito si se modifica desde otra pestaña
window.addEventListener('storage', (e) => {
    if (e.key === 'cart') {
        updateCartCount();
    }
});