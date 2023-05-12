import { sidebar } from "vuepress-theme-hope";

export const enSidebar = sidebar({
  "/docs/": [
    {
      icon: "note",
      text: "CloudNative",
      prefix: "CloudNative/",
      collapsible: true,
      children: "structure",
    },
    {
      text: "ELK",
      icon: "note",
      prefix: "ELK/",
      collapsible: true,
      children: "structure",
    },
    {
      text: "Linux",
      icon: "note",
      prefix: "Linux/",
      collapsible: true,
      children: "structure",
    },
    {
      text: "Shell",
      icon: "note",
      prefix: "Shell/",
      collapsible: true,
      children: "structure",
    },
    {
      text: "Other",
      icon: "note",
      prefix: "Other/",
      collapsible: true,
      children: "structure",
    },
    {
      text: "GPT",
      icon: "note",
      prefix: "GPT/",
      collapsible: true,
      children: "structure",
    },
  ],
  "/blog/": [
    {
      icon: "note",
      text: "blog",
      collapsible: true,
      children: "structure",
    },
  ]
});
