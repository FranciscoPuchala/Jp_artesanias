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

// Animaciones de aparición con Intersection Observer
const observeElements = () => {
    const elements = document.querySelectorAll('[data-aos]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-aos-delay') || 0;
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
};

// Animación de las tarjetas de información
const animateInfoCards = () => {
    const cards = document.querySelectorAll('.info-card');
    
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        
        // Efecto de brillo al pasar el mouse
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
};

// Validación del formulario y animaciones
const initContactForm = () => {
    const form = document.getElementById('contact-form');
    const inputs = form.querySelectorAll('.form-input');
    
    // Añadir efectos a los inputs
    inputs.forEach(input => {
        // Animación al enfocar
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
            
            // Efecto de onda
            const ripple = document.createElement('span');
            ripple.classList.add('input-ripple');
            this.parentElement.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
        
        // Validación en tiempo real
        input.addEventListener('input', function() {
            validateInput(this);
        });
    });
    
    // Manejo del envío del formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar todos los campos
        let isValid = true;
        inputs.forEach(input => {
            if (!validateInput(input)) {
                isValid = false;
            }
        });
        
        if (isValid) {
            // Mostrar animación de carga en el botón
            const submitBtn = form.querySelector('.submit-btn');
            const originalHTML = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <span class="btn-text">Enviando...</span>
                <span class="btn-icon spinner">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10" opacity="0.25"/>
                        <path d="M12 2a10 10 0 0 1 10 10" opacity="0.75"/>
                    </svg>
                </span>
            `;
            
            // Añadir animación de rotación al spinner
            const spinner = submitBtn.querySelector('.spinner svg');
            spinner.style.animation = 'spin 1s linear infinite';
            
            // Simular envío del formulario
            setTimeout(() => {
                // Ocultar formulario y mostrar mensaje de éxito
                form.style.opacity = '0';
                form.style.transform = 'translateY(-20px)';
                
                setTimeout(() => {
                    form.style.display = 'none';
                    const successMessage = document.getElementById('form-success-message');
                    successMessage.style.display = 'block';
                    
                    // Guardar datos del formulario en localStorage
                    const formData = {
                        name: form.name.value,
                        email: form.email.value,
                        phone: form.phone.value,
                        subject: form.subject.value,
                        message: form.message.value,
                        timestamp: new Date().toISOString()
                    };
                    
                    const submissions = JSON.parse(localStorage.getItem('contactSubmissions')) || [];
                    submissions.push(formData);
                    localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
                    
                    // Resetear formulario después de 3 segundos
                    setTimeout(() => {
                        form.reset();
                        form.style.display = 'block';
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalHTML;
                        
                        setTimeout(() => {
                            form.style.opacity = '1';
                            form.style.transform = 'translateY(0)';
                            successMessage.style.display = 'none';
                        }, 100);
                    }, 3000);
                }, 300);
            }, 2000);
        } else {
            // Shake effect si hay errores
            form.classList.add('shake');
            setTimeout(() => {
                form.classList.remove('shake');
            }, 500);
        }
    });
};

// Función de validación de inputs
const validateInput = (input) => {
    const value = input.value.trim();
    const type = input.type;
    const name = input.name;
    
    let isValid = true;
    let errorMessage = '';
    
    // Validaciones según el tipo de campo
    if (input.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Este campo es requerido';
    } else if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Email inválido';
        }
    } else if (type === 'tel' && value) {
        const phoneRegex = /^[\d\s\+\-\(\)]+$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Teléfono inválido';
        }
    } else if (name === 'message' && value && value.length < 10) {
        isValid = false;
        errorMessage = 'El mensaje debe tener al menos 10 caracteres';
    }
    
    // Mostrar/ocultar mensaje de error
    const wrapper = input.parentElement;
    let errorElement = wrapper.querySelector('.error-message');
    
    if (!isValid) {
        input.classList.add('error');
        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.className = 'error-message';
            wrapper.appendChild(errorElement);
        }
        errorElement.textContent = errorMessage;
        errorElement.style.display = 'block';
    } else {
        input.classList.remove('error');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }
    
    return isValid;
};

// Animación de las redes sociales
const animateSocialLinks = () => {
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach((link, index) => {
        link.style.animationDelay = `${index * 0.1}s`;
        link.style.animation = 'socialBounce 0.6s ease both';
    });
};

// Efecto parallax suave en el hero
const initParallaxEffect = () => {
    const hero = document.querySelector('.hero-section');
    const heroContent = document.querySelector('.hero-content');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        if (scrolled < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
            heroContent.style.opacity = 1 - (scrolled / 500);
        }
    });
};

// Animación de contador para estadísticas (opcional)
const animateCounters = () => {
    const counters = document.querySelectorAll('[data-count]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(counter);
    });
};

// Añadir estilos CSS adicionales dinámicamente
const addDynamicStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }
        
        @keyframes socialBounce {
            0% { transform: scale(0) rotate(0deg); }
            50% { transform: scale(1.2) rotate(180deg); }
            100% { transform: scale(1) rotate(360deg); }
        }
        
        .form.shake {
            animation: shake 0.5s ease;
        }
        
        .error-message {
            color: #e74c3c;
            font-size: 0.85em;
            margin-top: 5px;
            display: block;
            animation: slideDown 0.3s ease;
        }
        
        .form-input.error {
            border-color: #e74c3c !important;
            animation: inputShake 0.3s ease;
        }
        
        @keyframes inputShake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
        
        .input-ripple {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(93, 173, 226, 0.3);
            transform: translate(-50%, -50%);
            animation: ripple 0.6s ease-out;
        }
        
        @keyframes ripple {
            to {
                width: 100%;
                height: 100%;
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
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

// Smooth scroll para enlaces internos
const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
};

// Inicializar todo cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    observeElements();
    animateInfoCards();
    initContactForm();
    animateSocialLinks();
    initParallaxEffect();
    animateCounters();
    addDynamicStyles();
    initMobileMenu();
    initSmoothScroll();
    
    // Listener para el scroll
    window.addEventListener('scroll', handleScroll);
});

// Actualizar carrito si se modifica desde otra pestaña
window.addEventListener('storage', (e) => {
    if (e.key === 'cart') {
        updateCartCount();
    }
});

// Animación al cargar la página
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});