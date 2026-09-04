(() => {
  "use strict";
  /* ==========================================================================
     HELPERS
     ========================================================================== */
  const $ = (selector, scope = document) =>
    scope.querySelector(selector);
  const $$ = (selector, scope = document) =>
    [...scope.querySelectorAll(selector)];
  const reducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  /* ==========================================================================
     THEME
     Saved preference > system preference
     ========================================================================== */
  const root = document.documentElement;
  const themeToggle = $("#themeToggle");
  const themeIcon = $(".theme-icon");
  const themeLabel = $(".theme-label");
  function syncThemeButton() {
    const dark =
      root.dataset.theme === "dark";
    themeIcon.textContent =
      dark ? "☼" : "☾";
    themeLabel.textContent =
      dark ? "Light" : "Dark";
    themeToggle.setAttribute(
      "aria-label",
      dark
        ? "Switch to light mode"
        : "Switch to dark mode"
    );
  }
  themeToggle?.addEventListener(
    "click",
    () => {
      const next =
        root.dataset.theme === "dark"
          ? "light"
          : "dark";
      root.dataset.theme = next;
      localStorage.setItem(
        "theme",
        next
      );
      syncThemeButton();
    }
  );
  syncThemeButton();
  /* ==========================================================================
     MOBILE NAVIGATION
     ========================================================================== */
  const menuToggle =
    $("#menuToggle");
  const siteNav =
    $("#siteNav");
  function closeMenu() {
    siteNav?.classList.remove("open");
    menuToggle?.setAttribute(
      "aria-expanded",
      "false"
    );
    document.body.classList.remove(
      "menu-open"
    );
  }
  menuToggle?.addEventListener(
    "click",
    () => {
      const open =
        siteNav.classList.toggle("open");
      menuToggle.setAttribute(
        "aria-expanded",
        String(open)
      );
      document.body.classList.toggle(
        "menu-open",
        open
      );
    }
  );
  $$(".nav-link").forEach(
    link => {
      link.addEventListener(
        "click",
        closeMenu
      );
    }
  );
  window.addEventListener(
    "resize",
    () => {
      if (window.innerWidth > 720) {
        closeMenu();
      }
    },
    { passive: true }
  );
  /* ==========================================================================
     SCROLL PROGRESS + HEADER
     ========================================================================== */
  const header =
    $("#header");
  const progress =
    $("#scrollProgress");
  function updateScrollUI() {
    const scrollable =
      document.documentElement.scrollHeight -
      window.innerHeight;
    const ratio =
      scrollable > 0
        ? window.scrollY / scrollable
        : 0;
    progress.style.width =
      `${Math.min(100, ratio * 100)}%`;
    header.classList.toggle(
      "scrolled",
      window.scrollY > 10
    );
  }
  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(
          () => {
            updateScrollUI();
            ticking = false;
          }
        );
        ticking = true;
      }
    },
    { passive: true }
  );
  updateScrollUI();
  /* ==========================================================================
     SCROLL SPY
     ========================================================================== */
  const sections =
    $$("main section[id]");
  const navLinks =
    $$(".nav-link");
  if ("IntersectionObserver" in window) {
    const spy =
      new IntersectionObserver(
        entries => {
          entries.forEach(
            entry => {
              if (!entry.isIntersecting)
                return;
              navLinks.forEach(
                link => {
                  link.classList.toggle(
                    "active",
                    link.getAttribute("href") ===
                      `#${entry.target.id}`
                  );
                }
              );
            }
          );
        },
        {
          rootMargin:
            "-35% 0px -55% 0px",
          threshold: 0
        }
      );
    sections.forEach(
      section =>
        spy.observe(section)
    );
  }
  /* ==========================================================================
     SCROLL REVEAL
     ========================================================================== */
  const revealItems =
    $$(".reveal");
  if (
    reducedMotion ||
    !("IntersectionObserver" in window)
  ) {
    revealItems.forEach(
      element =>
        element.classList.add("visible")
    );
  } else {
    const revealObserver =
      new IntersectionObserver(
        entries => {
          entries.forEach(
            entry => {
              if (
                entry.isIntersecting
              ) {
                entry.target.classList.add(
                  "visible"
                );
                revealObserver.unobserve(
                  entry.target
                );
              }
            }
          );
        },
        {
          threshold: 0.12,
          rootMargin:
            "0px 0px -40px"
        }
      );
    revealItems.forEach(
      element =>
        revealObserver.observe(element)
    );
  }
  /* ==========================================================================
     PROJECT FILTERING
     ========================================================================== */
  const filters =
    $$(".filter");
  const projects =
    $$(".project-card");
  filters.forEach(
    button => {
      button.addEventListener(
        "click",
        () => {
          const filter =
            button.dataset.filter;
          filters.forEach(
            item => {
              item.classList.toggle(
                "active",
                item === button
              );
            }
          );
          projects.forEach(
            card => {
              const match =
                filter === "all" ||
                card.dataset.category ===
                  filter;
              card.classList.toggle(
                "hidden",
                !match
              );
            }
          );
        }
      );
    }
  );
  /* ==========================================================================
     LIGHTWEIGHT 3D TILT
     Disabled on touch devices and reduced motion.
     ========================================================================== */
  const canHover =
    window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;
  if (
    canHover &&
    !reducedMotion
  ) {
    $$(".tilt-card").forEach(
      card => {
        card.addEventListener(
          "pointermove",
          event => {
            const rect =
              card.getBoundingClientRect();
            const x =
              (event.clientX - rect.left) /
              rect.width;
            const y =
              (event.clientY - rect.top) /
              rect.height;
            const rotateY =
              (x - 0.5) * 8;
            const rotateX =
              (y - 0.5) * -8;
            card.style.transform =
              `perspective(900px)
               rotateX(${rotateX}deg)
               rotateY(${rotateY}deg)
               translateY(-4px)`;
          }
        );
        card.addEventListener(
          "pointerleave",
          () => {
            card.style.transform = "";
          }
        );
      }
    );
  }
  /* ==========================================================================
     MAGNETIC BUTTONS + CUSTOM CURSOR
     ========================================================================== */
  if (
    canHover &&
    !reducedMotion
  ) {
    const dot =
      $(".cursor-dot");
    const ring =
      $(".cursor-ring");
    document.body.classList.add(
      "cursor-ready"
    );
    window.addEventListener(
      "pointermove",
      event => {
        dot.style.left =
          `${event.clientX}px`;
        dot.style.top =
          `${event.clientY}px`;
        ring.style.left =
          `${event.clientX}px`;
        ring.style.top =
          `${event.clientY}px`;
      },
      { passive: true }
    );
    $$(".magnetic").forEach(
      element => {
        element.addEventListener(
          "pointermove",
          event => {
            const rect =
              element.getBoundingClientRect();
            const x =
              (
                event.clientX -
                rect.left -
                rect.width / 2
              ) * 0.16;
            const y =
              (
                event.clientY -
                rect.top -
                rect.height / 2
              ) * 0.16;
            element.style.transform =
              `translate(${x}px, ${y}px)`;
            document.body.classList.add(
              "cursor-hover"
            );
          }
        );
        element.addEventListener(
          "pointerleave",
          () => {
            element.style.transform = "";
            document.body.classList.remove(
              "cursor-hover"
            );
          }
        );
      }
    );
  }
  /* ==========================================================================
     CONTACT FORM
     Uses mailto — no backend required.
     ========================================================================== */
  const form =
    $("#contactForm");
  const toast =
    $("#toast");
  let toastTimer;
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer =
      setTimeout(
        () => {
          toast.classList.remove(
            "show"
          );
        },
        4200
      );
  }
  function setError(
    input,
    message
  ) {
    const error =
      $(
        `[data-error-for="${input.id}"]`
      );
    input.classList.toggle(
      "invalid",
      Boolean(message)
    );
    if (error) {
      error.textContent = message;
    }
  }
  function validateForm() {
    const name =
      $("#name");
    const email =
      $("#email");
    const message =
      $("#message");
    let valid = true;
    /* NAME */
    if (
      name.value.trim().length < 2
    ) {
      setError(
        name,
        "Please enter your name."
      );
      valid = false;
    } else {
      setError(name, "");
    }
    /* EMAIL */
    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(
          email.value.trim()
        )
    ) {
      setError(
        email,
        "Please enter a valid email."
      );
      valid = false;
    } else {
      setError(email, "");
    }
    /* MESSAGE */
    if (
      message.value.trim().length < 10
    ) {
      setError(
        message,
        "Please add a little more detail."
      );
      valid = false;
    } else {
      setError(message, "");
    }
    return valid;
  }
  form?.addEventListener(
    "submit",
    event => {
      event.preventDefault();
      if (!validateForm()) {
        showToast(
          "Please fix the highlighted fields."
        );
        return;
      }
      const name =
        $("#name")
          .value
          .trim();
      const email =
        $("#email")
          .value
          .trim();
      const message =
        $("#message")
          .value
          .trim();
      const subject =
        encodeURIComponent(
          `Portfolio enquiry from ${name}`
        );
      const body =
        encodeURIComponent(
          `Hi Ayomide,
${message}
Name: ${name}
Email: ${email}`
        );
      showToast(
        "Opening your email app…"
      );
      window.location.href =
        `mailto:addysam@yahoo.com?subject=${subject}&body=${body}`;
    }
  );
  /* Validate again while editing invalid fields */
  $(
    "#contactForm input, #contactForm textarea"
  ).forEach(
    input => {
      input.addEventListener(
        "input",
        () => {
          if (
            input.classList.contains(
              "invalid"
            )
          ) {
            validateForm();
          }
        }
      );
    }
  );
  /* ==========================================================================
     FOOTER YEAR
     ========================================================================== */
  $("#year").textContent =
    new Date().getFullYear();
})();