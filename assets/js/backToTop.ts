import { debounce } from "../../lib/debounce.ts";

document.addEventListener("DOMContentLoaded", () => {
  const backToTop = document.querySelector<HTMLElement>(".back-to-top");

  if (!backToTop) return;

  const offset = 300; // Distance from top to show the button
  const debounceDelay = 100; // Debounce delay in milliseconds

  const handleScroll = debounce(() => {
    if (globalThis.scrollY > offset) {
      backToTop.classList.add("visible");
    } else {
      backToTop.classList.remove("visible");
    }
  }, debounceDelay);

  globalThis.addEventListener("scroll", handleScroll);
  handleScroll(); // Initial check
});
