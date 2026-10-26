/* ==========================================================
   Tenalach Farm — Workshops & Events listing
   Content comes from content/workshops.json, which the client
   edits in the dashboard at /admin.
   ========================================================== */

(function () {
  const TAG_ICON =
    '<div class="placeholder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M3.5 12.2 11.8 3.9a1.6 1.6 0 0 1 1.13-.47h5.97c.88 0 1.6.72 1.6 1.6v5.97c0 .42-.17.83-.47 1.13l-8.3 8.3a1.6 1.6 0 0 1-2.26 0l-5.97-5.97a1.6 1.6 0 0 1 0-2.26Z"/><circle cx="16.3" cy="7.7" r="1.5"/></svg></div>';

  const esc = (s) =>
    String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // "2026-11-15" -> a local Date (no time-zone shift)
  function parseDate(value) {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(value || "");
    return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : null;
  }
  const formatDate = (d) =>
    d.toLocaleDateString("en-CA", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  function paragraphs(text) {
    return String(text || "")
      .trim()
      .split(/\n\s*\n/)
      .filter(Boolean)
      .map((p) => "<p>" + esc(p).replace(/\n/g, "<br>") + "</p>")
      .join("");
  }

  function images(item) {
    return [item.image]
      .concat((item.gallery || []).map((g) => (typeof g === "string" ? g : g && g.image)))
      .filter(Boolean);
  }

  const hasDetails = (item) => item.description || item.bring || images(item).length > 1;

  function when(item) {
    const d = parseDate(item.date);
    const parts = [d ? formatDate(d) : "Date to be announced"];
    if (item.time) parts.push(item.time);
    return parts.join(" · ");
  }

  function meta(item) {
    const rows = [];
    if (item.location) rows.push('<li><span>Where</span>' + esc(item.location) + "</li>");
    if (item.price) rows.push('<li><span>Cost</span>' + esc(item.price) + "</li>");
    if (item.spots) rows.push('<li><span>Spots</span>' + esc(item.spots) + "</li>");
    return rows.length ? '<ul class="event-meta">' + rows.join("") + "</ul>" : "";
  }

  function actions(item, index, block) {
    const primary = item.bookingLink
      ? '<a class="btn btn--cream' + (block ? " btn--block" : "") + '" href="' + esc(item.bookingLink) + '" target="_blank" rel="noopener">Book Now</a>'
      : '<a class="btn btn--cream' + (block ? " btn--block" : "") + '" href="#contact" data-inquire="' + esc(item.title) + '">Inquire</a>';
    const details = index >= 0 && hasDetails(item)
      ? '<button class="text-button" type="button" data-details="' + index + '">View details</button>'
      : "";
    return '<div class="event-actions">' + primary + details + "</div>";
  }

  function media(item) {
    const src = images(item)[0];
    return src ? '<img src="' + esc(src) + '" alt="' + esc(item.title) + '" loading="lazy">' : TAG_ICON;
  }

  function card(item, index) {
    return (
      '<article class="event-card">' +
      '<div class="event-card__media">' + media(item) + "</div>" +
      '<div class="event-card__body">' +
      '<p class="event-when">' + esc(when(item)) + "</p>" +
      '<h3 class="title-md">' + esc(item.title) + "</h3>" +
      meta(item) +
      (item.summary ? '<p class="event-summary">' + esc(item.summary) + "</p>" : "") +
      actions(item, index, true) +
      "</div></article>"
    );
  }

  function row(item, index) {
    return (
      '<article class="event-row">' +
      media(item) +
      '<div class="event-row__body">' +
      '<p class="event-when">' + esc(when(item)) + "</p>" +
      '<h3 class="title-lg">' + esc(item.title) + "</h3>" +
      meta(item) +
      (item.summary ? '<p class="event-summary">' + esc(item.summary) + "</p>" : "") +
      "</div>" +
      actions(item, index, false) +
      "</article>"
    );
  }

  /* ---------- details dialog ---------- */
  const dialog = document.querySelector(".event-dialog");
  const dialogBody = dialog && dialog.querySelector(".event-dialog__content");
  let shown = [];

  function openDetails(item) {
    const pics = images(item);
    dialogBody.innerHTML =
      (pics.length
        ? '<div class="event-dialog__gallery"><img class="event-dialog__main" src="' + esc(pics[0]) + '" alt="' + esc(item.title) + '">' +
          (pics.length > 1
            ? '<div class="event-dialog__thumbs">' +
              pics.map((p, i) => '<button type="button" data-thumb="' + esc(p) + '"' + (i === 0 ? ' class="is-active"' : "") + '><img src="' + esc(p) + '" alt=""></button>').join("") +
              "</div>"
            : "") +
          "</div>"
        : "") +
      '<div class="event-dialog__text">' +
      '<p class="event-when">' + esc(when(item)) + "</p>" +
      '<h2 class="title-xl" id="event-dialog-title">' + esc(item.title) + "</h2>" +
      meta(item) +
      (item.description ? '<div class="copy">' + paragraphs(item.description) + "</div>" : item.summary ? "<p>" + esc(item.summary) + "</p>" : "") +
      (item.bring
        ? '<h3 class="event-dialog__sub">What to bring</h3><ul class="tick-list">' +
          item.bring.split(/\n/).map((l) => l.replace(/^[-*•]\s*/, "").trim()).filter(Boolean).map((l) => "<li>" + esc(l) + "</li>").join("") +
          "</ul>"
        : "") +
      actions(item, -1, false) +
      "</div>";
    dialog.showModal();
    document.body.classList.add("no-scroll");
    dialogBody.scrollTop = 0;
    dialog.scrollTop = 0;
  }

  function closeDetails() {
    if (dialog.open) dialog.close();
    document.body.classList.remove("no-scroll");
  }

  if (dialog) {
    // Escape closes the dialog natively; "cancel" fires right away, "close" may arrive later
    dialog.addEventListener("cancel", () => document.body.classList.remove("no-scroll"));
    dialog.addEventListener("close", () => document.body.classList.remove("no-scroll"));
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog || e.target.closest("[data-dialog-close]") || e.target.closest("[data-inquire]")) {
        closeDetails();
        return;
      }
      const thumb = e.target.closest("[data-thumb]");
      if (thumb) {
        dialog.querySelector(".event-dialog__main").src = thumb.dataset.thumb;
        dialog.querySelectorAll("[data-thumb]").forEach((b) => b.classList.toggle("is-active", b === thumb));
      }
    });
  }

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-details]");
    if (btn && shown[btn.dataset.details]) openDetails(shown[btn.dataset.details]);
  });

  /* ---------- load + render ---------- */
  const lists = document.querySelectorAll("[data-listing]");

  function render(items) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const visible = items
      .filter((item) => item && item.title && item.published !== false)
      .filter((item) => {
        const d = parseDate(item.date);
        return !d || d >= today; // past dates drop off the page automatically
      })
      .map((item, order) => ({ item, order, d: parseDate(item.date) }))
      .sort((a, b) => (a.d && b.d ? a.d - b.d : a.d ? -1 : b.d ? 1 : a.order - b.order))
      .map((x) => x.item);

    shown = visible;
    lists.forEach((list) => {
      const type = list.dataset.listing;
      const matches = visible.filter((item) => (item.type || "Workshop") === type);
      if (!matches.length) {
        list.innerHTML =
          '<p class="empty-state">No ' + (type === "Event" ? "events" : "workshops") +
          ' are scheduled right now. <a href="#contact" data-inquire="your next ' + type.toLowerCase() + '">Ask us</a> to hear about the next one.</p>';
        return;
      }
      list.innerHTML = matches.map((item) => (type === "Event" ? row : card)(item, visible.indexOf(item))).join("");
    });
  }

  fetch("content/workshops.json", { cache: "no-store" })
    .then((res) => {
      if (!res.ok) throw new Error(res.status);
      return res.json();
    })
    .then((data) => render(Array.isArray(data) ? data : data.items || []))
    .catch(() => {
      lists.forEach((list) => {
        list.innerHTML =
          '<p class="empty-state">Workshops couldn’t be loaded just now. Please <a href="#contact">get in touch</a> to hear what’s coming up.</p>';
      });
    });
})();
