/* ── FTS FISHING · MAIN JS ─────────────────────────────────── */

/* ── SCROLL ANIMATIONS ── */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(el => {
    if (el.isIntersecting) {
      el.target.classList.add('visible');
      revealObserver.unobserve(el.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });
revealEls.forEach(el => revealObserver.observe(el));

/* ── PROMO BAR ── */
const promoBar = document.getElementById('promo-bar');
const closePromo = document.getElementById('close-promo');
if (promoBar && closePromo) {
  closePromo.addEventListener('click', () => {
    promoBar.remove();
    document.body.classList.replace('has-promo', 'no-promo');
  });
}

/* ── NAVBAR ── */
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 20);
});

/* Desktop shop dropdown */
const shopBtn = document.getElementById('shop-dropdown-btn');
const shopMenu = document.getElementById('shop-dropdown-menu');
if (shopBtn && shopMenu) {
  shopBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    shopBtn.classList.toggle('open');
    shopMenu.classList.toggle('open');
  });
}

/* Community dropdown */
const commBtn = document.getElementById('comm-dropdown-btn');
const commMenu = document.getElementById('comm-dropdown-menu');
if (commBtn && commMenu) {
  commBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    commBtn.classList.toggle('open');
    commMenu.classList.toggle('open');
  });
}

document.addEventListener('click', () => {
  if (shopBtn) shopBtn.classList.remove('open');
  if (shopMenu) shopMenu.classList.remove('open');
  if (commBtn) commBtn.classList.remove('open');
  if (commMenu) commMenu.classList.remove('open');
});

/* ── MOBILE MENU ── */
const mobileBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
if (mobileBtn && mobileMenu) {
  mobileBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
}

/* ── CART SYSTEM (localStorage) ── */
const CART_KEY = 'fts_cart';

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

window.addToCart = function(name, price, cat, img) {
  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const cart = getCart();
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, name, price: parseFloat(price) || 0, cat: cat || '', img: img || '', qty: 1 });
  }
  saveCart(cart);
  showCartToast(name);
};

window.removeCartItem = function(id) {
  saveCart(getCart().filter(item => item.id !== id));
  if (typeof window.renderCartPage === 'function') window.renderCartPage();
};

window.cartQty = function(id, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty = Math.max(1, item.qty + delta);
    saveCart(cart);
    if (typeof window.renderCartPage === 'function') window.renderCartPage();
  }
};

function updateCartBadge() {
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll('.cart-badge').forEach(el => {
    el.textContent = total;
    el.style.display = total > 0 ? '' : 'none';
  });
}
window.updateCartBadge = updateCartBadge;

function showCartToast(name) {
  document.querySelectorAll('.fts-cart-toast').forEach(t => t.remove());
  const toast = document.createElement('div');
  toast.className = 'fts-cart-toast';
  const short = name.length > 30 ? name.slice(0, 30) + '\u2026' : name;
  toast.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5"><polyline points="20 6 9 17 4 12"/></svg><span>' + short + ' added to cart</span>';
  toast.style.cssText = 'position:fixed;bottom:2rem;right:2rem;background:var(--gold);color:#080f1c;padding:.875rem 1.5rem;font-weight:700;font-size:.82rem;z-index:9999;box-shadow:0 4px 24px rgba(0,0,0,.5);display:flex;align-items:center;gap:.5rem;transition:opacity .4s;letter-spacing:.02em;pointer-events:none;';
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; }, 2100);
  setTimeout(() => toast.remove(), 2600);
}

/* Wire "Add to Cart" buttons on product cards */
document.querySelectorAll('.product-item').forEach(card => {
  card.querySelectorAll('button').forEach(btn => {
    if (btn.textContent.trim() === 'Add to Cart') {
      btn.addEventListener('click', () => {
        window.addToCart(
          card.dataset.name || '',
          parseFloat((card.dataset.price || '0').replace('$', '')),
          card.dataset.cat || '',
          card.querySelector('img') ? card.querySelector('img').src : ''
        );
      });
    }
  });
});

/* Cart icon → navigate to cart.html */
document.querySelectorAll('#cart-btn, #cart-btn-mobile').forEach(btn => {
  if (btn) btn.addEventListener('click', () => { window.location.href = 'cart.html'; });
});

