// Mobile nav toggle
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('show');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('show');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', (event) => {
    const clickedInsideNav = nav.contains(event.target);
    const clickedMenuToggle = menuToggle.contains(event.target);
    if (!clickedInsideNav && !clickedMenuToggle) {
      nav.classList.remove('show');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// FAQ accordion with accessibility attributes
const faqQuestions = document.querySelectorAll('.faq-question');
faqQuestions.forEach((question, index) => {
  const item = question.closest('.faq-item');
  const answer = item?.querySelector('.faq-answer');
  if (!item || !answer) return;

  const answerId = `faq-answer-${index + 1}`;
  answer.id = answerId;
  question.setAttribute('aria-controls', answerId);
  question.setAttribute('aria-expanded', 'false');

  question.addEventListener('click', () => {
    const isOpen = item.classList.toggle('open');
    question.setAttribute('aria-expanded', String(isOpen));
  });
});

// Back to top visibility and action
const backToTop = document.querySelector('.back-to-top');
if (backToTop) {
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('show', window.scrollY > 420);
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Simple reveal on scroll for retention effect
const animatedSections = document.querySelectorAll('.section-animate');
if ('IntersectionObserver' in window && animatedSections.length) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
  });

  animatedSections.forEach((section) => revealObserver.observe(section));
} else {
  animatedSections.forEach((section) => section.classList.add('visible'));
}

// Mobile quick tools + bottom nav (inspired by marketplace UX, only shown on mobile)
const currentPath = window.location.pathname;
const mobileTools = document.createElement('section');
mobileTools.className = 'mobile-quick-tools';
mobileTools.innerHTML = `
  <div class="mobile-search-row">
    <input type="search" placeholder="Search products" aria-label="Search products">
    <button type="button">Search</button>
  </div>
`;

const header = document.querySelector('.site-header');
if (header) {
  header.insertAdjacentElement('afterend', mobileTools);
}

const mobileNav = document.createElement('nav');
mobileNav.className = 'mobile-bottom-nav';
mobileNav.setAttribute('aria-label', 'Mobile quick navigation');
mobileNav.innerHTML = `
  <a href="/index.html"><strong>⌂</strong>Home</a>
  <a href="/womens-accessories.html"><strong>◫</strong>Accessories</a>
  <a href="/makeup.html"><strong>⌕</strong>Makeup</a>
  <a href="/skincare.html"><strong>☺</strong>Skincare</a>
`;
document.body.appendChild(mobileNav);

Array.from(mobileNav.querySelectorAll('a')).forEach((link) => {
  if (currentPath.endsWith(link.getAttribute('href')) || (currentPath === '/' && link.getAttribute('href') === '/index.html')) {
    link.style.color = 'var(--accent-dark)';
    link.style.fontWeight = '700';
  }
});

// Product detail modal for all product cards
const detailModal = document.createElement('aside');
detailModal.className = 'product-detail-modal';
detailModal.setAttribute('aria-hidden', 'true');
detailModal.innerHTML = `
  <div class="product-detail-sheet" role="dialog" aria-modal="true" aria-label="Product details">
    <button type="button" class="product-detail-close">Close ✕</button>
    <img src="" alt="Product image preview">
    <h3></h3>
    <p class="detail-description"></p>
    <p class="detail-price"></p>
    <a class="btn btn-primary detail-shop-link" href="https://www.amazon.com/" target="_blank" rel="noopener noreferrer">Shop Now on Amazon</a>
  </div>
`;
document.body.appendChild(detailModal);

const closeDetailModal = () => {
  detailModal.classList.remove('open');
  detailModal.setAttribute('aria-hidden', 'true');
};

detailModal.addEventListener('click', (event) => {
  if (event.target === detailModal || event.target.classList.contains('product-detail-close')) {
    closeDetailModal();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && detailModal.classList.contains('open')) {
    closeDetailModal();
  }
});

const openProductDetails = (card) => {
  const image = card.querySelector('img');
  const title = card.querySelector('h3')?.textContent?.trim() || 'Product';
  const description = card.querySelector('p')?.textContent?.trim() || 'Affiliate product preview.';
  const priceLine = Array.from(card.querySelectorAll('p')).find((line) => line.textContent.includes('Price'))?.textContent?.trim() || 'Price: Visit Amazon';
  const shopLink = card.querySelector('a[href]')?.getAttribute('href') || 'https://www.amazon.com/';

  detailModal.querySelector('img').src = image?.src || '';
  detailModal.querySelector('img').alt = image?.alt || `${title} image`;
  detailModal.querySelector('h3').textContent = title;
  detailModal.querySelector('.detail-description').textContent = description;
  detailModal.querySelector('.detail-price').textContent = priceLine;
  detailModal.querySelector('.detail-shop-link').href = shopLink;

  detailModal.classList.add('open');
  detailModal.setAttribute('aria-hidden', 'false');
};

const interactiveCards = document.querySelectorAll('.product-card, .product-list-card, .you-may-love-card');
interactiveCards.forEach((card) => {
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', 'Open product details');

  card.addEventListener('click', (event) => {
    if (event.target.closest('a, button')) return;
    openProductDetails(card);
  });

  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openProductDetails(card);
    }
  });
});
