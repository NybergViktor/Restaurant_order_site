// Get table code from URL
const tableCode = window.location.pathname.split('/').pop();
let cart = [];
let menuItems = [];

// DOM elements
const menuItemsContainer = document.getElementById('menuItems');
const tableInfo = document.getElementById('tableInfo');
const cartModal = document.getElementById('cartModal');
const viewCartBtn = document.getElementById('viewCartBtn');
const cartCount = document.getElementById('cartCount');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const placeOrderBtn = document.getElementById('placeOrderBtn');
const clearCartBtn = document.getElementById('clearCartBtn');
const orderNotes = document.getElementById('orderNotes');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadTableInfo();
    loadMenuItems();
    setupEventListeners();
    loadCartFromStorage();
});

// Load table info
async function loadTableInfo() {
    try {
        const response = await fetch(`/api/tables/code/${tableCode}`);
        const data = await response.json();
        
        if (data.success) {
            tableInfo.textContent = `Table ${data.data.tableNumber}`;
        } else {
            tableInfo.textContent = 'Invalid table code';
        }
    } catch (error) {
        console.error('Error loading table info:', error);
        tableInfo.textContent = 'Error loading table info';
    }
}

// Load menu items
async function loadMenuItems() {
    try {
        const response = await fetch('/api/menu');
        const data = await response.json();
        
        if (data.success) {
            menuItems = data.data;
            displayMenuItems(menuItems);
        } else {
            menuItemsContainer.innerHTML = '<p class="error-message">Failed to load menu</p>';
        }
    } catch (error) {
        console.error('Error loading menu:', error);
        menuItemsContainer.innerHTML = '<p class="error-message">Failed to load menu</p>';
    }
}

// Display menu items
function displayMenuItems(items) {
    if (items.length === 0) {
        menuItemsContainer.innerHTML = '<p>No menu items available</p>';
        return;
    }

    menuItemsContainer.innerHTML = items.map(item => `
        <div class="menu-item ${!item.available ? 'unavailable' : ''}" data-category="${item.category}">
            <span class="category">${item.category}</span>
            <h3>${item.name}</h3>
            <p class="description">${item.description}</p>
            <p class="price">${item.price} kr</p>
            ${item.available ? `
                <div class="quantity-control">
                    <button onclick="decreaseQuantity('${item._id}')">-</button>
                    <input type="number" id="qty-${item._id}" value="1" min="1" max="20" readonly>
                    <button onclick="increaseQuantity('${item._id}')">+</button>
                </div>
                <button class="btn btn-primary" style="width: 100%; margin-top: 10px;" onclick="addToCart('${item._id}')">
                    Add to Cart
                </button>
            ` : '<p style="color: red; margin-top: 10px;">Currently Unavailable</p>'}
        </div>
    `).join('');
}

// Filter menu items by category
function filterMenuItems(category) {
    const items = document.querySelectorAll('.menu-item');
    items.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Setup event listeners
function setupEventListeners() {
    // Category filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            filterMenuItems(e.target.dataset.category);
        });
    });

    // Cart modal
    viewCartBtn.addEventListener('click', () => {
        displayCart();
        cartModal.classList.add('show');
    });

    // Close modal
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            cartModal.classList.remove('show');
        });
    });

    // Place order
    placeOrderBtn.addEventListener('click', placeOrder);

    // Clear cart
    clearCartBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear your cart?')) {
            cart = [];
            updateCart();
            saveCartToStorage();
            cartModal.classList.remove('show');
        }
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.classList.remove('show');
        }
    });
}

// Quantity controls
function increaseQuantity(itemId) {
    const input = document.getElementById(`qty-${itemId}`);
    if (input.value < 20) {
        input.value = parseInt(input.value) + 1;
    }
}

function decreaseQuantity(itemId) {
    const input = document.getElementById(`qty-${itemId}`);
    if (input.value > 1) {
        input.value = parseInt(input.value) - 1;
    }
}

// Add to cart
function addToCart(itemId) {
    const item = menuItems.find(i => i._id === itemId);
    if (!item) return;

    const quantityInput = document.getElementById(`qty-${itemId}`);
    const quantity = parseInt(quantityInput.value);

    const existingItem = cart.find(i => i.menuItem === itemId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            menuItem: itemId,
            name: item.name,
            price: item.price,
            quantity: quantity
        });
    }

    quantityInput.value = 1;
    updateCart();
    saveCartToStorage();
    
    // Show brief feedback
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = '✓ Added!';
    btn.style.background = '#28a745';
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
    }, 1000);
}

// Display cart
function displayCart() {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
        return;
    }

    cartItemsContainer.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${item.price} kr × ${item.quantity}</div>
            </div>
            <div class="cart-item-actions">
                <button class="btn btn-secondary" onclick="updateCartItemQuantity(${index}, ${item.quantity - 1})">-</button>
                <span>${item.quantity}</span>
                <button class="btn btn-secondary" onclick="updateCartItemQuantity(${index}, ${item.quantity + 1})">+</button>
                <button class="btn btn-danger" onclick="removeFromCart(${index})">×</button>
            </div>
        </div>
    `).join('');
}

// Update cart item quantity
function updateCartItemQuantity(index, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(index);
        return;
    }
    if (newQuantity > 20) return;

    cart[index].quantity = newQuantity;
    displayCart();
    updateCart();
    saveCartToStorage();
}

// Remove from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    displayCart();
    updateCart();
    saveCartToStorage();
}

// Update cart display
function updateCart() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    cartCount.textContent = itemCount;
    cartTotal.textContent = total.toFixed(2);
}

// Place order
async function placeOrder() {
    if (cart.length === 0) {
        alert('Your cart is empty');
        return;
    }

    placeOrderBtn.disabled = true;
    placeOrderBtn.textContent = 'Placing order...';

    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                tableCode: tableCode,
                items: cart,
                notes: orderNotes.value
            })
        });

        const data = await response.json();

        if (data.success) {
            alert('Order placed successfully! Your food will be prepared shortly.');
            cart = [];
            orderNotes.value = '';
            updateCart();
            saveCartToStorage();
            cartModal.classList.remove('show');
        } else {
            alert('Failed to place order: ' + (data.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error placing order:', error);
        alert('Failed to place order. Please try again.');
    } finally {
        placeOrderBtn.disabled = false;
        placeOrderBtn.textContent = 'Place Order';
    }
}

// Local storage functions
function saveCartToStorage() {
    localStorage.setItem(`cart_${tableCode}`, JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem(`cart_${tableCode}`);
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
}
