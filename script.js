(() => {
  "use strict";

  /* =========================
     HELPERS
  ========================== */

  const $ = (selector, root = document) =>
    root.querySelector(selector);

  const $$ = (selector, root = document) =>
    [...root.querySelectorAll(selector)];

  const root = document.documentElement;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const canHover =
    window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches &&
    !reducedMotion;

  /* =========================
     THEME
  ========================== */

  const themeToggle = $("#themeToggle");
  const themeIcon = $("#themeIcon");
  const themeText = $(".theme-text");

  function syncTheme() {
    const isDark =
      root.dataset.theme === "dark";

    if (themeIcon) {
      themeIcon.textContent =
        isDark ? "☼" : "☾";
    }

    if (themeText) {
      themeText.textContent =
        isDark ? "Light" : "Dark";
    }

    themeToggle?.setAttribute(
      "aria-label",
      isDark
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

      try {
        localStorage.setItem(
          "theme",
          next
        );
      } catch {
        // Ignore storage failures.
      }

      syncTheme();
    }
  );

  syncTheme();

  /* =========================
     MOBILE NAVIGATION
  ========================== */

  const menuToggle = $("#menuToggle");
  const siteNav = $("#siteNav");

  function closeMenu() {
    siteNav?.classList.remove("open");

    menuToggle?.setAttribute(
      "aria-expanded",
      "false"
    );

    menuToggle?.setAttribute(
      "aria-label",
      "Open menu"
    );

    document.body.classList.remove(
      "menu-open"
    );
  }

  menuToggle?.addEventListener(
    "click",
    () => {
      const isOpen =
        siteNav.classList.toggle(
          "open"
        );

      menuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
      );

      menuToggle.setAttribute(
        "aria-label",
        isOpen
          ? "Close menu"
          : "Open menu"
      );

      document.body.classList.toggle(
        "menu-open",
        isOpen
      );
    }
  );

  $$(".nav-link").forEach(
    (link) => {
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

  /* =========================
     SCROLL PROGRESS
  ========================== */

  const header = $("#header");
  const progress = $("#scrollProgress");

  let rafId = 0;

  function updateScrollUI() {
    const scrollable = Math.max(
      document.documentElement.scrollHeight -
        window.innerHeight,
      1
    );

    const percentage =
      (window.scrollY / scrollable) * 100;

    if (progress) {
      progress.style.width =
        `${Math.min(100, percentage)}%`;
    }

    header?.classList.toggle(
      "scrolled",
      window.scrollY > 10
    );

    rafId = 0;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!rafId) {
        rafId =
          requestAnimationFrame(
            updateScrollUI
          );
      }
    },
    { passive: true }
  );

  updateScrollUI();

  /* =========================
     SCROLL SPY
  ========================== */

  const navLinks = $$(".nav-link");

  const sections =
    $$("main section[id]");

  if (
    "IntersectionObserver" in window
  ) {
    const spy =
      new IntersectionObserver(
        (entries) => {
          entries.forEach(
            (entry) => {
              if (
                !entry.isIntersecting
              ) {
                return;
              }

              navLinks.forEach(
                (link) => {
                  link.classList.toggle(
                    "active",
                    link.getAttribute(
                      "href"
                    ) ===
                      `#${entry.target.id}`
                  );
                }
              );
            }
          );
        },
        {
          rootMargin:
            "-42% 0px -50% 0px",

          threshold: 0
        }
      );

    sections.forEach(
      (section) =>
        spy.observe(section)
    );
  }

  /* =========================
     SCROLL REVEAL
  ========================== */

  const revealItems =
    $$(".reveal");

  if (
    reducedMotion ||
    !("IntersectionObserver" in window)
  ) {
    revealItems.forEach(
      (element) =>
        element.classList.add(
          "visible"
        )
    );
  } else {
    const observer =
      new IntersectionObserver(
        (entries) => {
          entries.forEach(
            (entry) => {
              if (
                !entry.isIntersecting
              ) {
                return;
              }

              entry.target.classList.add(
                "visible"
              );

              observer.unobserve(
                entry.target
              );
            }
          );
        },
        {
          threshold: 0.12,

          rootMargin:
            "0px 0px -35px"
        }
      );

    revealItems.forEach(
      (element) =>
        observer.observe(element)
    );
  }

  /* =========================
     PROJECT FILTERING
  ========================== */

  const filters =
    $$(".filter");

  const projects =
    $$(".project-card");

  filters.forEach(
    (button) => {
      button.addEventListener(
        "click",
        () => {
          const filter =
            button.dataset.filter;

          filters.forEach(
            (item) => {
              item.classList.toggle(
                "active",
                item === button
              );
            }
          );

          projects.forEach(
            (card) => {
              const shouldHide =
                filter !== "all" &&
                card.dataset.category !==
                  filter;

              card.classList.toggle(
                "is-hidden",
                shouldHide
              );
            }
          );
        }
      );
    }
  );

  /* =========================
     LIGHTWEIGHT 3D TILT
  ========================== */

  if (canHover) {
    $$(".tilt-card").forEach(
      (card) => {
        card.addEventListener(
          "pointermove",
          (event) => {
            const rect =
              card.getBoundingClientRect();

            const x =
              (event.clientX -
                rect.left) /
                rect.width -
              0.5;

            const y =
              (event.clientY -
                rect.top) /
                rect.height -
              0.5;

            const rotateX =
              (-y * 5).toFixed(2);

            const rotateY =
              (x * 5).toFixed(2);

            card.style.transform =
              `perspective(1000px)
               rotateX(${rotateX}deg)
               rotateY(${rotateY}deg)
               translateY(-4px)`;
          }
        );

        card.addEventListener(
          "pointerleave",
          () => {
            card.style.transform =
              "";
          }
        );
      }
    );
  }

  /* =========================
     CUSTOM CURSOR
  ========================== */

  if (canHover) {
    const dot =
      $(".cursor-dot");

    const ring =
      $(".cursor-ring");

    document.body.classList.add(
      "cursor-ready"
    );

    let pointerX = -100;
    let pointerY = -100;

    let ringX = -100;
    let ringY = -100;

    window.addEventListener(
      "pointermove",
      (event) => {
        pointerX =
          event.clientX;

        pointerY =
          event.clientY;

        if (dot) {
          dot.style.left =
            `${pointerX}px`;

          dot.style.top =
            `${pointerY}px`;
        }
      },
      { passive: true }
    );

    const cursorLoop = () => {
      ringX +=
        (pointerX - ringX) *
        0.16;

      ringY +=
        (pointerY - ringY) *
        0.16;

      if (ring) {
        ring.style.left =
          `${ringX}px`;

        ring.style.top =
          `${ringY}px`;
      }

      requestAnimationFrame(
        cursorLoop
      );
    };

    cursorLoop();

    const showCursor = () => {
      if (dot) {
        dot.style.opacity = "1";
      }

      if (ring) {
        ring.style.opacity = "1";
      }
    };

    document.addEventListener(
      "pointerover",
      showCursor,
      { once: true }
    );

    /* =========================
       MAGNETIC ELEMENTS
    ========================== */

    $$(".magnetic").forEach(
      (element) => {
        element.addEventListener(
          "pointermove",
          (event) => {
            const rect =
              element.getBoundingClientRect();

            const moveX =
              (event.clientX -
                rect.left -
                rect.width / 2) *
              0.14;

            const moveY =
              (event.clientY -
                rect.top -
                rect.height / 2) *
              0.14;

            element.style.transform =
              `translate(
                ${moveX.toFixed(1)}px,
                ${moveY.toFixed(1)}px
              )`;
          }
        );

        element.addEventListener(
          "pointerleave",
          () => {
            element.style.transform =
              "";
          }
        );

        element.addEventListener(
          "mouseenter",
          () => {
            if (!ring) return;

            ring.style.width = "48px";

            ring.style.height =
              "48px";
          }
        );

        element.addEventListener(
          "mouseleave",
          () => {
            if (!ring) return;

            ring.style.width = "32px";

            ring.style.height =
              "32px";
          }
        );
      }
    );
  }

  /* =========================
     CONTACT FORM
  ========================== */

  const form =
    $("#contactForm");

  const toast =
    $("#toast");

  let toastTimer;

  function showToast(message) {
    if (!toast) return;

    clearTimeout(toastTimer);

    toast.textContent =
      message;

    toast.classList.add(
      "show"
    );

    toastTimer = setTimeout(
      () => {
        toast.classList.remove(
          "show"
        );
      },
      3200
    );
  }

  function setError(
    id,
    message
  ) {
    const input =
      document.getElementById(id);

    const error =
      $(
        `[data-error-for="${id}"]`
      );

    if (!input) {
      return !message;
    }

    input.classList.toggle(
      "invalid",
      Boolean(message)
    );

    input.setAttribute(
      "aria-invalid",
      String(Boolean(message))
    );

    if (error) {
      error.textContent =
        message || "";
    }

    return !message;
  }

  form?.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();

      const data =
        new FormData(form);

      const name =
        String(
          data.get("name") || ""
        ).trim();

      const email =
        String(
          data.get("email") || ""
        ).trim();

      const message =
        String(
          data.get("message") || ""
        ).trim();

      const validName =
        setError(
          "name",
          name.length >= 2
            ? ""
            : "Please enter your name."
        );

      const validEmail =
        setError(
          "email",
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            email
          )
            ? ""
            : "Enter a valid email address."
        );

      const validMessage =
        setError(
          "message",
          message.length >= 10
            ? ""
            : "Please add at least 10 characters."
        );

      if (
        !(
          validName &&
          validEmail &&
          validMessage
        )
      ) {
        showToast(
          "Please fix the highlighted fields."
        );

        return;
      }

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

      window.location.href =
        `mailto:addysam@yahoo.com?subject=${subject}&body=${body}`;

      showToast(
        "Your email app is opening."
      );
    }
  );

  /* =========================
     PROFILE IMAGE FALLBACK
  ========================== */

  const profileImage =
    $(".profile-image-wrap img");

  profileImage?.addEventListener(
    "error",
    () => {
      profileImage.removeAttribute(
        "src"
      );

      profileImage.style.background =
        "linear-gradient(135deg, #9b7bff, #4ee7c2)";

      profileImage.alt =
        "Adeniyi Ayomide";
    }
  );

  /* =========================
     CURRENT YEAR
  ========================== */

  const year =
    $("#year");

  if (year) {
    year.textContent =
      String(
        new Date().getFullYear()
      );
  }

})();