updateCartBadge();

/* ── SEARCH OVERLAY ── */
const searchBtn = document.getElementById('search-btn');
const searchOverlay = document.getElementById('search-overlay');
const searchInput = document.getElementById('search-input');
const searchClose = document.getElementById('search-close');
const searchBg = document.getElementById('search-bg');
const searchResultsEl = document.getElementById('search-results');

const ALL_PRODUCTS = [
  { name: 'FTS Anglers Hat', price: '$16.00', cat: 'Fitted Hats', url: 'shop.html' },
  { name: 'Tight Lines From The Shore Hat', price: '$16.00', cat: 'Fitted Hats', url: 'shop.html' },
  { name: 'From the Shore Fishing Cap', price: '$16.00', cat: 'Fitted Hats', url: 'shop.html' },
  { name: 'Limited Edition From The Shore Angler Hat', price: '$16.00', cat: 'Fitted Hats', url: 'shop.html' },
  { name: 'FTS All Over Print Sport Pullover', price: '$39.00', cat: "Men's Gear", url: 'shop.html' },
  { name: 'FTS Brand Logo \u2014 Devon Jones Pullover', price: '$40.00', cat: "Men's Gear", url: 'shop.html' },
  { name: 'Tight Lines Logo Zip Garment', price: '$32.00', cat: "Men's Gear", url: 'shop.html' },
];

function openSearch() {
  if (!searchOverlay) return;
  searchOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => searchInput && searchInput.focus(), 100);
}
function closeSearch() {
  if (!searchOverlay) return;
  searchOverlay.classList.remove('open');
  document.body.style.overflow = '';
  if (searchInput) searchInput.value = '';
  if (searchResultsEl) searchResultsEl.innerHTML = renderPopular();
}

function renderPopular() {
  return '<p style="font-size:.7rem;text-transform:uppercase;letter-spacing:.15em;color:var(--muted);margin-bottom:1rem;">Popular</p>' +
    '<div style="display:flex;flex-wrap:wrap;gap:.5rem;">' +
    ['FTS Hat', 'Pullover', 'Zip Garment', 'Tight Lines', 'Custom Hats'].map(t =>
      '<button onclick="document.getElementById(\'search-input\').value=\'' + t + '\';doSearch(\'' + t + '\')" style="padding:.5rem 1rem;background:rgba(255,255,255,.05);border:1px solid var(--border);color:rgba(255,255,255,.6);font-size:.8rem;cursor:pointer;transition:color .2s" onmouseover="this.style.color=\'var(--gold)\'" onmouseout="this.style.color=\'rgba(255,255,255,.6)\'">' + t + '</button>'
    ).join('') + '</div>';
}

function doSearch(q) {
  if (!searchResultsEl) return;
  if (!q) { searchResultsEl.innerHTML = renderPopular(); return; }
  const results = ALL_PRODUCTS.filter(p => p.name.toLowerCase().includes(q.toLowerCase()));
  if (results.length === 0) {
    searchResultsEl.innerHTML = '<p style="color:var(--muted);text-align:center;padding:3rem 0;">No products found for "' + q + '"</p>';
    return;
  }
  searchResultsEl.innerHTML = '<p style="font-size:.7rem;text-transform:uppercase;letter-spacing:.15em;color:var(--muted);margin-bottom:1rem;">Results for "' + q + '"</p>' +
    results.map(p => '<a href="' + p.url + '" class="search-result-item"><div><div class="name">' + p.name + '</div><div class="cat">' + p.cat + '</div></div><div class="price">' + p.price + '</div></a>').join('');
}

if (searchBtn) searchBtn.addEventListener('click', openSearch);
if (searchClose) searchClose.addEventListener('click', closeSearch);
if (searchBg) searchBg.addEventListener('click', closeSearch);
if (searchInput) {
  searchInput.addEventListener('input', () => doSearch(searchInput.value));
  searchInput.addEventListener('keydown', e => e.key === 'Escape' && closeSearch());
}
if (searchResultsEl) searchResultsEl.innerHTML = renderPopular();

