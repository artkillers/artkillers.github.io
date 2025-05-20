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