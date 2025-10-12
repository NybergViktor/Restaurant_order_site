// State
let currentTab = 'orders';
let orders = [];
let menuItems = [];
let tables = [];

// DOM elements
const ordersList = document.getElementById('ordersList');
const menuItemsList = document.getElementById('menuItemsList');
const tablesList = document.getElementById('tablesList');

// Modals
const menuItemModal = document.getElementById('menuItemModal');
const tableModal = document.getElementById('tableModal');
const qrModal = document.getElementById('qrModal');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupTabs();
    setupModals();
    loadOrders();
    setupOrderFilter();
});

// Setup tabs
function setupTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tab = e.target.dataset.tab;
            switchTab(tab);
        });
    });
}

function switchTab(tab) {
    currentTab = tab;
    
    // Update buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    
    // Update content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tab}Tab`).classList.add('active');
    
    // Load data
    if (tab === 'orders') {
        loadOrders();
    } else if (tab === 'menu') {
        loadMenuItems();
    } else if (tab === 'tables') {
        loadTables();
    }
}

// Orders
async function loadOrders() {
    try {
        const response = await fetch('/api/orders');
        const data = await response.json();
        
        if (data.success) {
            orders = data.data;
            displayOrders(orders);
        } else {
            ordersList.innerHTML = '<p class="error-message">Failed to load orders</p>';
        }
    } catch (error) {
        console.error('Error loading orders:', error);
        ordersList.innerHTML = '<p class="error-message">Failed to load orders</p>';
    }
}

