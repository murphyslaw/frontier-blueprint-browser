export const title = "EVE:Frontier Blueprint Browser";
export const features = ["search"];

export default function (data: Lume.Data) {
  const { title, children, comp, url } = data;

  return (
    <>
      {{ __html: "<!DOCTYPE html>" }}

      <html lang="en">
        <head>
          <meta charset="UTF-8" />

          <title>{title}</title>

          <link rel="stylesheet" href="/assets/styles/reset.css" />
          <link rel="stylesheet" href="/assets/styles/simple.css" />
          <link rel="stylesheet" href="/assets/styles/style.css" />
          <link rel="stylesheet" href="/assets/styles/components.css" />

          <script src="/assets/js/script.js" type="text/javascript" />
          <script src="/assets/js/backToTop.js" type="text/javascript" />
        </head>

        <body>
          <header>
            <h1>EVE:Frontier Blueprint Browser</h1>

            <comp.Nav url={url} />
          </header>

          {data.features.includes("search") && <comp.Search />}

          {children}

          <comp.BackToTop />

          <footer>
            <p>Made with ❤️ by Murphyslaw</p>

            <p>
              This is an <a href="https://www.evefrontier.com/">EVE Frontier</a>{" "}
              fan built tool. EVE Frontier is a trademark of CCP ehf. All rights
              reserved.
            </p>
          </footer>
        </body>
      </html>
    </>
  );
}
