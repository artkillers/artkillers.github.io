
  // Tunggu sampai semua konten halaman dimuat
  document.body.classList.add("lock-scroll");
  window.addEventListener("load", function() {
    const preload = document.getElementById("preload");
    document.body.classList.remove("lock-scroll");
    preload.classList.add("hide"); 
  });

// ================ VARIABEL PRODUK ================= //

let allItems = [];
let currentCategory = 'product-1';
let currentIndex = 0;

const productScroll = document.getElementById('productScroll');
const buttons = document.querySelectorAll('.shop-categories button');
const cartList = document.getElementById('cart-list');
const emptyCartMsg = document.getElementById('empty-cart');
const cartTotal = document.getElementById('cart-total');
const whatsappLink = document.getElementById('whatsapp-link');
const clearCartBtn = document.getElementById('clear-cart');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');


// ======== LOAD PRODUK DARI JSON ======== //


async function loadProducts() {
  try {
    const res = await fetch("library/products.json");
    const data = await res.json();
    renderProducts(data);
  } catch (err) {
    console.error("Gagal ambil data produk:", err);
  }
}


// ======== RENDER PRODUK ======== //


function renderProducts(data) {
  productScroll.innerHTML = '';
  data.forEach(product => {
    const div = document.createElement('div');
    div.className = 'product-item';
    div.dataset.category = product.category;
    div.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>IDR ${product.price.toLocaleString('id-ID')}</p>
      <a href="#" class="order-btn button add-to-cart-btn">Add to Cart</a>
    `;
    productScroll.appendChild(div);
  });

  allItems = Array.from(document.querySelectorAll('.product-item'));
  setupAddToCartButtons();
  showCurrentItem();
}


// ======== TAMPIL ITEM KATEGORI ======== //


function showCurrentItem() {
  const filtered = allItems.filter(item => item.dataset.category === currentCategory);
  allItems.forEach(item => item.style.display = 'none');
  if (filtered[currentIndex]) filtered[currentIndex].style.display = 'flex';

  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex >= filtered.length - 1;
}


// ======== PENCARIAN PRODUK ======== //


function searchItems() {
  const input = document.getElementById('searchInput').value.toLowerCase();
  allItems.forEach(item => {
    const name = item.querySelector('h3').textContent.toLowerCase();
    item.style.display = name.includes(input) ? 'flex' : 'none';
  });
}

// ======== KERANJANG BELANJA ======== //


function setupAddToCartButtons() {
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const product = btn.closest('.product-item');
      const name = product.querySelector('h3').textContent;
      const price = parseInt(product.querySelector('p').textContent.replace(/\D/g, ''));

      const li = document.createElement('li');
      li.setAttribute('data-name', name);
      li.setAttribute('data-price', price);
      li.innerHTML = `${name} - IDR ${price.toLocaleString('id-ID')} <button class="remove-btn button">Cancel</button>`;

      li.querySelector('.remove-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        li.remove();
        updateCart();
      });

      cartList.appendChild(li);
      updateCart();
    });
  });
}

function updateCartBadge() {
  const cartItems = document.querySelectorAll('#cart-list li').length;
  const cartBadge = document.getElementById('cartBadge');

  if (cartItems > 0) {
    cartBadge.textContent = cartItems;
    cartBadge.style.display = 'inline-block';
  } else {
    cartBadge.style.display = 'none';
  }
}


// ======== LOKASI USER ======== //


window.userLocation = null;

function updateLocation() {
  if (!navigator.geolocation) {
    setLocationText('Geolocation tidak didukung browser');
    return;
  }

  navigator.geolocation.getCurrentPosition(position => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
      .then(res => res.json())
      .then(data => {
        const addr = data.address || {};

        const elCountry = document.getElementById('user-country');
        if(elCountry) elCountry.textContent = addr.country || '-';

        const elRegion = document.getElementById('user-region');
        if(elRegion) elRegion.textContent = addr.state || '-';

        const elCity = document.getElementById('user-city');
        if(elCity) elCity.textContent = addr.city || addr.town || addr.village || '-';

        const elSuburb = document.getElementById('user-suburb');
        if(elSuburb) elSuburb.textContent = addr.suburb || addr.neighbourhood || '-';

        window.userLocation = {
          country: addr.country || '-',
          region: addr.state || '-',
          city: addr.city || addr.town || addr.village || '-',
          suburb: addr.suburb || addr.neighbourhood || '-',
        };

        updateCart();
      })
      .catch(() => {
        setLocationText('Gagal mengambil data lokasi');
      });
  }, () => {
    setLocationText('Not Found 404');
  }, { timeout: 10000 });
}

function setLocationText(msg) {
  ['user-country', 'user-region', 'user-city', 'user-suburb'].forEach(id => {
    const el = document.getElementById(id);
    if(el) el.textContent = msg;
  });
}


// ======== UPDATE CART ======== //


function updateCart() {
  const cartItems = cartList.querySelectorAll('li');
  let total = 0;
  const orderText = [];

  cartItems.forEach(item => {
    const name = item.getAttribute('data-name');
    const price = parseInt(item.getAttribute('data-price'));
    total += price;
    orderText.push(`- ${name} (IDR ${price.toLocaleString('id-ID')})`);
  });

  cartTotal.textContent = `Total : IDR ${total.toLocaleString('id-ID')}`;
  emptyCartMsg.style.display = cartItems.length ? 'none' : 'block';

  let locationText = '';
  if (window.userLocation) {
    const loc = window.userLocation;
    locationText = `\n\nLokasi Pengiriman:\n${loc.suburb}, ${loc.city}, ${loc.region}, ${loc.country}`;
  }

  if (cartItems.length > 0) {
    const message = encodeURIComponent(`Halo, saya ingin memesan:\n\n${orderText.join('\n')}${locationText}\n\nTotal : IDR ${total.toLocaleString('id-ID')}`);
    whatsappLink.href = `https://wa.me/+6282343191193?text=${message}`;
  } else {
    whatsappLink.href = '#';
  }

  updateCartBadge();
}


// ======== EVENT LISTENER ======== //


buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    currentCategory = btn.dataset.category;
    currentIndex = 0;
    showCurrentItem();
  });
});

