function isCurrentUrl(url: string, path: string) {
  return url === path ? "true" : "false";
}

interface Data {
  url: string;
}

export default function Nav(data: Data & Lume.Data) {
  const { url } = data;

  return (
    <nav>
      <a aria-current={isCurrentUrl(url, "/")} class="button" href="/">
        Structure
      </a>

      <a
        aria-current={isCurrentUrl(url, "/category/")}
        class="button"
        href="/category/"
      >
        Category
      </a>
    </nav>
  );
}
