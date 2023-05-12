import { navbar } from "vuepress-theme-hope";

export const enNavbar = navbar([
  // "/docs/",
  { text: "主页", icon: "discover", link: "/home" },
  { text: "", icon: "discover", link: "/home" },
  { text: "文档", icon: "discover", link: "/docs/"},
  { text: "", icon: "discover", link: "/docs/"},
  { text: "随笔", icon: "discover", link: "/blog/"},
  // { text: "ELK", icon: "discover", link: "/docs/ELK/" },
  // { text: "Other", icon: "discover", link: "/docs/Other" },
  // { text: "GPT", icon: "discover", link: "/docs/GPT" },
  // { text: "Shell", icon: "discover", link: "/docs/Shell" },
]);