prevBtn.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    showCurrentItem();
  }
});

nextBtn.addEventListener('click', () => {
  const filtered = allItems.filter(item => item.dataset.category === currentCategory);
  if (currentIndex < filtered.length - 1) {
    currentIndex++;
    showCurrentItem();
  }
});

whatsappLink.addEventListener('click', function (e) {
  const cartItems = cartList.querySelectorAll('li');
  if (cartItems.length === 0) {
    e.preventDefault();
    alert('Daftar belanja masih kosong!');
  }
});

clearCartBtn.addEventListener('click', () => {
  const cartItems = cartList.querySelectorAll('li');
  if (cartItems.length === 0) {
    alert('Keranjang sudah kosong!');
    return;
  }
  cartList.innerHTML = '';
  updateCart();
});

// ======== PANEL KERANJANG ======== //


const cartPanel = document.getElementById('cartPanel');
const openCartBtn = document.getElementById('openCart');
const closeCartBtn = document.getElementById('closeCart');

function toggleCart() {
  cartPanel.classList.toggle("hidden");
}

if (openCartBtn) {
  openCartBtn.addEventListener('click', () => {
    cartPanel.classList.remove('hidden');
  });
}

if (closeCartBtn) {
  closeCartBtn.addEventListener('click', () => {
    cartPanel.classList.add('hidden');
  });
}

document.addEventListener("click", (e) => {
  const shopBtn = document.querySelector(".cart-btn");
  if (!cartPanel.contains(e.target) && !shopBtn.contains(e.target)) {
    cartPanel.classList.add("hidden");
  }
});

document.getElementById('searchBtn').addEventListener('click', searchItems);
document.getElementById('cartBtn').addEventListener('click', toggleCart);

// ======== INIT ======== //

window.onload = () => {
  updateLocation();
  loadProducts(); 
};


// ============================================= //


const menuPanel = document.getElementById('menuPanel');
const closeMenu = document.getElementById('closeMenu');
const openMenuBtn = document.getElementById('openMenu');

if (closeMenu) {
  closeMenu.addEventListener('click', () => {
    menuPanel.classList.add('hidden');
  });
}

if (openMenuBtn) {
  openMenuBtn.addEventListener('click', () => {
    menuPanel.classList.remove('hidden');
  });
}

function toggleMenu() {
  menuPanel.classList.toggle("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
  // Klik menu untuk scroll
  document.querySelectorAll(".menu-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const targetSelector = btn.getAttribute("data-target");
      const targetElement = document.querySelector(targetSelector);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      menuPanel.classList.add("hidden");
    });
  });

  // Tutup menu jika klik di luar
  document.addEventListener("click", (event) => {
    const hamburger = document.querySelector(".hamburger");
    if (!menuPanel.contains(event.target) && !hamburger.contains(event.target)) {
      menuPanel.classList.add("hidden");
    }
  });
});

const menuButtons = document.querySelectorAll('.menu-btn');
const sections = document.querySelectorAll('section');

menuButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const targetSelector = btn.getAttribute('data-target'); 
    sections.forEach(sec => {
      if ('#' + sec.id === targetSelector) {
        sec.classList.remove('hidden');  
      } else {
        sec.classList.add('hidden');   
      }
    });
  setTimeout(() => {
  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
}, 30);
  });
});


// ============================================= //


document.addEventListener('DOMContentLoaded', () => {
   const tabItems = document.querySelectorAll('.tab-item');
   const tabContents = document.querySelectorAll('.tab-content');

   tabItems.forEach(item => {
     item.addEventListener('click', () => {
        const target = document.querySelector(item.dataset.target);

        tabItems.forEach(i => i.classList.remove('active'));
        tabContents.forEach(tc => tc.classList.remove('active'));

        item.classList.add('active');
        target.classList.add('active');
      });
    });
  });


// ============================================= //


if (typeof Typed !== 'undefined') {
  new Typed("#typed", {
    strings: ["“ System ”","“ Connection ”","“ Network ”","“ Controller ”"],
    typeSpeed: 60,
    backSpeed: 40,
    backDelay: 1500,
    loop: true,
  });
}


// ============================================= //


const form = document.getElementById("contactForm");
if (form) {
  form.addEventListener("submit", function(e) {
    e.preventDefault();
    const nama = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const subjek = document.getElementById("subject").value;
    const pesan = document.getElementById("message").value;
    alert(`Thank you, ${nama}!\nYour message has been sent.\n\nEmail : ${email}\nSubject : ${subjek}\nMessage : ${pesan}`);
    form.reset();
  });
}


// ============================================= //


document.querySelectorAll('.button').forEach(el => {
  el.addEventListener('mousedown', () => el.classList.add('pressed'));
  el.addEventListener('mouseup', () => el.classList.remove('pressed'));
  el.addEventListener('mouseleave', () => el.classList.remove('pressed'));
});

document.addEventListener("contextmenu", e => e.preventDefault());
document.addEventListener("selectstart", e => e.preventDefault());
document.addEventListener("copy", e => e.preventDefault());
document.querySelector('.typed-text').setAttribute('translate', 'no');
