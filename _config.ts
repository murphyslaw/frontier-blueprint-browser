import lume from "lume/mod.ts";
import esbuild from "lume/plugins/esbuild.ts";
import jsx from "lume/plugins/jsx.ts";
import lightningCSS from "lume/plugins/lightningcss.ts";
import sourceMaps from "lume/plugins/source_maps.ts";

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
site.add("_data/blueprints.json", "assets/data/blueprints.json");
site.add("_data/structures.json", "assets/data/structures.json");
site.add("_data/types.json", "assets/data/types.json");

site.use(jsx());
site.use(esbuild(
  {
    options: {
      minify: false,
      target: "es6",
    },
  },
));
site.use(lightningCSS());
site.use(sourceMaps({
  inline: false, // Set true to inline the source map in the output file
  sourceContent: true, // Set false to don't include the content of the source files
}));

export default site;
