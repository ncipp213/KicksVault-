    /* ==========================================================================
    1. Data Produk & Utility Functions
    ========================================================================== */
    const products = [
    { id: 1, name: 'Volt Runner 01', category: 'Running', group: 'Men', price: 1890000, rating: '4.9', tag: 'New drop', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85' },
    { id: 2, name: 'Cloudline Mesh', category: 'Sneakers', group: 'Women', price: 2190000, rating: '4.8', tag: 'Best seller', image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=900&q=85' },
    { id: 3, name: 'Court Signal', category: 'Formal', group: 'Men', price: 2450000, rating: '4.7', tag: 'Limited', image: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=900&q=85' },
    { id: 4, name: 'Pearl Transit', category: 'Casual', group: 'Women', price: 1690000, rating: '4.9', tag: 'Everyday', image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=85' },
    { id: 5, name: 'Mono Shift', category: 'Sneakers', group: 'Kids', price: 1290000, rating: '4.6', tag: 'Fresh', image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=900&q=85' },
    { id: 6, name: 'Afterdark 90', category: 'Running', group: 'Men', price: 1990000, rating: '4.8', tag: 'Archive', image: 'https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=900&q=85' }
    ];

    const money = n => `Rp ${(n / 1000).toLocaleString('id-ID')}K`;
    const qs = s => document.querySelector(s);
    const qsa = s => [...document.querySelectorAll(s)];

    let cart = JSON.parse(localStorage.getItem('kv-cart') || '[]');

    function save() {
    localStorage.setItem('kv-cart', JSON.stringify(cart));
    qsa('[data-cart-count]').forEach(x => x.textContent = cart.length);
    }

    /* ==========================================================================
    2. Rendering & UI Components
    ========================================================================== */
    function card(p) {
    return `
        <article class="product-card" data-testid="product-card-${p.id}">
        <div class="product-photo">
            <img src="${p.image}" alt="${p.name}">
            <span class="tag">${p.tag}</span>
            <button class="add" data-add="${p.id}" data-testid="add-product-${p.id}">Add +</button>
        </div>
        <div class="product-info">
            <div>
            <span class="eyebrow">${p.category} / ${p.group}</span>
            <h3>${p.name}</h3>
            </div>
            <strong>${money(p.price)}</strong>
        </div>
        <div class="rating">✦ ${p.rating}<span>Available now</span></div>
        </article>
    `;
    }

    function render(list, root) {
    root.innerHTML = list.map(card).join('');
    
    qsa('[data-add]').forEach(b => {
        b.onclick = () => {
        const p = products.find(x => x.id == b.dataset.add);
        if (!cart.some(x => x.id === p.id)) cart.push(p);
        save();
        openCart();
        };
    });
    }

    /* ==========================================================================
    3. Cart Drawer Management
    ========================================================================== */
    function openCart() {
    const d = document.createElement('div');
    d.className = 'drawer';
    d.dataset.testid = 'cart-drawer';

    const items = cart.map(p => `
        <div class="cart-item">
        <img src="${p.image}" alt="${p.name}">
        <div>
            <span class="eyebrow">${p.category}</span>
            <h3>${p.name}</h3>
            <strong>${money(p.price)}</strong><br>
            <button data-remove="${p.id}" data-testid="cart-remove-${p.id}">Remove</button>
        </div>
        </div>
    `).join('');

    const empty = `
        <div class="empty">
        Your bag is waiting.<br>
        <a class="button" href="shop.html" data-testid="empty-cart-shop">Browse drops</a>
        </div>
    `;

    const total = cart.length ? `
        <div class="cart-total">
        <span>Total</span>
        <strong>${money(cart.reduce((a, p) => a + p.price, 0))}</strong>
        </div>
    ` : '';

    d.innerHTML = `
        <aside class="drawer-panel">
        <div class="drawer-head">
            <div>
            <span class="eyebrow">Your selection</span>
            <h2>The bag (${cart.length})</h2>
            </div>
            <button class="icon-btn" data-close data-testid="cart-close-button">×</button>
        </div>
        ${cart.length ? items : empty}
        ${total}
        </aside>
    `;

    document.body.appendChild(d);

    d.onclick = e => {
        if (e.target === d || e.target.closest('[data-close]')) {
        d.remove();
        }
        
        const removeBtn = e.target.closest('[data-remove]');
        if (removeBtn) {
        cart = cart.filter(p => p.id != removeBtn.dataset.remove);
        save();
        d.remove();
        openCart();
        }
    };
    }

    /* ==========================================================================
    4. Application Initialization & Setup
    ========================================================================== */
    function setup() {
    // Theme Setup
    document.documentElement.dataset.theme = localStorage.getItem('kv-theme') || 'dark';
    const theme = qs('[data-theme-toggle]');
    if (theme) {
        theme.onclick = () => {
        const t = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.dataset.theme = t;
        localStorage.setItem('kv-theme', t);
        };
    }

    // Cart Count
    const count = qs('[data-cart-count]');
    if (count) count.textContent = cart.length;

    const bag = qs('[data-cart-button]');
    if (bag) bag.onclick = openCart;

    // Mobile Menu
    qsa('[data-menu]').forEach(x => {
        x.onclick = () => qs('.nav-links').classList.toggle('open');
    });

    // Product Grid (Home/Preview)
    const grid = qs('[data-product-grid]');
    if (grid) render(products.slice(0, 3), grid);

    // Catalog & Filtering
    const catalog = qs('[data-catalog]');
    if (catalog) {
        render(products, catalog);
        qsa('[data-filter]').forEach(b => {
        b.onclick = () => {
            qsa('[data-filter]').forEach(x => x.classList.remove('active'));
            b.classList.add('active');
            const f = b.dataset.filter;
            render(f === 'All' ? products : products.filter(p => p.group === f || p.category === f), catalog);
        };
        });
    }

    // Contact Form
    const form = qs('[data-contact-form]');
    if (form) {
        form.onsubmit = e => {
        e.preventDefault();
        qs('#form-success').textContent = 'Message ready. Or contact us instantly via WhatsApp.';
        form.reset();
        };
    }
    }

    /* ==========================================================================
    5. Testing Hooks & Event Listeners
    ========================================================================== */
    function addTestHooks() {
    qsa('.nav-links a').forEach((x, i) => x.dataset.testid = `nav-link-${i}`);
    qsa('[data-filter]').forEach(x => x.dataset.testid = `filter-${x.dataset.filter.toLowerCase()}`);
    qsa('[data-faq]').forEach((x, i) => x.dataset.testid = `faq-${i}-button`);
    
    const form = qs('[data-contact-form]');
    if (form) form.dataset.testid = 'contact-form';
    
    qsa('[data-contact-form] input').forEach((x, i) => x.dataset.testid = `contact-input-${i}`);
    qsa('[data-contact-form] textarea').forEach(x => x.dataset.testid = 'contact-message-input');
    }

    // DOMContentLoaded Event Handlers
    document.addEventListener('DOMContentLoaded', () => {
    setup();
    addTestHooks();
    });

    document.addEventListener('DOMContentLoaded', () => {
    qsa('[data-theme-toggle]').forEach(x => x.dataset.testid = 'theme-toggle');
    qsa('[data-cart-button]').forEach(x => x.dataset.testid = 'cart-open-button');
    qsa('[data-menu]').forEach(x => x.dataset.testid = 'mobile-menu-button');
    });

    document.addEventListener('DOMContentLoaded', () => {
    qsa('.faq').forEach(f => {
        const answer = f.querySelector('p');
        const toggle = f.querySelector('[data-faq]');
        if (answer && toggle) {
        answer.style.display = 'none';
        toggle.onclick = () => {
            answer.style.display = answer.style.display === 'none' ? 'block' : 'none';
        };
        }
    });
    });