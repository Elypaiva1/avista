// Produtos em Destaque
const featuredProducts = [
    {
        id: 1,
        name: "Mussarela Vitalac cx/6un",
        category: "Laticínios",
        price: 29.40,
        oldPrice: 32.90,
        image: "images/products/mussarela-vitalac.jpg",
        badge: "Novo"
    },
    {
        id: 2,
        name: "Queijo Coalho Seu Francisco",
        category: "Laticínios",
        price: 29.40,
        image: "images/products/queijo-coalho.jpg"
    },
    {
        id: 3,
        name: "Chester lanche PERDIGÃO pc/3,75kg",
        category: "Frios & Defumados",
        price: 16.99,
        oldPrice: 19.99,
        image: "images/products/chester.jpg",
        badge: "Promoção"
    },
    {
        id: 4,
        name: "Batata French Fries 10mm cx/10kg",
        category: "Congelados",
        price: 11.99,
        image: "images/products/batata-fries.jpg"
    }
];

// Carrinho de Compras
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Atualiza contador do carrinho
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = count;
    });
}

// Renderiza produtos em destaque
function renderFeaturedProducts() {
    const container = document.querySelector('.product-grid');
    if (!container) return;

    container.innerHTML = featuredProducts.map(product => `
        <div class="product-card" data-id="${product.id}" data-category="${product.category.replace('&', 'e')}">
            <div class="product-img">
                <img src="${product.image}" alt="${product.name}">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            </div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">
                    <span class="current-price">R$ ${product.price.toFixed(2)}</span>
                    ${product.oldPrice ? `<span class="old-price">R$ ${product.oldPrice.toFixed(2)}</span>` : ''}
                </div>
                <div class="product-actions">
                    <button class="add-to-cart">Adicionar</button>
                    <button class="wishlist"><i class="far fa-heart"></i></button>
                </div>
            </div>
        </div>
    `).join('');

    // Adiciona eventos aos botões
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.closest('.product-card').getAttribute('data-id'));
            const product = featuredProducts.find(p => p.id === productId);
            
            addToCart(product);
            
            // Animação de feedback
            this.textContent = 'Adicionado!';
            setTimeout(() => {
                this.textContent = 'Adicionar';
            }, 1000);
        });
    });
}

// Adiciona produto ao carrinho
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Filtro de produtos por categoria
function setupCategoryFilters() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove a classe active de todos os botões
            document.querySelectorAll('.tab-btn').forEach(b => {
                b.classList.remove('active');
            });
            
            // Adiciona a classe active ao botão clicado
            this.classList.add('active');
            
            // Filtra os produtos
            const category = this.getAttribute('data-category');
            const products = document.querySelectorAll('.product-card');
            
            products.forEach(product => {
                if (category === 'all' || product.getAttribute('data-category') === category) {
                    product.style.display = 'block';
                } else {
                    product.style.display = 'none';
                }
            });
        });
    });
}

// Newsletter
function setupNewsletter() {
    const form = document.querySelector('.newsletter-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input').value;
        
        if (email) {
            alert(`Obrigado por assinar nossa newsletter! Um e-mail foi enviado para ${email}`);
            this.querySelector('input').value = '';
        } else {
            alert('Por favor, insira um e-mail válido.');
        }
    });
}

// Barra de Pesquisa
function setupSearch() {
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');

    // Função para executar a busca
    function performSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        searchResults.innerHTML = '';

        if (!searchTerm) {
            searchResults.classList.remove('show');
            return;
        }

        // Filtra os produtos que correspondem à busca
        const results = featuredProducts.filter(product => 
            product.name.toLowerCase().includes(searchTerm) || 
            product.category.toLowerCase().includes(searchTerm)
        );

        if (results.length === 0) {
            searchResults.innerHTML = '<div class="no-results">Nenhum produto encontrado</div>';
        } else {
            results.forEach(product => {
                const resultItem = document.createElement('div');
                resultItem.className = 'result-item';
                resultItem.innerHTML = `
                    <a href="#" onclick="event.preventDefault(); scrollToProduct(${product.id})">
                        <img src="${product.image}" alt="${product.name}" width="40">
                        <div>
                            <strong>${product.name}</strong><br>
                            <span>R$ ${product.price.toFixed(2)}</span>
                        </div>
                    </a>
                `;
                searchResults.appendChild(resultItem);
            });
        }

        searchResults.classList.add('show');
    }

    // Função para rolar até o produto
    window.scrollToProduct = function(id) {
        const product = document.querySelector(`.product-card[data-id="${id}"]`);
        if (product) {
            product.scrollIntoView({ behavior: 'smooth' });
            product.classList.add('highlight');
            setTimeout(() => product.classList.remove('highlight'), 2000);
        }
        searchResults.classList.remove('show');
    };

    // Event listeners
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') performSearch();
    });

    // Fecha os resultados ao clicar fora
    document.addEventListener('click', function(e) {
        if (!e.target.closest('#searchResults, #searchInput, #searchButton')) {
            searchResults.classList.remove('show');
        }
    });
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    renderFeaturedProducts();
    setupCategoryFilters();
    setupNewsletter();
    setupSearch(); // Inicializa a barra de pesquisa
});