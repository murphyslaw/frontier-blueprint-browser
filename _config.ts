import lume from "lume/mod.ts";
import esbuild from "lume/plugins/esbuild.ts";
import jsx from "lume/plugins/jsx.ts";
import lightningCSS from "lume/plugins/lightningcss.ts";

const site = lume({
  components: {
    cssFile: "/assets/styles/components.css",
    jsFile: "/assets/js/components.js",
  },
});

site.add("assets");
site.add(
  "https://cdn.simplecss.org/simple.min.css",
  "assets/styles/simple.css",
);
site.add("/CNAME");

site.use(jsx());
site.use(esbuild());
site.use(lightningCSS());

export default site;
