/* === SECCION: UTILIDADES === */
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function animateValue(element, start, end, duration, options = {}) {
  if (!element) return;

  if (prefersReducedMotion) {
    element.textContent = `${options.prefix || ""}${end.toLocaleString("es-CO")}${options.suffix || ""}`;
    return;
  }

  const startTime = performance.now();
  const decimals = Number.isInteger(end) ? 0 : 1;

  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = start + (end - start) * eased;
    const value = current.toLocaleString("es-CO", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });

    element.textContent = `${options.prefix || ""}${value}${options.suffix || ""}`;
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

/* === SECCION: NAVEGACION === */
const siteHeader = document.getElementById("siteHeader");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

function closeMobileMenu() {
  if (!navLinks || !menuToggle) return;
  navLinks.classList.remove("is-open");
  menuToggle.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menú");
  document.body.classList.remove("menu-open");
}

if (siteHeader) {
  const handleHeaderScroll = () => {
    siteHeader.classList.toggle("scrolled", window.scrollY > 80);
  };

  window.addEventListener("scroll", handleHeaderScroll, { passive: true });
  handleHeaderScroll();
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    menuToggle.classList.toggle("is-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
    document.body.classList.toggle("menu-open", isOpen);
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMobileMenu();
});

window.addEventListener("resize", () => {
  if (window.innerWidth >= 1024) closeMobileMenu();
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    const target = targetId.length > 1 ? document.querySelector(targetId) : null;

    if (!target) return;

    event.preventDefault();
    closeMobileMenu();
    target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
  });
});

/* === SECCION: SCROLL REVEALS Y COUNTERS === */
const revealItems = document.querySelectorAll(".reveal");
if (revealItems.length) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => revealObserver.observe(item));
}

const counters = document.querySelectorAll("[data-counter]");
if (counters.length) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const element = entry.target;
      const end = Number(element.dataset.counter);
      animateValue(element, 0, end, 1400, {
        prefix: element.dataset.prefix || "",
        suffix: element.dataset.suffix || ""
      });
      counterObserver.unobserve(element);
    });
  }, { threshold: 0.55 });

  counters.forEach((counter) => counterObserver.observe(counter));
}

/* === SECCION: FAQ === */
document.querySelectorAll(".faq-question").forEach((button) => {
  button.addEventListener("click", () => {
    const currentItem = button.closest(".faq-item");

    document.querySelectorAll(".faq-item").forEach((item) => {
      const isCurrent = item === currentItem;
      item.classList.toggle("is-open", isCurrent && !item.classList.contains("is-open"));
      item.querySelector(".faq-question").setAttribute("aria-expanded", String(item.classList.contains("is-open")));
    });
  });
});

/* === SECCION: FORMULARIO === */
const contactForm = document.getElementById("contactForm");
const formSuccess = document.getElementById("formSuccess");

if (contactForm) {
  function setError(field, message) {
    const error = contactForm.querySelector(`[data-error-for="${field.id}"]`);
    if (error) error.textContent = message;
    field.setAttribute("aria-invalid", message ? "true" : "false");
  }

  function validateField(field) {
    const value = field.value.trim();

    if (!value) {
      setError(field, "Este campo es obligatorio.");
      return false;
    }

    if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError(field, "Introduce un email válido.");
      return false;
    }

    if (field.type === "tel" && value.replace(/\D/g, "").length < 9) {
      setError(field, "Introduce un teléfono válido.");
      return false;
    }

    setError(field, "");
    return true;
  }

  contactForm.querySelectorAll("input, textarea").forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      if (field.getAttribute("aria-invalid") === "true") validateField(field);
    });
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const fields = Array.from(contactForm.querySelectorAll("input, textarea"));
    const isValid = fields.every(validateField);

    if (formSuccess) formSuccess.classList.toggle("is-visible", isValid);
    if (isValid) contactForm.reset();
  });
}
