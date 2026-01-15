// Archivo: pagina_inicio.js
// Este script maneja la lógica de añadir productos al carrito desde la página de inicio, 
// asegurando que se guarden todos los datos necesarios, incluyendo la imagen, para el carrito.

// Mapeo de IDs de producto a sus URLs de imagen.
// Estos paths son CRÍTICOS para que las imágenes se muestren correctamente en el carrito.
const productImageMap = {
    '1': '../img/mate-imperial.jpg',
    '2': '../img/mate-torpedo.jpg',
    '3': '../img/mate-camionero.jpg',
    '4': '../img/bombilla-personalizada.jpg',
    '5': '../img/termo-premium.jpg'
};

// Función para mostrar una notificación temporal al usuario.
const showNotification = (message) => {
    // Intenta encontrar un contenedor de notificación existente o crea uno
    let notification = document.getElementById('cart-notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'cart-notification';
        // Añadir estilos básicos con color azul agua y posición abajo a la derecha
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #5dade2;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            z-index: 1000;
            opacity: 0;
            transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            transform: translateY(100px) scale(0.9);
            box-shadow: 0 8px 25px rgba(93, 173, 226, 0.4);
            font-weight: 500;
            font-size: 0.95em;
            backdrop-filter: blur(10px);
        `;
        document.body.appendChild(notification);
    }
    
    // Actualizar mensaje y mostrar con animación suave
    notification.textContent = message;
    
    // Pequeño delay para asegurar que la transición se aplique
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0) scale(1)';
    }, 10);

    // Ocultar la notificación después de 3 segundos con animación suave
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(30px) scale(0.95)';
    }, 3000);
};

// Función para actualizar el contador del carrito en el encabezado.
const updateCartCount = () => {
    // Intenta obtener el carrito. Si no existe, usa un array vacío.
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, product) => sum + product.quantity, 0);
    const cartButton = document.querySelector('.cart-button');

    if (cartButton) {
        cartButton.textContent = `🛒 Carrito (${totalItems})`;
    }
    return totalItems; // Retorna el total por si acaso
};

// Función para añadir un producto al carrito en localStorage
// Se añade 'imageURL' como nuevo parámetro.
const addToCart = (productId, name, price, imageURL) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const productIndex = cart.findIndex(item => item.id === productId);

    if (productIndex > -1) {
        // El producto ya está en el carrito, incrementa la cantidad
        cart[productIndex].quantity += 1;
    } else {
        // El producto es nuevo, añádelo
        const newProduct = {
            id: productId,
            name: name,
            price: price, 
            image: imageURL, // CRÍTICO: Guardamos la URL de la imagen
            quantity: 1,
        };
        cart.push(newProduct);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount(); // Actualiza el contador visible
    // Muestra la notificación al usuario
    showNotification(`✅ "${name}" añadido al carrito.`); 
    console.log(`Producto añadido: ${name} (ID: ${productId}, Imagen: ${imageURL})`);
};


// Inicializa los listeners de los botones "Añadir al carrito" y los productos
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount(); // Inicializa el contador al cargar la página

    // 1. Manejar clics en los botones "Añadir al carrito"
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault(); // Detiene la navegación del enlace

            const productCard = event.target.closest('.product-card');

            if (productCard) {
                // Captura los datos CRÍTICOS para el servidor
                const productId = productCard.getAttribute('data-id');
                const productName = productCard.querySelector('h3').textContent.trim();
                
                // Limpia y convierte el precio a un número decimal (CRÍTICO)
                const priceElement = productCard.querySelector('.price').textContent.trim();
                const productPrice = parseFloat(priceElement.replace('$', '').replace('.', ''));
                
                // CRÍTICO: Obtiene la URL de la imagen del mapa
                const productImage = productImageMap[productId];


                if (productId && productName && !isNaN(productPrice) && productImage) {
                    // Llama a addToCart incluyendo la URL de la imagen
                    addToCart(productId, productName, productPrice, productImage);
                } else {
                    console.error('Error al capturar datos del producto para el carrito:', { productId, productName, productPrice, productImage });
                }
            }
        });
    });

    // 2. Manejar clics en las tarjetas de producto (para mantener la función de redirección a la página de detalle)
    document.querySelectorAll('.product-card').forEach(card => {
        // Excluimos el botón "Añadir al carrito" para que no dispare la redirección
        const addToCartButton = card.querySelector('.add-to-cart');
        if (addToCartButton) {
            // Aseguramos que el clic en la tarjeta solo redirija si no es el botón de añadir al carrito
            card.addEventListener('click', (event) => {
                if (event.target !== addToCartButton) {
                    const productId = card.getAttribute('data-id');
                    const productName = card.querySelector('h3').textContent.trim();
                    const priceElement = card.querySelector('.price').textContent.trim();
                    const productPrice = parseFloat(priceElement.replace('$', ''));
                    const productImage = productImageMap[productId];

                    // Prepara y guarda la información del producto seleccionado
                    if (productId && productName && !isNaN(productPrice) && productImage) {
                        const selectedProduct = {
                            id: productId,
                            name: productName,
                            price: productPrice,
                            image: productImage,
                            // Descripción y características específicas de cada mate
                            description: getProductDescription(productId),
                            features: getProductFeatures(productId)
                        };
                        
                        localStorage.setItem('selectedProduct', JSON.stringify(selectedProduct));
                        // Redirige a la página de producto.
                        window.location.href = `./Producto/pagina_producto.html`;
                    } else {
                        console.error('Error al capturar datos para la redirección a la página de producto.');
                    }
                }
            });
        }
    });
});

// Función para obtener descripciones específicas de cada producto
function getProductDescription(productId) {
    const descriptions = {
        '1': 'Mate artesanal modelo Imperial de calabaza seleccionada, curado y listo para usar. Ideal para los verdaderos amantes del mate tradicional.',
        '2': 'Mate modelo Torpedo de calabaza premium, con diseño elegante y ergonómico. Perfecto para disfrutar de un mate suave y auténtico.',
        '3': 'Mate modelo Camionero de calabaza natural, el clásico de siempre. Resistente y práctico para llevar a todas partes.',
        '4': 'Bombilla personalizada de alpaca con grabado artesanal. Agrega tu nombre o diseño favorito.',
        '5': 'Termo premium de 1 litro con aislamiento térmico superior. Mantiene el agua caliente por más de 12 horas.'
    };
    return descriptions[productId] || 'Producto artesanal de calidad premium.';
}

// Función para obtener características específicas de cada producto
function getProductFeatures(productId) {
    const features = {
        '1': [
            'Calabaza seleccionada de primera calidad',
            'Curado artesanal tradicional',
            'Virola de alpaca resistente',
            'Capacidad: 250ml aprox.',
            'Incluye bombilla de regalo'
        ],
        '2': [
            'Diseño torpedo elegante',
            'Calabaza premium curada',
            'Base estable reforzada',
            'Ideal para yerba suave',
            'Acabado natural pulido'
        ],
        '3': [
            'Modelo tradicional camionero',
            'Calabaza resistente',
            'Fácil de limpiar',
            'Perfecto para viajes',
            'Virola cromada duradera'
        ],
        '4': [
            'Alpaca de primera calidad',
            'Grabado personalizado incluido',
            'Filtro de acero quirúrgico',
            'Pico recto o curvo a elección',
            'Resistente a la corrosión'
        ],
        '5': [
            'Capacidad 1 litro',
            'Aislamiento por 12+ horas',
            'Acero inoxidable',
            'Boca ancha fácil limpieza',
            'Tapa con pico vertedor'
        ]
    };
    return features[productId] || ['Producto de calidad artesanal', 'Hecho a mano', 'Garantía de satisfacción'];
}