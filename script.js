// === 1. Typed.js Effect ===
const typed = new Typed("#typed", {
  strings: ["Creative Developer", "Enthusiast Digital", "Code Alchemist", "Tech Explorer"],
  typeSpeed: 60,
  backSpeed: 40,
  backDelay: 1500,
  loop: true,
});

// === 2. Tab Navigation Logic ===
const tabItems = document.querySelectorAll(".tab-item");
const tabSections = document.querySelectorAll(".tab-section");

tabItems.forEach(item => {
  item.addEventListener("click", () => {
    // Remove active class from all tabs and sections
    tabItems.forEach(i => i.classList.remove("active"));
    tabSections.forEach(section => section.classList.remove("active"));

    // Add active to clicked tab and corresponding section
    item.classList.add("active");
    document.getElementById(item.dataset.target).classList.add("active");

    // Run skill animation if 'skills' tab
    if (item.dataset.target === "skills") {
      animateSkills();
    }
  });
});

// === 3. Liquid Skill Fill Animation ===
function animateSkills() {
  const skills = document.querySelectorAll(".skill");

  skills.forEach(skill => {
    const percent = skill.getAttribute("data-percent");
    const liquid = skill.querySelector(".liquid-fill");
    const label = skill.querySelector(".percentage");

    // Reset
    liquid.style.height = "0%";
    label.innerText = "0%";

    // Animate liquid fill
    setTimeout(() => {
      liquid.style.height = percent + "%";
    }, 100);

    // Animate number counter
    let current = 0;
    const interval = setInterval(() => {
      if (current < percent) {
        current++;
        label.innerText = current + "%";
      } else {
        clearInterval(interval);
      }
    }, 20);
  });
}

// Optional: auto-run animation if Skills tab is active on load
  window.addEventListener("DOMContentLoaded", () => {
  const activeTab = document.querySelector(".tab-item.active");
  if (activeTab && activeTab.dataset.target === "skills") {
    animateSkills();
  }
  });

  function playMusic() {
  const iframe = document.getElementById('yt-player');
  if (!iframe.src) {  // agar tidak reload berulang kali
  iframe.src = "https://www.youtube.com/embed/hxPzWZ7Z25k?autoplay=1&loop=1&playlist=hxPzWZ7Z25k";
    alert("Play Music Now!");
  }
  }
  
  const preloader = document.getElementById('preloader');
  const MIN_DISPLAY_TIME = 5000; // minimal tampil 5 detik
  const startTime = Date.now();

  // Kunci scroll saat preloader aktif
  document.body.style.overflow = 'hidden';

  function hidePreloader() {
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, MIN_DISPLAY_TIME - elapsed);

    setTimeout(() => {
      preloader.style.transition = 'opacity 0.5s ease';
      preloader.style.opacity = 0;
      setTimeout(() => {
        preloader.style.display = 'none';
        // Aktifkan kembali scroll
        document.body.style.overflow = 'auto';
      }, 500);
    }, remaining);
  }

  function imagesLoaded() {
    const images = document.images;
    let loadedCount = 0;
    const total = images.length;

    if (total === 0) return hidePreloader();

    for (let img of images) {
      if (img.complete) increment();
      else img.addEventListener('load', increment);
    }

    function increment() {
      loadedCount++;
      if (loadedCount === total) hidePreloader();
    }
  }
  window.addEventListener('load', imagesLoaded);
 
    const blurOverlay = document.createElement('div');
    blurOverlay.style.position = 'fixed';
    blurOverlay.style.top = 0;
    blurOverlay.style.left = 0;
    blurOverlay.style.width = '100%';
    blurOverlay.style.height = '100%';
    blurOverlay.style.zIndex = 9999;
    blurOverlay.style.backdropFilter = 'blur(10px)';
    blurOverlay.style.display = 'none';
    document.body.appendChild(blurOverlay);

    document.addEventListener('keydown', function(e) {
    if (e.key === 'PrintScreen') {
    blurOverlay.style.display = 'block';
    setTimeout(() => {
      blurOverlay.style.display = 'none';
    }, 3000); 
    }
    });
    document.addEventListener('contextmenu', (e) => e.preventDefault());    
    document.addEventListener('selectstart', (e) => e.preventDefault());
    document.addEventListener('copy', (e) => e.preventDefault());    
    document.addEventListener('keydown', function(e) {
    if (e.key === 'PrintScreen') {
    alert('Not Print Screen');
    navigator.clipboard.writeText(' ');
    }
    });
