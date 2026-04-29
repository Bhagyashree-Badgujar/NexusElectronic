// Real product data with premium look
const products = [
  { id: 1, name: "Nexus X1 Stealth Laptop", price: 1499.00, img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800&auto=format&fit=crop", category: "Laptops", rating: 4.9 },
  { id: 2, name: "Aura Noise-Cancelling Headphones", price: 349.99, img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop", category: "Audio", rating: 4.8 },
  { id: 3, name: "Horizon Smartwatch Pro", price: 299.00, img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop", category: "Wearables", rating: 4.7 },
  { id: 4, name: "Phantom Drone Cinematic", price: 899.99, img: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=800&auto=format&fit=crop", category: "Cameras", rating: 4.6 },
  { id: 5, name: "Omni Vision VR Headset", price: 499.00, img: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=800&auto=format&fit=crop", category: "Gaming", rating: 4.9 },
  { id: 6, name: "Echo Portable Speaker", price: 129.50, img: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=800&auto=format&fit=crop", category: "Audio", rating: 4.5 },
];

let cart = [];
let currentUser = null;
let userOrders = [];

// ======= AUTHENTICATION =======
function handleUserIconClick() {
  if (currentUser) {
    showPage('profile');
  } else {
    openLoginModal();
  }
}

function openLoginModal() {
  const modal = document.getElementById('loginModal');
  const overlay = document.getElementById('loginOverlay');
  if(modal && overlay) {
    modal.classList.add('active');
    overlay.classList.add('active');
  }
}

function closeLoginModal() {
  const modal = document.getElementById('loginModal');
  const overlay = document.getElementById('loginOverlay');
  if(modal && overlay) {
    modal.classList.remove('active');
    overlay.classList.remove('active');
  }
}

function login(e) {
  e.preventDefault();
  const emailInput = document.getElementById('loginEmail');
  const email = emailInput ? emailInput.value : 'user@example.com';
  
  currentUser = { email: email, name: email.split('@')[0] };
  
  // Update UI
  const userIconBtn = document.getElementById('userIconBtn');
  if (userIconBtn) userIconBtn.style.color = 'var(--accent)';
  
  const profileName = document.getElementById('profileName');
  if (profileName) profileName.innerText = currentUser.name;
  
  closeLoginModal();
  showToast("Logged in successfully!");
  renderProfile();
}

function logout() {
  currentUser = null;
  const userIconBtn = document.getElementById('userIconBtn');
  if (userIconBtn) userIconBtn.style.color = '';
  
  showToast("Logged out successfully.");
  showPage('home');
}

// ======= NAVIGATION & ROUTING =======
function showPage(pageId) {
  // Hide all pages & nav highlights
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  
  // Activate selected page
  const page = document.getElementById('page-' + pageId);
  if(page) page.classList.add('active');
  
  const link = document.querySelector(`.nav-link[data-page="${pageId}"]`);
  if(link) link.classList.add('active');

  // Trigger content rendering
  if(pageId === 'home') renderFeatured();
  if(pageId === 'shop') renderShop();
  
  // Smooth scroll top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Navbar Search functionality
document.getElementById('searchToggle')?.addEventListener('click', () => {
  const searchBar = document.getElementById('searchBar');
  searchBar.classList.toggle('active');
  if(searchBar.classList.contains('active')) {
    document.getElementById('searchInput').focus();
  }
});
document.getElementById('searchClose')?.addEventListener('click', () => {
  document.getElementById('searchBar').classList.remove('active');
});


// ======= PRODUCT RENDERING =======
function createProductCard(product) {
  return `
    <div class="product-card">
      <img src="${product.img}" alt="${product.name}" class="product-img" />
      <div class="product-category">${product.category}</div>
      <div class="product-name">${product.name}</div>
      <div class="product-card-footer">
        <div class="product-price">$${product.price.toFixed(2)}</div>
        <button class="btn-icon-cart" onclick="addToCart(${product.id})" title="Add to Cart">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
        </button>
      </div>
    </div>
  `;
}

function renderFeatured() {
  const container = document.getElementById('featuredGrid');
  if(container) {
    container.innerHTML = products.slice(0, 4).map(createProductCard).join('');
  }
}

function renderShop() {
  const container = document.getElementById('shopGrid');
  if(container) {
    container.innerHTML = products.map(createProductCard).join('');
  }
}

// ======= CART FUNCTIONALITY =======
function addToCart(id) {
  const product = products.find(p => p.id === id);
  if(!product) return;
  
  const item = cart.find(i => i.id === id);
  if(item) {
    item.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  
  updateCartUI();
  showToast(`${product.name} added to cart`);
  
  // Optionally open cart automatically
  // openCart();
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  updateCartUI();
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if(!item) return;
  item.quantity += delta;
  if(item.quantity <= 0) {
    removeFromCart(id);
  } else {
    updateCartUI();
  }
}

function updateCartUI() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountEl = document.getElementById('cartCount');
  if(cartCountEl) cartCountEl.innerText = count;
  
  const itemsContainer = document.getElementById('cartItems');
  const footer = document.getElementById('cartFooter');
  
  if(!itemsContainer) return;

  if (cart.length === 0) {
    itemsContainer.innerHTML = `
      <div style="text-align:center; padding: 40px 20px; color: var(--text-muted);">
        <div style="font-size:3rem; margin-bottom:16px;">🛒</div>
        <h3>Your cart is empty</h3>
        <p style="margin-top:8px;">Looks like you haven't added anything to your cart yet.</p>
        <button class="btn-primary" style="margin-top:24px;" onclick="closeCart(); showPage('shop')">Start Shopping</button>
      </div>
    `;
    if(footer) footer.style.display = 'none';
  } else {
    if(footer) footer.style.display = 'block';
    
    itemsContainer.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.img}" class="cart-item-img" alt="${item.name}" />
        <div class="ci-details">
          <div class="ci-name">${item.name}</div>
          <div class="ci-price">$${item.price.toFixed(2)}</div>
          <div class="ci-qty">
            <button onclick="changeQty(${item.id}, -1)">-</button>
            <span>${item.quantity}</span>
            <button onclick="changeQty(${item.id}, 1)">+</button>
          </div>
        </div>
        <button onclick="removeFromCart(${item.id})" style="color:#ef4444; background:none; border:none; padding:10px; cursor:pointer;" title="Remove item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
      </div>
    `).join('');
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('cartSubtotal').innerText = `$${subtotal.toFixed(2)}`;
    document.getElementById('cartTotal').innerText = `$${subtotal.toFixed(2)}`;
  }
}

function openCart() {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  if(drawer && overlay) {
    drawer.classList.add('active');
    overlay.classList.add('active');
  }
}

function closeCart() {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  if(drawer && overlay) {
    drawer.classList.remove('active');
    overlay.classList.remove('active');
  }
}

function startCheckout() {
  if (cart.length === 0) {
    showToast("Cart is empty!");
    return;
  }
  
  if (!currentUser) {
    showToast("Please log in to proceed to checkout.");
    openLoginModal();
    return;
  }

  closeCart();
  showPage('checkout');
}

// ======= CHECKOUT FLOW LOGIC =======
function goToPayment(e) {
  if(e) e.preventDefault();
  document.getElementById('checkoutStep1').classList.add('hidden');
  document.getElementById('checkoutStep2').classList.remove('hidden');
  
  // Highlight order summary box totals
  updateOrderSummaryBox();
}

function selectPaymentMethod(method) {
  document.querySelectorAll('.pm-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById(`pm-${method}`).classList.add('active');
  
  // Minimal logic for mock checkout: keep it simple
}

function placeOrder(e) {
  if(e) e.preventDefault();
  
  // Show spinner
  const loading = document.getElementById('loadingOverlay');
  if(loading) loading.style.display = 'flex';
  
  // Simulate 2 seconds of payment processing
  setTimeout(() => {
    if(loading) loading.style.display = 'none';
    
    // Save order if user is logged in
    if (currentUser && cart.length > 0) {
      const orderTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const newOrder = {
        id: 'ORD-' + Math.floor(Math.random() * 1000000),
        date: new Date().toLocaleDateString(),
        items: [...cart],
        total: orderTotal
      };
      userOrders.unshift(newOrder); // add to top
      renderProfile();
    }

    // Clear cart
    cart = [];
    updateCartUI();
    
    // Reset any forms
    const checkoutForms = document.querySelectorAll('.checkout-form');
    checkoutForms.forEach(form => form.reset());
    
    // Reset steps
    document.getElementById('checkoutStep2').classList.add('hidden');
    document.getElementById('checkoutStep1').classList.remove('hidden');
    
    // Go to success
    showPage('success');
    showToast("Order placed successfully!");
  }, 2000);
}

function renderProfile() {
  const container = document.getElementById('ordersList');
  if (!container) return;

  if (userOrders.length === 0) {
    container.innerHTML = '<p style="color:var(--text-muted);">You have no previous orders yet.</p>';
    return;
  }

  container.innerHTML = userOrders.map(order => `
    <div class="order-card">
      <div class="order-header">
        <span class="order-id">${order.id}</span>
        <span class="order-date">${order.date}</span>
      </div>
      <div class="order-items">
        ${order.items.map(item => `
          <div class="order-item-row">
            <span>${item.quantity}x ${item.name}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        `).join('')}
      </div>
      <div style="border-top: 1px dashed var(--border); padding-top: 16px; text-align: right;">
        <span class="order-total">Total: $${order.total.toFixed(2)}</span>
      </div>
    </div>
  `).join('');
}

function updateOrderSummaryBox() {
  // Can be expanded if order summary sidebar is needed in the UI
}

// ======= UTILS & TOASTS =======
function showToast(message) {
  const container = document.getElementById('toastContainer');
  if(!container) return;
  
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerText = message;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ======= INIT =======
document.addEventListener('DOMContentLoaded', () => {
  renderFeatured();
  updateCartUI();
  
  // Bind form specific methods
  const shForm = document.getElementById('shippingForm');
  if(shForm) shForm.addEventListener('submit', goToPayment);
  
  const pForm = document.getElementById('paymentForm');
  if(pForm) pForm.addEventListener('submit', placeOrder);

  const loginForm = document.getElementById('loginForm');
  if(loginForm) loginForm.addEventListener('submit', login);
  
  // Hero Visual if present
  const heroImg = document.querySelector('.hero-visual');
  if(heroImg) {
    heroImg.innerHTML = '<img src="https://images.unsplash.com/photo-1542393545-10f5cde2c810?q=80&w=1000&auto=format&fit=crop" alt="Premium Gadget Desktop" />';
  }
});