/* ── SHOP FILTER TABS ── */
document.querySelectorAll('.filter-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const group = tab.closest('.filter-tabs');
    if (group) group.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.dataset.filter;
    document.querySelectorAll('.product-item').forEach(item => {
      if (filter === 'all' || item.dataset.category === filter || (filter === 'popular' && item.dataset.popular) || (filter === 'bestseller' && item.dataset.bestseller)) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
  });
});

/* ── BLOG CATEGORY TABS ── */
document.querySelectorAll('.cat-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const group = tab.closest('.cat-filter-tabs');
    if (group) group.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const cat = tab.dataset.cat;
    document.querySelectorAll('.blog-item').forEach(item => {
      item.style.display = (cat === 'all' || item.dataset.cat === cat) ? '' : 'none';
    });
  });
});

/* ── QUICK VIEW MODAL ── */
const qvModal = document.getElementById('quick-view-modal');
const qvClose = document.getElementById('qv-close');
const qvBg = document.getElementById('qv-backdrop');
const qvName = document.getElementById('qv-name');
const qvCat = document.getElementById('qv-cat');
const qvPrice = document.getElementById('qv-price');
const qvImg = document.getElementById('qv-img');

function openQuickView(name, cat, price, imgSrc) {
  if (!qvModal) return;
  if (qvName) qvName.textContent = name;
  if (qvCat) qvCat.textContent = cat;
  if (qvPrice) qvPrice.textContent = price;
  if (qvImg && imgSrc) qvImg.src = imgSrc;
  qvModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeQuickView() {
  if (qvModal) { qvModal.classList.remove('open'); document.body.style.overflow = ''; }
}

document.querySelectorAll('.qv-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    const card = btn.closest('.product-card, .product-item');
    if (!card) return;
    openQuickView(
      card.dataset.name || '',
      card.dataset.cat || '',
      card.dataset.price || '',
      card.querySelector('img') ? card.querySelector('img').src : ''
    );
  });
});

if (qvClose) qvClose.addEventListener('click', closeQuickView);
if (qvBg) qvBg.addEventListener('click', closeQuickView);

const qvAddBtn = document.querySelector('#quick-view-modal .btn-gold');
if (qvAddBtn) {
  qvAddBtn.addEventListener('click', () => {
    if (qvName && qvPrice) {
      window.addToCart(
        qvName.textContent,
        parseFloat((qvPrice.textContent || '0').replace('$', '')),
        qvCat ? qvCat.textContent : '',
        qvImg ? qvImg.src : ''
      );
    }
    closeQuickView();
  });
}

/* ── SPECIES SELECTOR ── */
document.querySelectorAll('.species-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.species-item').forEach(i => i.classList.remove('selected'));
    item.classList.add('selected');
  });
});

/* ── FORMS ── */
document.querySelectorAll('form[data-form]').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const key = form.dataset.form;
    const successEl = document.getElementById('success-' + key);
    form.style.display = 'none';
    if (successEl) successEl.style.display = 'block';
  });
});

/* ── NEWSLETTER ── */
const newsletterForm = document.getElementById('newsletter-form');
const newsletterSuccess = document.getElementById('newsletter-success');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', e => {
    e.preventDefault();
    newsletterForm.style.display = 'none';
    if (newsletterSuccess) newsletterSuccess.style.display = 'block';
  });
}

/* ── FTS Carousel ── */
(function () {
  const track   = document.getElementById('fts-track');
  const dotsEl  = document.getElementById('fts-dots');
  if (!track) return;

  const slides  = track.querySelectorAll('.fts-slide');
  const total   = slides.length;
  let current   = 0;
  let timer;

  // Build dots
  slides.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'fts-dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', 'Slide ' + (i + 1));
    d.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(d);
  });

  function updateDots() {
    dotsEl.querySelectorAll('.fts-dot').forEach((d, i) =>
      d.classList.toggle('active', i === current));
  }

  function goTo(idx) {
    current = (idx + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    updateDots();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  document.getElementById('fts-next').addEventListener('click', () => { next(); resetTimer(); });
  document.getElementById('fts-prev').addEventListener('click', () => { prev(); resetTimer(); });

  function startTimer() { timer = setInterval(next, 3500); }
  function resetTimer()  { clearInterval(timer); startTimer(); }

  startTimer();
})();
