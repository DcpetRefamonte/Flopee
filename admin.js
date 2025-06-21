 const loginContainer = document.getElementById('loginContainer');
  const loginForm = document.getElementById('loginForm');
  const adminPanel = document.getElementById('adminPanel');
  const logoutAdmin = document.getElementById('logoutAdmin');
  const alertSuccess = document.getElementById('alertSuccess');
  const alertError = document.getElementById('alertError');
  const totalUsersEl = document.getElementById('totalUsers');
  const activeTodayEl = document.getElementById('activeToday');
  const systemStatusEl = document.getElementById('systemStatus');
  const rememberMeCheckbox = document.getElementById('rememberMe');

  const ADMIN_CREDENTIALS = {
    username: 'Yukraine',
    password: 'Password22',
    isAdmin: true,
    email: 'refamonteeuline22@gmail.com',
    lastLogin: null
  };

  let currentUser = null;

  loginForm.addEventListener('submit', handleLogin);
  logoutAdmin.addEventListener('click', handleLogout);

  function init() {
    const rememberedUsername = localStorage.getItem('rememberedAdminUsername');
    const rememberedPassword = localStorage.getItem('rememberedAdminPassword');

    if (rememberedUsername && rememberedPassword) {
      document.getElementById('username').value = rememberedUsername;
      document.getElementById('password').value = rememberedPassword;
      rememberMeCheckbox.checked = true;
    }

    const savedUser = localStorage.getItem('flopeeAdminUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      if (
        user.username === ADMIN_CREDENTIALS.username &&
        user.password === ADMIN_CREDENTIALS.password
      ) {
        currentUser = ADMIN_CREDENTIALS;
        showAdminPanel();
        updateDashboardStats();
      }
    }
  }

  function showAlert(element, message, duration = 3000) {
    element.textContent = message;
    element.style.display = 'block';
    setTimeout(() => {
      element.style.display = 'none';
    }, duration);
  }

  function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = rememberMeCheckbox.checked;

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      currentUser = ADMIN_CREDENTIALS;
      currentUser.lastLogin = new Date();

      localStorage.setItem('flopeeAdminUser', JSON.stringify({
        username: currentUser.username,
        password: currentUser.password
      }));

      if (rememberMe) {
        localStorage.setItem('rememberedAdminUsername', username);
        localStorage.setItem('rememberedAdminPassword', password);
      } else {
        localStorage.removeItem('rememberedAdminUsername');
        localStorage.removeItem('rememberedAdminPassword');
      }

      showAdminPanel();
      updateDashboardStats();
      showAlert(alertSuccess, 'Welcome back, Admin!');
    } else {
      showAlert(alertError, 'Invalid admin credentials');
    }
  }

  function handleLogout() {
    currentUser = null;
    localStorage.removeItem('flopeeAdminUser');

    const rememberedUsername = localStorage.getItem('rememberedAdminUsername');
    const rememberedPassword = localStorage.getItem('rememberedAdminPassword');

    loginContainer.style.display = 'flex';
    adminPanel.style.display = 'none';
    loginForm.reset();

    if (rememberedUsername && rememberedPassword) {
      document.getElementById('username').value = rememberedUsername;
      document.getElementById('password').value = rememberedPassword;
      rememberMeCheckbox.checked = true;
    }

    showAlert(alertSuccess, 'Logged out successfully');
  }

  function showAdminPanel() {
    loginContainer.style.display = 'none';
    adminPanel.style.display = 'block';
  }

  function updateDashboardStats() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    totalUsersEl.textContent = users.length;

    activeTodayEl.textContent = '0'; 
    systemStatusEl.textContent = 'Online';
    systemStatusEl.style.color = 'green';
  }

  

function displayOrders() {
    const ordersList = document.getElementById('ordersList');
    const orders = JSON.parse(localStorage.getItem('flopeeOrders')) || [];
    const searchTerm = document.getElementById('orderSearch').value.toLowerCase();
    const filterValue = document.getElementById('orderFilter').value;
    
    ordersList.innerHTML = '';
    
    if (orders.length === 0) {
        ordersList.innerHTML = '<p>No orders found</p>';
        return;
    }
    
    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.id.toString().includes(searchTerm) || 
                            order.customer.name.toLowerCase().includes(searchTerm);
        const matchesFilter = filterValue === 'all' || order.status === filterValue;
        return matchesSearch && matchesFilter;
    }).reverse();
    
    filteredOrders.forEach(order => {
        const orderCard = document.createElement('div');
        orderCard.className = 'order-card';
        
        orderCard.innerHTML = `
            <div class="order-header">
                <span class="order-id">Order #${order.id}</span>
                <span class="order-date">${new Date(order.date).toLocaleString()}</span>
                <span class="order-status status-${order.status}">${order.status}</span>
            </div>
            <div class="order-details">
                <div><strong>Customer:</strong> ${order.customer.name}</div>
                <div><strong>Email:</strong> ${order.customer.email}</div>
                ${order.customer.phone ? `<div><strong>Phone:</strong> ${order.customer.phone}</div>` : ''}
                <div><strong>Address:</strong> ${order.customer.address}</div>
                
                <h4 style="margin-top: 0.5rem;">Items:</h4>
                ${order.items.map(item => `
                    <div class="order-item">
                        <span>${item.name} (x${item.quantity})</span>
                        <span>$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                `).join('')}
                
                <div class="order-total">
                    Total: $${order.total.toFixed(2)}
                </div>
            </div>
            <div class="order-actions">
                ${order.status === 'pending' ? `
                    <button class="btn btn-primary complete-order" data-id="${order.id}">Mark Complete</button>
                    <button class="btn btn-danger cancel-order" data-id="${order.id}">Cancel</button>
                ` : ''}
            </div>
        `;
        
        ordersList.appendChild(orderCard);
    });
    
    document.querySelectorAll('.complete-order').forEach(btn => {
        btn.addEventListener('click', function() {
            updateOrderStatus(this.dataset.id, 'completed');
        });
    });
    
    document.querySelectorAll('.cancel-order').forEach(btn => {
        btn.addEventListener('click', function() {
            updateOrderStatus(this.dataset.id, 'cancelled');
        });
    });
}

function updateOrderStatus(orderId, newStatus) {
    const orders = JSON.parse(localStorage.getItem('flopeeOrders')) || [];
    const orderIndex = orders.findIndex(order => order.id == orderId);
    
    if (orderIndex !== -1) {
        orders[orderIndex].status = newStatus;
        localStorage.setItem('flopeeOrders', JSON.stringify(orders));
        displayOrders();
        showAlert(alertSuccess, `Order #${orderId} marked as ${newStatus}`);
    }
}

document.getElementById('orderSearch').addEventListener('input', displayOrders);
document.getElementById('orderFilter').addEventListener('change', displayOrders);

  init();