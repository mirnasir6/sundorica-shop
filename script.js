// Sundorica Frontend Logic by Gemini

document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION ---
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxPaNt_z0uRscltA5lyE_WTPogNs5d1mCqd7JDREyzJqUTHi0OPQlnh85f3ySpMTU4/exec'; // IMPORTANT: REPLACE WITH YOUR WEB APP URL

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
    
    // New elements for the updated design
    const searchIconBtn = document.getElementById('search-icon-btn');
    const searchInput = document.getElementById('search-input');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navMenuContainer = document.getElementById('nav-menu-container');

    const productModal = document.getElementById('product-modal');
    const checkoutModal = document.getElementById('checkout-modal');
    const footer = document.getElementById('footer');

    // --- INITIALIZATION ---
    const init = async () => {
        showLoader();
        await Promise.all([
            fetchProducts(),
            fetchDeliveryCharges()
        ]);
        applyTheme(localStorage.getItem('sundoricaTheme') || 'light');
        updateCartCount();
        setupEventListeners();
        hideLoader();
        showFooter();
        handleInitialProductView();
    };

    // --- DATA FETCHING (No changes here) ---
    const fetchProducts = async () => { /* ... existing code ... */ };
    const fetchDeliveryCharges = async () => { /* ... existing code ... */ };
    
    // --- RENDERING (No changes here) ---
    const renderProducts = (products) => { /* ... existing code ... */ };

    // --- EVENT LISTENERS ---
    const setupEventListeners = () => {
        themeToggle.addEventListener('click', toggleTheme);
        cartButton.addEventListener('click', openCheckoutModal);
        
        // Updated event listeners
        searchInput.addEventListener('input', handleSearch);
        searchIconBtn.addEventListener('click', toggleSearch);
        hamburgerBtn.addEventListener('click', toggleMobileMenu);

        navMenuContainer.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', handleNavClick));
    };

    // --- UI/UX HANDLERS ---
    const showLoader = () => loader.classList.remove('hidden');
    const hideLoader = () => loader.classList.add('hidden');
    const showFooter = () => footer.style.display = 'block';

    const toggleTheme = () => { /* ... existing code ... */ };
    const applyTheme = (theme) => { /* ... existing code ... */ };

    const handleSearch = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = allProducts.filter(p => p.name.toLowerCase().includes(searchTerm) || p.sku.toString().includes(searchTerm));
        renderProducts(filtered);
    };
    
    // New function to toggle search input visibility
    const toggleSearch = (e) => {
        e.stopPropagation(); // Prevent click from bubbling up to document
        searchInput.classList.toggle('active');
        if (searchInput.classList.contains('active')) {
            searchInput.focus();
        }
    };
    
    // New function to toggle mobile navigation menu
    const toggleMobileMenu = () => {
        navMenuContainer.classList.toggle('nav-active');
    };

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
        
        // Close mobile nav after clicking a link
        if (navMenuContainer.classList.contains('nav-active')) {
            navMenuContainer.classList.remove('nav-active');
        }
    };
    
    const showError = (message) => { alert(message); };
    
    // --- PRODUCT LOGIC (No changes here) ---
    const isProductAvailable = (product) => { /* ... existing code ... */ };
    const getProductBySku = (sku) => allProducts.find(p => p.sku == sku);
    const updateURLForProduct = (product) => { /* ... existing code ... */ };
    const handleInitialProductView = () => { /* ... existing code ... */ };

    // --- MODAL & CART LOGIC (No changes here) ---
    const openProductModal = (sku) => { /* ... existing code ... */ };
    const closeProductModal = () => { /* ... existing code ... */ };
    const handleAddToCart = (product) => { /* ... existing code ... */ };
    const handleBuyNow = (product) => { /* ... existing code ... */ };
    const addToCart = (item) => { /* ... existing code ... */ };
    const saveCart = () => { /* ... existing code ... */ };
    const updateCartCount = () => { /* ... existing code ... */ };
    const openCheckoutModal = () => { /* ... existing code ... */ };
    const closeCheckoutModal = () => { /* ... existing code ... */ };
    const handleOrderSubmit = async (e) => { /* ... existing code ... */ };

    // Close search box if clicked outside
    document.addEventListener('click', (e) => {
        if (!searchIconBtn.contains(e.target) && !searchInput.contains(e.target)) {
            searchInput.classList.remove('active');
        }
    });

    // Close modal on outside click
    window.onclick = (event) => {
        if (event.target == productModal) closeProductModal();
        if (event.target == checkoutModal) closeCheckoutModal();
    };

    // --- LET'S GO! ---
    init();
    
    // --- Helper function to avoid repetition, place the unchanged functions here ---
    // Make sure to copy the unchanged functions from your previous script.js file
    // For brevity, I've marked them as /* ... existing code ... */
    // You need to fill these in with the actual code.
});
