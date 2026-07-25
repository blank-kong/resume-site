const yearNode = document.querySelector("#year");
if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}

const counters = document.querySelectorAll("[data-count]");
const stats = document.querySelector("#stats");

if (stats && counters.length) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        counters.forEach((counter) => {
          const target = Number(counter.dataset.count || "0");
          const duration = 900;
          const start = performance.now();

          const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            counter.textContent = String(Math.floor(progress * target));

            if (progress < 1) {
              requestAnimationFrame(tick);
            } else {
              counter.textContent = String(target);
            }
          };

          requestAnimationFrame(tick);
        });

        obs.disconnect();
      });
    },
    { threshold: 0.35 },
  );

  observer.observe(stats);
}

const zoomableImages = Array.from(document.querySelectorAll(".zoomable"));
const modal = document.querySelector(".media-modal");
const modalPanel = modal?.querySelector(".media-modal__panel");
const modalImg = modal?.querySelector("img");
const modalCaption = modal?.querySelector(".media-modal__caption");
const closeButton = modal?.querySelector(".media-modal__close");
const prevButton = modal?.querySelector(".media-modal__nav--prev");
const nextButton = modal?.querySelector(".media-modal__nav--next");
let activeIndex = -1;

const openImageAt = (index) => {
  if (!modal || !modalImg || !modalCaption || !zoomableImages.length) return;
  activeIndex = (index + zoomableImages.length) % zoomableImages.length;
  const image = zoomableImages[activeIndex];
  modalImg.src = image.src;
  modalImg.alt = image.alt || "图片预览";
  modalCaption.textContent = image.alt || "图片预览";
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
};

const closeModal = () => {
  if (!modal || !modalImg || !modalCaption) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  modalImg.removeAttribute("src");
  modalImg.alt = "";
  modalCaption.textContent = "";
  activeIndex = -1;
  document.body.style.overflow = "";
};

if (zoomableImages.length && modal && modalImg && modalCaption) {
  zoomableImages.forEach((image) => {
    image.draggable = false;
  });

  document.addEventListener(
    "click",
    (event) => {
      const target = event.target.closest?.(".zoomable");
      if (!target) return;

      const index = zoomableImages.indexOf(target);
      if (index === -1) return;

      event.preventDefault();
      event.stopPropagation();
      openImageAt(index);
    },
    true,
  );

  modal.addEventListener("click", (event) => {
    if (event.target === modal || event.target === closeButton) {
      closeModal();
    }
  });

  closeButton?.addEventListener("click", closeModal);
  prevButton?.addEventListener("click", () => {
    if (activeIndex !== -1) openImageAt(activeIndex - 1);
  });
  nextButton?.addEventListener("click", () => {
    if (activeIndex !== -1) openImageAt(activeIndex + 1);
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
    } else if (event.key === "ArrowLeft" && activeIndex !== -1) {
      openImageAt(activeIndex - 1);
    } else if (event.key === "ArrowRight" && activeIndex !== -1) {
      openImageAt(activeIndex + 1);
    }
  });

  modalPanel?.addEventListener("click", (event) => {
    event.stopPropagation();
  });
}
