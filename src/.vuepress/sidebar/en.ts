import { sidebar } from "vuepress-theme-hope";

export const enSidebar = sidebar({
  "/docs/": [
    {
      text: "Docker",
      icon: "note",
      prefix: "Docker/",
      collapsible: true,
      children: "structure",
    },
    {
      text: "Kubernetes",
      icon: "note",
      prefix: "Kubernetes/",
      collapsible: true,
      children: "structure",
    },
    {
      text: "Prometheus",
      icon: "note",
      prefix: "Prometheus/",
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
      text: "CI&CD",
      icon: "note",
      prefix: "CI&CD/",
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
      text: "Python",
      icon: "note",
      prefix: "Python/",
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
});
