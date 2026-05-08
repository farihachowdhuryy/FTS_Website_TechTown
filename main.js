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
  { name: 'FTS Brand Logo — Devon Jones Pullover', price: '$40.00', cat: "Men's Gear", url: 'shop.html' },
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
  return `<p style="font-size:.7rem;text-transform:uppercase;letter-spacing:.15em;color:var(--muted);margin-bottom:1rem;">Popular</p>
  <div style="display:flex;flex-wrap:wrap;gap:.5rem;">
    ${['FTS Hat','Pullover','Zip Garment','Tight Lines','Custom Hats'].map(t =>
      `<button onclick="document.getElementById('search-input').value='${t}';doSearch('${t}')"
        style="padding:.5rem 1rem;background:rgba(255,255,255,.05);border:1px solid var(--border);color:rgba(255,255,255,.6);font-size:.8rem;cursor:pointer;transition:color .2s"
        onmouseover="this.style.color='var(--gold)'" onmouseout="this.style.color='rgba(255,255,255,.6)'">${t}</button>`
    ).join('')}
  </div>`;
}

function doSearch(q) {
  if (!searchResultsEl) return;
  if (!q) { searchResultsEl.innerHTML = renderPopular(); return; }
  const results = ALL_PRODUCTS.filter(p => p.name.toLowerCase().includes(q.toLowerCase()));
  if (results.length === 0) {
    searchResultsEl.innerHTML = `<p style="color:var(--muted);text-align:center;padding:3rem 0;">No products found for "${q}"</p>`;
    return;
  }
  searchResultsEl.innerHTML = `<p style="font-size:.7rem;text-transform:uppercase;letter-spacing:.15em;color:var(--muted);margin-bottom:1rem;">Results for "${q}"</p>` +
    results.map(p => `<a href="${p.url}" class="search-result-item">
      <div><div class="name">${p.name}</div><div class="cat">${p.cat}</div></div>
      <div class="price">${p.price}</div>
    </a>`).join('');
}

if (searchBtn) searchBtn.addEventListener('click', openSearch);
if (searchClose) searchClose.addEventListener('click', closeSearch);
if (searchBg) searchBg.addEventListener('click', closeSearch);
if (searchInput) {
  searchInput.addEventListener('input', () => doSearch(searchInput.value));
  searchInput.addEventListener('keydown', e => e.key === 'Escape' && closeSearch());
}
if (searchResultsEl) searchResultsEl.innerHTML = renderPopular();

/* ── CART DRAWER ── */
const cartBtn = document.getElementById('cart-btn');
const cartBtnMobile = document.getElementById('cart-btn-mobile');
const cartOverlay = document.getElementById('cart-overlay');
const cartBackdrop = document.getElementById('cart-backdrop');
const cartClose = document.getElementById('cart-close');

function openCart() { if (cartOverlay) { cartOverlay.classList.add('open'); document.body.style.overflow = 'hidden'; } }
function closeCart() { if (cartOverlay) { cartOverlay.classList.remove('open'); document.body.style.overflow = ''; } }

if (cartBtn) cartBtn.addEventListener('click', openCart);
if (cartBtnMobile) cartBtnMobile.addEventListener('click', openCart);
if (cartBackdrop) cartBackdrop.addEventListener('click', closeCart);
if (cartClose) cartClose.addEventListener('click', closeCart);

/* ── SHOP FILTER TABS ── */
document.querySelectorAll('.filter-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const group = tab.closest('.filter-tabs');
    if (group) group.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.dataset.filter;
    document.querySelectorAll('.product-item').forEach(item => {
      if (filter === 'all' || item.dataset.category.split(' ').includes(filter) || (filter === 'popular' && item.dataset.popular)) {
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
    const successEl = document.getElementById(`success-${key}`);
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