function displayOrders(ordersToDisplay) {
    if (ordersToDisplay.length === 0) {
        ordersList.innerHTML = '<p>No orders found</p>';
        return;
    }

    ordersList.innerHTML = ordersToDisplay.map(order => `
        <div class="data-card">
            <div class="data-card-header">
                <div>
                    <div class="data-card-title">Order #${order._id.slice(-6)}</div>
                    <span class="status-badge status-${order.status}">${order.status.toUpperCase()}</span>
                </div>
                <div class="data-card-actions">
                    <select onchange="updateOrderStatus('${order._id}', this.value)" ${order.status === 'served' || order.status === 'cancelled' ? 'disabled' : ''}>
                        <option value="">Change Status</option>
                        <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="preparing" ${order.status === 'preparing' ? 'selected' : ''}>Preparing</option>
                        <option value="ready" ${order.status === 'ready' ? 'selected' : ''}>Ready</option>
                        <option value="served" ${order.status === 'served' ? 'selected' : ''}>Served</option>
                        <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                    <button class="btn btn-danger" onclick="deleteOrder('${order._id}')">Delete</button>
                </div>
            </div>
            <div class="data-card-body">
                <p><strong>Table:</strong> ${order.tableCode}</p>
                <p><strong>Total:</strong> ${order.totalAmount} kr</p>
                <p><strong>Time:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
                ${order.notes ? `<p><strong>Notes:</strong> ${order.notes}</p>` : ''}
                <div class="order-items">
                    <strong>Items:</strong>
                    ${order.items.map(item => `
                        <div class="order-item">
                            ${item.quantity}× ${item.name} - ${item.price} kr
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

function setupOrderFilter() {
    const filter = document.getElementById('orderStatusFilter');
    filter.addEventListener('change', (e) => {
        const status = e.target.value;
        if (status === 'all') {
            displayOrders(orders);
        } else {
            displayOrders(orders.filter(order => order.status === status));
        }
    });
}

async function updateOrderStatus(orderId, newStatus) {
    if (!newStatus) return;
    
    try {
        const response = await fetch(`/api/orders/${orderId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });

        const data = await response.json();

        if (data.success) {
            loadOrders();
        } else {
            alert('Failed to update order status');
        }
    } catch (error) {
        console.error('Error updating order status:', error);
        alert('Failed to update order status');
    }
}

async function deleteOrder(orderId) {
    if (!confirm('Are you sure you want to delete this order?')) return;

    try {
        const response = await fetch(`/api/orders/${orderId}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (data.success) {
            loadOrders();
        } else {
            alert('Failed to delete order');
        }
    } catch (error) {
        console.error('Error deleting order:', error);
        alert('Failed to delete order');
    }
}

// Menu Items
async function loadMenuItems() {
    try {
        const response = await fetch('/api/menu');
        const data = await response.json();
        
        if (data.success) {
            menuItems = data.data;
            displayMenuItems(menuItems);
        } else {
            menuItemsList.innerHTML = '<p class="error-message">Failed to load menu items</p>';
        }
    } catch (error) {
        console.error('Error loading menu items:', error);
        menuItemsList.innerHTML = '<p class="error-message">Failed to load menu items</p>';
    }
}

function displayMenuItems(items) {
    if (items.length === 0) {
        menuItemsList.innerHTML = '<p>No menu items found</p>';
        return;
    }

    menuItemsList.innerHTML = items.map(item => `
        <div class="data-card">
            <div class="data-card-header">
                <div class="data-card-title">${item.name}</div>
                <div class="data-card-actions">
                    <button class="btn btn-primary" onclick="editMenuItem('${item._id}')">Edit</button>
                    <button class="btn btn-danger" onclick="deleteMenuItem('${item._id}')">Delete</button>
                </div>
            </div>
            <div class="data-card-body">
                <p><strong>Category:</strong> ${item.category}</p>
                <p><strong>Price:</strong> ${item.price} kr</p>
                <p><strong>Description:</strong> ${item.description}</p>
                <p><strong>Available:</strong> ${item.available ? 'Yes' : 'No'}</p>
            </div>
        </div>
    `).join('');
}

document.getElementById('addMenuItemBtn').addEventListener('click', () => {
    document.getElementById('menuItemModalTitle').textContent = 'Add Menu Item';
    document.getElementById('menuItemForm').reset();
    document.getElementById('menuItemId').value = '';
    menuItemModal.classList.add('show');
});

function editMenuItem(itemId) {
    const item = menuItems.find(i => i._id === itemId);
    if (!item) return;

    document.getElementById('menuItemModalTitle').textContent = 'Edit Menu Item';
    document.getElementById('menuItemId').value = item._id;
    document.getElementById('itemName').value = item.name;
    document.getElementById('itemDescription').value = item.description;
    document.getElementById('itemPrice').value = item.price;
    document.getElementById('itemCategory').value = item.category;
    document.getElementById('itemImage').value = item.image || '';
    document.getElementById('itemAvailable').checked = item.available;
    
    menuItemModal.classList.add('show');
}

document.getElementById('saveMenuItemBtn').addEventListener('click', async () => {
    const itemId = document.getElementById('menuItemId').value;
    const itemData = {
        name: document.getElementById('itemName').value,
        description: document.getElementById('itemDescription').value,
        price: parseFloat(document.getElementById('itemPrice').value),
        category: document.getElementById('itemCategory').value,
        image: document.getElementById('itemImage').value,
        available: document.getElementById('itemAvailable').checked
    };

    try {
        const url = itemId ? `/api/menu/${itemId}` : '/api/menu';
        const method = itemId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(itemData)
        });

        const data = await response.json();

        if (data.success) {
            menuItemModal.classList.remove('show');
            loadMenuItems();
        } else {
            alert('Failed to save menu item: ' + (data.errors ? data.errors.join(', ') : data.message));
        }
    } catch (error) {
        console.error('Error saving menu item:', error);
        alert('Failed to save menu item');
    }
});

async function deleteMenuItem(itemId) {
    if (!confirm('Are you sure you want to delete this menu item?')) return;

    try {
        const response = await fetch(`/api/menu/${itemId}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (data.success) {
            loadMenuItems();
        } else {
            alert('Failed to delete menu item');
        }
    } catch (error) {
        console.error('Error deleting menu item:', error);
        alert('Failed to delete menu item');
    }
}

// Tables
async function loadTables() {
    try {
        const response = await fetch('/api/tables');
        const data = await response.json();
        
        if (data.success) {
            tables = data.data;
            displayTables(tables);
        } else {
            tablesList.innerHTML = '<p class="error-message">Failed to load tables</p>';
        }
    } catch (error) {
        console.error('Error loading tables:', error);
        tablesList.innerHTML = '<p class="error-message">Failed to load tables</p>';
    }
}

function displayTables(tablesToDisplay) {
    if (tablesToDisplay.length === 0) {
        tablesList.innerHTML = '<p>No tables found</p>';
        return;
    }

    tablesList.innerHTML = tablesToDisplay.map(table => `
        <div class="data-card">
            <div class="data-card-header">
                <div class="data-card-title">Table ${table.tableNumber}</div>
                <div class="data-card-actions">
                    <button class="btn btn-primary" onclick="showQRCode('${table._id}')">View QR</button>
                    <button class="btn btn-primary" onclick="editTable('${table._id}')">Edit</button>
                    <button class="btn btn-danger" onclick="deleteTable('${table._id}')">Delete</button>
                </div>
            </div>
            <div class="data-card-body">
                <p><strong>Table Code:</strong> ${table.tableCode}</p>
                <p><strong>Capacity:</strong> ${table.capacity} persons</p>
                <p><strong>Active:</strong> ${table.active ? 'Yes' : 'No'}</p>
            </div>
        </div>
    `).join('');
}

document.getElementById('addTableBtn').addEventListener('click', () => {
    document.getElementById('tableModalTitle').textContent = 'Add Table';
    document.getElementById('tableForm').reset();
    document.getElementById('tableId').value = '';
    tableModal.classList.add('show');
});

function editTable(tableId) {
    const table = tables.find(t => t._id === tableId);
    if (!table) return;

    document.getElementById('tableModalTitle').textContent = 'Edit Table';
    document.getElementById('tableId').value = table._id;
    document.getElementById('tableNumber').value = table.tableNumber;
    document.getElementById('tableCapacity').value = table.capacity;
    document.getElementById('tableActive').checked = table.active;
    
    tableModal.classList.add('show');
}

document.getElementById('saveTableBtn').addEventListener('click', async () => {
    const tableId = document.getElementById('tableId').value;
    const tableData = {
        tableNumber: document.getElementById('tableNumber').value,
        capacity: parseInt(document.getElementById('tableCapacity').value),
        active: document.getElementById('tableActive').checked
    };

    try {
        const url = tableId ? `/api/tables/${tableId}` : '/api/tables';
        const method = tableId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tableData)
        });

        const data = await response.json();

        if (data.success) {
            tableModal.classList.remove('show');
            loadTables();
        } else {
            alert('Failed to save table: ' + (data.errors ? data.errors.join(', ') : data.message));
        }
    } catch (error) {
        console.error('Error saving table:', error);
        alert('Failed to save table');
    }
});

async function deleteTable(tableId) {
    if (!confirm('Are you sure you want to delete this table?')) return;

    try {
        const response = await fetch(`/api/tables/${tableId}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (data.success) {
            loadTables();
        } else {
            alert('Failed to delete table');
        }
    } catch (error) {
        console.error('Error deleting table:', error);
        alert('Failed to delete table');
    }
}

function showQRCode(tableId) {
    const table = tables.find(t => t._id === tableId);
    if (!table) return;

    document.getElementById('qrCodeImage').src = table.qrCode;
    document.getElementById('qrCodeInfo').textContent = `Table ${table.tableNumber} - Code: ${table.tableCode}`;
    qrModal.classList.add('show');
}

// Modal controls
function setupModals() {
    // Close buttons
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            menuItemModal.classList.remove('show');
            tableModal.classList.remove('show');
            qrModal.classList.remove('show');
        });
    });

    // Cancel buttons
    document.getElementById('cancelMenuItemBtn').addEventListener('click', () => {
        menuItemModal.classList.remove('show');
    });

    document.getElementById('cancelTableBtn').addEventListener('click', () => {
        tableModal.classList.remove('show');
    });

    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target === menuItemModal) {
            menuItemModal.classList.remove('show');
        }
        if (e.target === tableModal) {
            tableModal.classList.remove('show');
        }
        if (e.target === qrModal) {
            qrModal.classList.remove('show');
        }
    });
}
