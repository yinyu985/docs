import { hopeTheme } from "vuepress-theme-hope";
import { enNavbar} from "./navbar/index.js";
import { enSidebar} from "./sidebar/index.js";

export default hopeTheme({
  hostname: "https://vuepress-theme-hope-docs-demo.netlify.app",
  toc: false,
  author: {
    name: "ShareYu",
    url: "https://yinyu985.github.io/",
  },
  iconAssets: "iconify",
  logo: "/index.png",
  repo: "yinyu985/docs",
  repoLabel: "GitHub",
  repoDisplay: true,
  pure: true,
  docsDir: "/src/docs",
  locales: {
    "/": {
      navbar: enNavbar,
      sidebar: enSidebar,
      footer: "Default footer",
      displayFooter: false,
      metaLocales: {
        editLink: "在 GitHub 上编辑此页",
      },
    },
  },

  encrypt: {
    config: {
    },
  },
  plugins: {
    // autoCatalog: false,
    mdEnhance: {
      align: true,
      attrs: true,
      chart: true,
      codetabs: true,
      demo: true,
      echarts: true,
      figure: true,
      flowchart: true,
      gfm: true,
      imgLazyload: true,
      imgSize: true,
      include: true,
      katex: true,
      mark: true,
      mermaid: true,
      // sub: true,
      // sup: true,
      tabs: true,
      // vPre: true,
      // vuePlayground: true,
      // playground: {
      //   presets: ["ts", "vue"],
      // },
      presentation: {
        plugins: ["highlight", "math", "search", "notes", "zoom"],
      },
      stylize: [
        {
          matcher: "Recommended",
          replacer: ({ tag }) => {
            if (tag === "em")
              return {
                tag: "Badge",
                attrs: { type: "tip" },
                content: "Recommended",
              };
          },
        },
      ],
    },
  
  },
});
