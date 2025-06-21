document.addEventListener('DOMContentLoaded', function() {
    const cartIcon = document.querySelector('.cart-icon');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const cartOverlay = document.querySelector('.cart-overlay');
    const closeCart = document.querySelector('.close-cart');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartCount = document.querySelector('.cart-count');
    const totalAmount = document.querySelector('.total-amount');
    const checkoutBtn = document.querySelector('.checkout-btn');
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    function toggleCart() {
        cartSidebar.classList.toggle('active');
        cartOverlay.classList.toggle('active');
    }
    
    cartIcon.addEventListener('click', toggleCart);
    closeCart.addEventListener('click', toggleCart);
    cartOverlay.addEventListener('click', toggleCart);
    
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const product = {
                id: this.dataset.id,
                name: this.dataset.name,
                price: parseFloat(this.dataset.price),
                image: this.dataset.image,
                quantity: 1
            };
            
        
            const existingItem = cart.find(item => item.id === product.id);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push(product);
            }
            
            updateCart();
            
            
            this.textContent = 'Added!';
            this.style.backgroundColor = '#2ecc71';
            setTimeout(() => {
                this.textContent = 'Add to Cart';
                this.style.backgroundColor = '#3498db';
            }, 1000);
        });
    });
    
    
    function updateCart() {
        
        localStorage.setItem('cart', JSON.stringify(cart));
        
        
        const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = itemCount;
        
        
        cartItemsContainer.innerHTML = '';
        
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
            totalAmount.textContent = '0.00';
        } else {
            cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>₱${(item.price * item.quantity).toFixed(2)}</p>
                        <div class="cart-item-controls">
                            <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn increase" data-id="${item.id}">+</button>
                            <button class="remove-item" data-id="${item.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItem);
            });
            
            
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            totalAmount.textContent = total.toFixed(2);
        }
    }
    
    
    cartItemsContainer.addEventListener('click', function(e) {
        const target = e.target.closest('button');
        if (!target) return;
        
        const id = target.dataset.id;
        const itemIndex = cart.findIndex(item => item.id === id);
        
        if (itemIndex === -1) return;
        
        if (target.classList.contains('decrease')) {
            if (cart[itemIndex].quantity > 1) {
                cart[itemIndex].quantity -= 1;
            } else {
                cart.splice(itemIndex, 1);
            }
        } else if (target.classList.contains('increase')) {
            cart[itemIndex].quantity += 1;
        } else if (target.classList.contains('remove-item')) {
            cart.splice(itemIndex, 1);
        }
        
        updateCart();
    });
    
    
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        
        alert(`Order placed! Total: ₱${totalAmount.textContent}`);
        cart = [];
        updateCart();
        toggleCart();
    });
    
    
    updateCart();
});