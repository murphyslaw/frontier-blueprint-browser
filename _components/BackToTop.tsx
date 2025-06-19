export const css = `
.back-to-top {
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
  pointer-events: none;
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 1;
  text-decoration: none;
  outline: none;
  font-size: 2rem;
  font-weight: bold;
  rotate: -90deg;
  padding: 0.5rem 1.5rem;
  color: var(--text);
  background-color: var(--accent-bg);
  border: var(--border-width) solid var(--border);

  &.visible {
    opacity: 1;
    pointer-events: auto;
  }

  &:visited {
    color: var(--text);
  }

  &:hover, &:visited:hover {
    color: var(--accent);
    border-color: var(--accent);
  }
}`;

export default function () {
  return (
    <a
      href="#search"
      class="back-to-top"
      title="Go to Top"
      aria-label="Go to top"
      tabindex="-1"
    >
      <span aria-hidden="true">&#10095;</span>
      <span class="screen-reader-only">Back to Top</span>
    </a>
  );
}
