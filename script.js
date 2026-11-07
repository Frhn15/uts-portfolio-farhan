/* Interaksi portfolio: opening, navigasi, tema, validasi form, dan animasi. */
document.addEventListener("DOMContentLoaded", () => {
  const opening = document.getElementById("opening");
  const portfolio = document.getElementById("portfolio");
  const enterButton = document.getElementById("enterProfile");
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  const themeToggle = document.getElementById("themeToggle");

  function showPortfolio() {
    if (!portfolio.hidden) return;
    opening.classList.add("is-leaving");
    window.setTimeout(() => {
      opening.hidden = true;
      portfolio.hidden = false;
      requestAnimationFrame(() => {
        portfolio.classList.add("is-visible");
        observeReveals();
        window.scrollTo({ top: 0, behavior: "instant" });
      });
    }, 450);
  }

  enterButton.addEventListener("click", showPortfolio);
  document.addEventListener("keydown", (event) => {
    if ((event.key === "Enter" || event.key === " ") && portfolio.hidden &&
        !["INPUT", "TEXTAREA", "BUTTON"].includes(document.activeElement.tagName)) {
      event.preventDefault();
      showPortfolio();
    }
  });

  function observeReveals() {
    const items = document.querySelectorAll(".reveal:not(.is-visible)");
    if (!("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
    items.forEach((item) => observer.observe(item));
  }

  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    menuToggle.setAttribute("aria-label", expanded ? "Buka navigasi" : "Tutup navigasi");
    mainNav.classList.toggle("is-open", !expanded);
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Buka navigasi");
    });
  });

  themeToggle.addEventListener("click", () => {
    const html = document.documentElement;
    const nextTheme = html.dataset.theme === "dark" ? "light" : "dark";
    html.dataset.theme = nextTheme;
    themeToggle.setAttribute("aria-label", nextTheme === "dark" ? "Aktifkan tema terang" : "Aktifkan tema gelap");
  });

  // Hitung usia dari tanggal lahir agar tetap akurat setiap tahun.
  const birthDate = new Date(2002, 11, 15);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const beforeBirthday = today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate());
  if (beforeBirthday) age--;
  document.getElementById("age").textContent = String(age);
  document.getElementById("year").textContent = String(today.getFullYear());

  // Salin email dengan umpan balik yang dapat dibaca pembaca layar.
  const copyButton = document.getElementById("copyEmail");
  const copyFeedback = document.getElementById("copyFeedback");
  copyButton.addEventListener("click", async () => {
    const email = "farhanlutfi03@gmail.com";
    try {
      await navigator.clipboard.writeText(email);
      copyFeedback.textContent = "Alamat email berhasil disalin.";
    } catch {
      copyFeedback.textContent = "Salin email secara manual: " + email;
    }
  });

  // Form menggunakan mailto karena website statis ini tidak memakai backend.
  const contactForm = document.getElementById("contactForm");
  const formNote = document.getElementById("formNote");
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;

    const name = document.getElementById("visitorName").value.trim();
    const email = document.getElementById("visitorEmail").value.trim();
    const message = document.getElementById("visitorMessage").value.trim();
    const subject = encodeURIComponent("Pesan dari website portfolio - " + name);
    const body = encodeURIComponent(
      "Nama: " + name + "\nEmail: " + email + "\n\nPesan:\n" + message
    );
    formNote.textContent = "Aplikasi email akan dibuka untuk mengirim pesan Anda.";
    window.location.href = "mailto:farhanlutfi03@gmail.com?subject=" + subject + "&body=" + body;
  });

  // Navigasi aktif mengikuti bagian yang sedang terlihat.
  const navLinks = [...mainNav.querySelectorAll('a[href^="#"]')];
  const sections = navLinks.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
          });
        }
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    sections.forEach((section) => sectionObserver.observe(section));
  }
});
