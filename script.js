const searchInput = document.querySelector('#productSearch');
const productCards = [...document.querySelectorAll('.product-card')];
const categoryButtons = [...document.querySelectorAll('.category-chip')];
const noResults = document.querySelector('#noResults');
const cartCount = document.querySelector('#cartCount');
const toast = document.querySelector('#toast');
const menuToggle = document.querySelector('#menuToggle');
const mainNav = document.querySelector('#mainNav');
let activeCategory = 'All';
let basketCount = 0;
let toastTimer;

function filterProducts() {
  const query = searchInput.value.trim().toLowerCase();
  let visible = 0;
  productCards.forEach(card => {
    const matchesCategory = activeCategory === 'All' || card.dataset.category === activeCategory;
    const matchesQuery = card.dataset.name.toLowerCase().includes(query) || card.textContent.toLowerCase().includes(query);
    const show = matchesCategory && matchesQuery;
    card.hidden = !show;
    if (show) visible++;
  });
  noResults.hidden = visible > 0;
}

categoryButtons.forEach(button => button.addEventListener('click', () => {
  activeCategory = button.dataset.category;
  categoryButtons.forEach(item => item.classList.toggle('selected', item === button));
  filterProducts();
}));
searchInput.addEventListener('input', filterProducts);

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2400);
}

document.querySelectorAll('.add-button').forEach(button => button.addEventListener('click', () => {
  basketCount++;
  cartCount.textContent = basketCount;
  button.classList.add('added');
  button.textContent = '✓';
  showToast(`${button.dataset.product} added to your basket`);
  window.setTimeout(() => { button.classList.remove('added'); button.textContent = '+'; }, 900);
}));

document.querySelectorAll('.favorite-button').forEach(button => button.addEventListener('click', () => {
  const saved = button.classList.toggle('saved');
  button.textContent = saved ? '♥' : '♡';
  showToast(saved ? 'Saved to your favorites' : 'Removed from your favorites');
}));

document.querySelector('#cartButton').addEventListener('click', () => {
  showToast(basketCount ? `Your basket has ${basketCount} ${basketCount === 1 ? 'item' : 'items'}` : 'Your basket is empty for now');
});

menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
});
mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  mainNav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

document.querySelector('#year').textContent = new Date().getFullYear();
document.addEventListener('keydown', event => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    searchInput.focus();
    document.querySelector('#marketplace').scrollIntoView({ behavior: 'smooth' });
  }
  if (event.key === 'Escape') {
    mainNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    searchInput.blur();
  }
});
