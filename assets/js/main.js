/* ==========================================================
   Tenalach Farm — shared site behaviour
   (menu, galleries, forms, inquiries)
   ========================================================== */

window.SITE_CONFIG = {
  // Where messages, sign-ups and order requests go.
  email: "cheryl@tenalachfarm.ca",
  // Optional: paste a free Formspree endpoint (https://formspree.io) such as
  // "https://formspree.io/f/abcdwxyz" to have forms send without opening an
  // email app. Left empty, forms open the visitor's email app instead.
  formEndpoint: ""
};

(function () {
  const cfg = window.SITE_CONFIG;

  /* ---------- Mobile menu ---------- */
  const mobileNav = document.querySelector(".mobile-nav");
  const menuButtons = document.querySelectorAll("[data-menu-open]");
  function setMenu(open) {
    if (!mobileNav) return;
    mobileNav.classList.toggle("is-open", open);
    document.body.classList.toggle("no-scroll", open);
    menuButtons.forEach((b) => b.setAttribute("aria-expanded", String(open)));
    if (open) mobileNav.querySelector("[data-menu-close]").focus();
  }
  menuButtons.forEach((btn) => {
    btn.setAttribute("aria-expanded", "false");
    btn.addEventListener("click", () => setMenu(true));
  });
  document.querySelectorAll("[data-menu-close]").forEach((btn) => btn.addEventListener("click", () => setMenu(false)));
  if (mobileNav) mobileNav.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
  });

  /* ---------- Photo galleries ---------- */
  document.querySelectorAll(".carousel").forEach((carousel) => {
    const track = carousel.querySelector(".carousel__track");
    const prev = carousel.querySelector("[data-prev]");
    const next = carousel.querySelector("[data-next]");
    const step = () => {
      const item = track.querySelector("img");
      return item ? item.getBoundingClientRect().width + 16 : track.clientWidth;
    };
    const update = () => {
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
    };
    prev.addEventListener("click", () => track.scrollBy({ left: -step() }));
    next.addEventListener("click", () => track.scrollBy({ left: step() }));
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  });

  /* ---------- Forms (contact + newsletter) ---------- */
  document.addEventListener("submit", async (e) => {
    const form = e.target.closest("form[data-form]");
    if (!form) return;
    e.preventDefault();
    const status = form.querySelector(".form-status") || form.parentElement.querySelector(".form-status");
    const data = Object.fromEntries(new FormData(form).entries());
    const subject = form.dataset.subject || "Website message";

    if (cfg.formEndpoint) {
      try {
        const res = await fetch(cfg.formEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ _subject: subject, ...data })
        });
        if (!res.ok) throw new Error(res.statusText);
        form.reset();
        if (status) status.textContent = form.dataset.success || "Thank you! Your message has been sent.";
      } catch (err) {
        if (status) status.textContent = "Sorry, something went wrong. Please email us at " + cfg.email + ".";
      }
      return;
    }

    const body = Object.entries(data)
      .map(([k, v]) => k.charAt(0).toUpperCase() + k.slice(1) + ": " + v)
      .join("\n");
    window.location.href =
      "mailto:" + cfg.email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    if (status) status.textContent = "Opening your email app…";
  });

  /* ---------- "Inquire" buttons ----------
     A link with data-inquire="Item name" jumps to the page's contact form
     and starts the message for the visitor. */
  document.addEventListener("click", (e) => {
    const link = e.target.closest("[data-inquire]");
    if (!link) return;
    const message = document.querySelector("#contact textarea[name=message]");
    if (!message) return;
    e.preventDefault();
    message.value = "Hello! I'm interested in " + link.dataset.inquire + ". Could you tell me more?";
    document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
    const name = document.querySelector("#contact input[name=name]");
    setTimeout(() => (name || message).focus({ preventScroll: true }), 500);
  });

  /* footer year */
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
})();
