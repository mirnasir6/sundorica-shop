document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION ---
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxPaNt_z0uRscltA5lyE_WTPogNs5d1mCqd7JDREyzJqUTHi0OPQlnh85f3ySpMTU4/exec';

    // --- STATE MANAGEMENT ---
    let allProducts = [];
    let cart = JSON.parse(localStorage.getItem('sundoricaCart')) || [];
    let deliveryCharges = [];

    // --- DOM ELEMENTS ---
    const loader = document.getElementById('loader');
    const productGrid = document.getElementById('product-grid');
    const themeToggle = document.getElementById('theme-toggle');
    const cartButton = document.getElementById('cart-button');
    const cartCount = document.getElementById('cart-count');
    const searchIconBtn = document.getElementById('search-icon-btn');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navMenuContainer = document.getElementById('nav-menu-container');
    const searchOverlay = document.getElementById('search-overlay');
    const searchOverlayInput = document.getElementById('search-overlay-input');
    const searchOverlayClose = document.getElementById('search-overlay-close');
    const productModal = document.getElementById('product-modal');
    const checkoutModal = document.getElementById('checkout-modal');
    const footer = document.getElementById('footer');

    // --- INITIALIZATION ---
    const init = async () => {
        showLoader();
        await Promise.all([fetchProducts(), fetchDeliveryCharges()]);
        applyTheme(localStorage.getItem('sundoricaTheme') || 'light');
        updateCartCount();
        setupEventListeners();
        hideLoader();
        showFooter();
        handleInitialProductView();
    };

    // --- DATA FETCHING ---
    const fetchProducts = async () => {
        try {
            const response = await fetch(`${SCRIPT_URL}?action=getProducts`);
            const result = await response.json();
            if (result.status === 'success') {
                allProducts = result.data.map(p => ({ ...p, isAvailable: isProductAvailable(p) }));
                renderProducts(allProducts);
            } else {
                showError('Failed to load products.');
            }
        } catch (error) {
            showError('Network error. Could not fetch products.');
        }
    };

    const fetchDeliveryCharges = async () => {
        try {
            const response = await fetch(`${SCRIPT_URL}?action=getDeliveryCharges`);
            const result = await response.json();
            if (result.status === 'success') {
                deliveryCharges = result.data;
            }
        } catch (error) {
            console.error('Could not fetch delivery charges:', error);
        }
    };
    
    // --- RENDERING ---
    const renderProducts = (products) => {
        productGrid.innerHTML = '';
        if (products.length === 0) {
            productGrid.innerHTML = '<p>No products found.</p>';
            return;
        }
        products.forEach(product => {
            const card = document.createElement('div');
            card.className = `product-card ${!product.isAvailable ? 'unavailable' : ''}`;
            card.dataset.sku = product.sku;

            card.innerHTML = `
                <div class="product-image-container">
                    <img src="${product.images[0] || 'https://via.placeholder.com/300x450'}" alt="${product.name}" class="product-image" loading="lazy">
                    ${!product.isAvailable ? '<div class="out-of-stock-overlay">Out of Stock</div>' : ''}
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-price">
                        ৳${product.price}
                        ${product.compareAtPrice ? `<span class="compare-price">৳${product.compareAtPrice}</span>` : ''}
                    </p>
                </div>
            `;
            if (product.isAvailable) {
                card.addEventListener('click', () => openProductModal(product.sku));
            }
            productGrid.appendChild(card);
        });
    };

    // --- EVENT LISTENERS ---
    const setupEventListeners = () => {
        themeToggle.addEventListener('click', toggleTheme);
        cartButton.addEventListener('click', openCheckoutModal);
        hamburgerBtn.addEventListener('click', toggleMobileMenu);
        searchIconBtn.addEventListener('click', openSearchOverlay);
        searchOverlayClose.addEventListener('click', closeSearchOverlay);
        searchOverlayInput.addEventListener('input', handleSearch);
        navMenuContainer.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', handleNavClick));
    };

    // --- UI/UX HANDLERS ---
    const showLoader = () => loader.classList.remove('hidden');
    const hideLoader = () => loader.classList.add('hidden');
    const showFooter = () => footer.style.display = 'block';

    const toggleTheme = () => {
        const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        applyTheme(currentTheme === 'light' ? 'dark' : 'light');
    };

    const applyTheme = (theme) => {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69a.75.75 0 0 1 .981.981A10.503 10.503 0 0 1 18 19.5a10.5 10.5 0 0 1-10.5-10.5c0-1.25.223-2.454.635-3.572a.75.75 0 0 1 .893-.162Z" clip-rule="evenodd" /></svg>';
        } else {
            document.body.classList.remove('dark-mode');
            themeToggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.106a.75.75 0 0 1 0 1.06l-1.591 1.59a.75.75 0 1 1-1.06-1.06l1.59-1.59a.75.75 0 0 1 1.061 0ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5h2.25a.75.75 0 0 1 .75.75ZM17.894 17.894a.75.75 0 0 1-1.06 0l-1.59-1.591a.75.75 0 1 1 1.06-1.06l1.591 1.59a.75.75 0 0 1 0 1.061ZM12 18a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.894 6.106a.75.75 0 0 1 1.06 0l-1.59 1.591a.75.75 0 1 1-1.06-1.06l1.59-1.59a.75.75 0 0 1 0-1.061ZM4.5 12a.75.75 0 0 1-.75.75H1.5a.75.75 0 0 1 0-1.5h2.25a.75.75 0 0 1 .75.75ZM6.106 17.894a.75.75 0 0 1 0-1.06l1.591-1.59a.75.75 0 1 1 1.06 1.06l-1.59 1.59a.75.75 0 0 1-1.061 0Z"/></svg>';
        }
        localStorage.setItem('sundoricaTheme', theme);
    };

    const handleSearch = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = allProducts.filter(p => p.name.toLowerCase().includes(searchTerm) || p.sku.toString().includes(searchTerm));
        renderProducts(filtered);
    };
    
    const toggleMobileMenu = () => navMenuContainer.classList.toggle('nav-active');
    const openSearchOverlay = () => {
        searchOverlay.classList.add('active');
        searchOverlayInput.focus();
    };
    const closeSearchOverlay = () => searchOverlay.classList.remove('active');

    const handleNavClick = (e) => {
        e.preventDefault();
        const category = e.target.dataset.category;
        
        navMenuContainer.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        e.target.classList.add('active');

        let filtered = allProducts;
        if (category !== 'All' && category !== 'Clothing') {
            filtered = allProducts.filter(p => p.category === category);
        }
        renderProducts(filtered);
        
        if (navMenuContainer.classList.contains('nav-active')) {
            navMenuContainer.classList.remove('nav-active');
        }
    };
    
    const showError = (message) => { alert(message); };
    
    // --- PRODUCT LOGIC ---
    const isProductAvailable = (product) => {
        if (product.sizes && product.sizes.length > 0) {
            return product.sizes.some(s => s.quantity > 0);
        } else {
            return product.availableStock > 0;
        }
    };
    
    const getProductBySku = (sku) => allProducts.find(p => p.sku == sku);

    const updateURLForProduct = (product) => {
        const url = new URL(window.location);
        url.searchParams.set('product', product.sku);
        history.pushState({}, product.name, url);
    };

    const handleInitialProductView = () => {
        const params = new URLSearchParams(window.location.search);
        const productSku = params.get('product');
        if (productSku) {
            const product = getProductBySku(productSku);
            if (product && product.isAvailable) {
                openProductModal(productSku);
            }
        }
    };

    // --- MODAL HANDLING ---
    const openProductModal = (sku) => {
        const product = getProductBySku(sku);
        if (!product) return;

        updateURLForProduct(product);

        const modalBody = document.getElementById('modal-body');
        const hasSizes = product.sizes && product.sizes.length > 0;
        
        modalBody.innerHTML = `
            <div class="modal-images">
                <img src="${product.images[0] || ''}" id="main-modal-image" class="main-image">
                <div class="thumbnail-images">
                    ${product.images.map((img, index) => `
                        <img src="${img}" class="thumbnail ${index === 0 ? 'active' : ''}" data-src="${img}">
                    `).join('')}
                </div>
            </div>
            <div class="modal-details">
                <h2>${product.name}</h2>
                <p class="product-price">
                    ৳${product.price}
                    ${product.compareAtPrice ? `<span class="compare-price">৳${product.compareAtPrice}</span>` : ''}
                </p>
                ${hasSizes ? `
                <div class="size-options">
                    <label>Select Size:</label>
                    <div id="size-buttons">
                        ${product.sizes.map(s => `
                            <button class="size-btn" data-size="${s.size}" ${s.quantity === 0 ? 'disabled' : ''}>${s.size}</button>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
                <div class="quantity-control">
                    <label>Quantity:</label>
                    <input type="number" id="quantity-input" value="1" min="1">
                </div>
                <div class="action-buttons">
                    <button id="add-to-cart-btn" class="btn btn-primary">Add to Cart</button>
                    <button id="buy-now-btn" class="btn btn-secondary">Buy It Now</button>
                </div>
            </div>
            <div class="product-description">
                <h3>Description</h3>
                <p>${product.description}</p>
            </div>
        `;

        productModal.style.display = 'block';

        productModal.querySelector('.close-button').onclick = closeProductModal;
        document.querySelectorAll('.thumbnail').forEach(thumb => {
            thumb.onclick = (e) => {
                document.getElementById('main-modal-image').src = e.target.dataset.src;
                document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
            };
        });
        
        if (hasSizes) {
            document.querySelectorAll('.size-btn').forEach(btn => {
                btn.onclick = () => {
                    document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                };
            });
        }
        
        document.getElementById('add-to-cart-btn').onclick = () => handleAddToCart(product);
        document.getElementById('buy-now-btn').onclick = () => handleBuyNow(product);
    };

    const closeProductModal = () => {
        productModal.style.display = 'none';
        const url = new URL(window.location);
        url.searchParams.delete('product');
        history.pushState({}, '', url);
    };

    // --- CART & CHECKOUT LOGIC ---
    const handleAddToCart = (product) => {
        const hasSizes = product.sizes && product.sizes.length > 0;
        const selectedSizeEl = document.querySelector('.size-btn.selected');
        const size = hasSizes ? selectedSizeEl?.dataset.size : null;
        
        if (hasSizes && !size) {
            showError('Please select a size.');
            return;
        }

        const quantity = parseInt(document.getElementById('quantity-input').value);
        addToCart({ ...product, size, quantity });
        closeProductModal();
        showError(`${product.name} added to cart!`);
    };
    
    const handleBuyNow = (product) => {
        const hasSizes = product.sizes && product.sizes.length > 0;
        const selectedSizeEl = document.querySelector('.size-btn.selected');
        const size = hasSizes ? selectedSizeEl?.dataset.size : null;
        
        if (hasSizes && !size) {
            showError('Please select a size.');
            return;
        }

        const quantity = parseInt(document.getElementById('quantity-input').value);
        addToCart({ ...product, size, quantity });
        closeProductModal();
        openCheckoutModal();
    };

    const addToCart = (item) => {
        const cartItem = {
            sku: item.sku,
            name: item.name,
            price: item.price,
            image: item.images[0],
            size: item.size,
            quantity: item.quantity
        };
        const existingItemIndex = cart.findIndex(i => i.sku === cartItem.sku && i.size === cartItem.size);
        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += cartItem.quantity;
        } else {
            cart.push(cartItem);
        }
        saveCart();
    };

    const saveCart = () => {
        localStorage.setItem('sundoricaCart', JSON.stringify(cart));
        updateCartCount();
    };

    const updateCartCount = () => {
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    };
    
    const openCheckoutModal = () => {
        const checkoutBody = document.getElementById('checkout-body');
        if (cart.length === 0) {
            checkoutBody.innerHTML = '<p>Your cart is empty.</p>';
            checkoutModal.style.display = 'block';
            document.getElementById('close-checkout').onclick = closeCheckoutModal;
            return;
        }
        
        const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
        const productPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        checkoutBody.innerHTML = `
            <div class="order-summary">
                <h4>Order Summary</h4>
                <div id="cart-items-summary">
                ${cart.map(item => `<p>${item.name} ${item.size ? `(${item.size})` : ''} x ${item.quantity} = ৳${item.price * item.quantity}</p>`).join('')}
                </div>
                <hr>
                <p><strong>Subtotal:</strong> <span id="subtotal">৳${productPrice}</span></p>
                <p><strong>Delivery Charge:</strong> <span id="delivery-charge-display">৳0</span></p>
                <p><strong>Total:</strong> <span id="total-amount-display">৳${productPrice}</span></p>
            </div>
            <form id="checkout-form">
                <div class="form-group"><label for="customer-name">Name</label><input type="text" id="customer-name" required></div>
                <div class="form-group"><label for="customer-phone">Phone</label><input type="tel" id="customer-phone" required pattern="[0-9]{11}" title="Please enter a valid 11-digit phone number."></div>
                <div class="form-group"><label for="customer-address">Address</label><textarea id="customer-address" rows="3" required></textarea></div>
                <div class="form-group"><label for="delivery-zone">Delivery Zone</label><select id="delivery-zone" required><option value="">-- Select Zone --</option>${deliveryCharges.map(d => `<option value="${d.charge}">${d.zone} - ৳${d.charge}</option>`).join('')}</select></div>
                <button type="submit" class="btn btn-secondary" style="width:100%;">Complete Order</button>
            </form>
        `;
        
        checkoutModal.style.display = 'block';
        document.getElementById('close-checkout').onclick = closeCheckoutModal;
        
        const zoneSelect = document.getElementById('delivery-zone');
        zoneSelect.onchange = () => {
            const charge = parseFloat(zoneSelect.value) || 0;
            document.getElementById('delivery-charge-display').textContent = `৳${charge}`;
            document.getElementById('total-amount-display').textContent = `৳${productPrice + charge}`;
        };
        
        document.getElementById('checkout-form').onsubmit = handleOrderSubmit;
    };
    
    const closeCheckoutModal = () => checkoutModal.style.display = 'none';
    
    const handleOrderSubmit = async (e) => {
        e.preventDefault();
        showLoader();
        
        const deliveryCharge = parseFloat(document.getElementById('delivery-zone').value);
        if (isNaN(deliveryCharge)) {
            showError('Please select a delivery zone.');
            hideLoader();
            return;
        }

        const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
        const productPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        const orderPayload = {
            customer: {
                name: document.getElementById('customer-name').value,
                phone: document.getElementById('customer-phone').value,
                address: document.getElementById('customer-address').value,
            },
            products: cart.map(item => ({ sku: item.sku, quantity: item.quantity, size: item.size, name: item.name })),
            totalQuantity,
            productPrice,
            deliveryCharge,
            totalAmount: productPrice + deliveryCharge
        };
        
        try {
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'cors',
                headers: { "Content-Type": "text/plain;charset=utf-8" },
                body: JSON.stringify(orderPayload)
            });
            const result = await response.json();

            if (result.status === 'success') {
                alert(`Thank you! Your order has been placed. Your Order ID is ${result.orderId}.`);
                cart = [];
                saveCart();
                closeCheckoutModal();
                fetchProducts();
            } else {
                showError(`Order failed: ${result.message}`);
            }
        } catch (error) {
            showError('An error occurred while submitting your order.');
        } finally {
            hideLoader();
        }
    };

    window.onclick = (event) => {
        if (event.target == productModal) closeProductModal();
        if (event.target == checkoutModal) closeCheckoutModal();
    };

    // --- LET'S GO! ---
    init();
});
