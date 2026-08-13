const body = document.body;
const themeToggle = document.getElementById("themeToggle");
const hamburger = document.getElementById("hamburger");
const nav = document.getElementById("nav");
const heroTagline = document.getElementById("heroTagline");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const currentYear = document.getElementById("currentYear");

const recipientEmail = "addysam@yahoo.com";

const taglineText =
  "I build responsive, accessible, and user-friendly web experiences with HTML, CSS, JavaScript, React, Next.js, and Tailwind CSS.";

let taglineIndex = 0;

function typeTagline() {
  if (!heroTagline) return;

  heroTagline.textContent = taglineText.slice(0, taglineIndex);
  taglineIndex += 1;

  if (taglineIndex <= taglineText.length) {
    window.setTimeout(typeTagline, 28);
  }
}

function updateThemeButton() {
  if (!themeToggle) return;

  const isDark = body.classList.contains("dark-theme");

  themeToggle.textContent = isDark ? "☀️ Light" : "🌙 Dark";

  themeToggle.setAttribute(
    "aria-label",
    isDark ? "Switch to light mode" : "Switch to dark mode"
  );
}

function loadSavedTheme() {
  const savedTheme = localStorage.getItem("portfolio-theme");

  if (savedTheme === "dark") {
    body.classList.add("dark-theme");
  }

  updateThemeButton();
}

function toggleTheme() {
  body.classList.toggle("dark-theme");

  const selectedTheme = body.classList.contains("dark-theme")
    ? "dark"
    : "light";

  localStorage.setItem("portfolio-theme", selectedTheme);
  updateThemeButton();
}

function toggleMobileMenu() {
  if (!nav || !hamburger) return;

  const isOpen = nav.classList.toggle("open");

  body.classList.toggle("menu-open", isOpen);

  hamburger.setAttribute("aria-expanded", String(isOpen));

  hamburger.setAttribute(
    "aria-label",
    isOpen ? "Close navigation menu" : "Open navigation menu"
  );

  hamburger.textContent = isOpen ? "×" : "☰";
}

function closeMobileMenu() {
  if (!nav || !hamburger) return;

  nav.classList.remove("open");
  body.classList.remove("menu-open");

  hamburger.setAttribute("aria-expanded", "false");
  hamburger.setAttribute("aria-label", "Open navigation menu");
  hamburger.textContent = "☰";
}

function setupProjectFilters() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedFilter = button.dataset.filter;

      filterButtons.forEach((filterButton) => {
        filterButton.classList.remove("active");
      });

      button.classList.add("active");

      projectCards.forEach((card) => {
        const cardCategory = card.dataset.category;

        const shouldShow =
          selectedFilter === "all" ||
          selectedFilter === cardCategory;

        card.classList.toggle("is-hidden", !shouldShow);
      });
    });
  });
}

function setupRevealAnimation() {
  const revealElements = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });

    return;
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("visible");
        currentObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
    }
  );

  revealElements.forEach((element) => {
    observer.observe(element);
  });
}

function setupProgressBars() {
  const progressBars = document.querySelectorAll(".progress-fill");

  if (!("IntersectionObserver" in window)) {
    progressBars.forEach((bar) => {
      bar.style.width = `${bar.dataset.progress}%`;
    });

    return;
  }

  const progressObserver = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const progressBar = entry.target;

        progressBar.style.width = `${progressBar.dataset.progress}%`;

        currentObserver.unobserve(progressBar);
      });
    },
    {
      threshold: 0.5,
    }
  );

  progressBars.forEach((bar) => {
    progressObserver.observe(bar);
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFormStatus(message, type) {
  if (!formStatus) return;

  formStatus.textContent = message;
  formStatus.className = `form-status ${type}`;
}

function createMailtoUrl(name, email, message) {
  const subject = `Portfolio contact from ${name}`;

  const emailBody = [
    `Name: ${name}`,
    `Email: ${email}`,
    "",
    "Message:",
    message,
    "",
    "---",
    "Sent from Adeniyi Ayomide's portfolio website",
  ].join("\n");

  return (
    `mailto:${recipientEmail}` +
    `?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(emailBody)}`
  );
}

function setupContactForm() {
  if (!contactForm) return;

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);

    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();

    if (!name || !email || !message) {
      showFormStatus(
        "Please complete your name, email, and message.",
        "error"
      );

      return;
    }

    if (!isValidEmail(email)) {
      showFormStatus(
        "Please enter a valid email address.",
        "error"
      );

      return;
    }

    const mailtoUrl = createMailtoUrl(name, email, message);

    showFormStatus(
      "Opening your email application. Click Send to deliver your message.",
      "success"
    );

    window.location.href = mailtoUrl;
  });
}

function updateCurrentYear() {
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }
}

themeToggle?.addEventListener("click", toggleTheme);
hamburger?.addEventListener("click", toggleMobileMenu);

document.querySelectorAll(".site-nav a").forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 720) {
    closeMobileMenu();
  }
});

loadSavedTheme();
typeTagline();
setupProjectFilters();
setupRevealAnimation();
setupProgressBars();
setupContactForm();
updateCurrentYear();