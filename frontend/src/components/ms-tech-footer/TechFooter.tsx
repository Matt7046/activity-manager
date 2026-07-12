"use client";

import { Trans } from "@lingui/react";
import {
  Brain,
  CloudUpload,
  Code2,
  Coffee,
  Database,
  Globe,
  Languages,
  Layers,
  Network,
  Package,
  PlayCircle,
  Search,
  Shield,
  Triangle,
} from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import "./TechFooter.css";

const cdLogo = (
  <img
    src="/logo-colorsdev-v2.png"
    alt=""
    width={36}
    height={36}
    className="block object-contain"
    loading="lazy"
    decoding="async"
  />
);

const technologies: { name: string; icon: ReactNode; brandLogo?: boolean }[] = [
  { name: "MongoDB Cloud", icon: <Database className="techf-icon size-8 text-[var(--color-link-ui)] html[data-theme=light]:text-[#0a0a0a]" /> },
  { name: "React", icon: <Code2 className="techf-icon size-8 text-[var(--color-link-ui)] html[data-theme=light]:text-[#0a0a0a]" /> },
  { name: "Next.js", icon: <Triangle className="techf-icon size-8 text-[var(--color-link-ui)] html[data-theme=light]:text-[#0a0a0a]" /> },
  { name: "shadcn/ui", icon: <Layers className="techf-icon size-8 text-[var(--color-link-ui)] html[data-theme=light]:text-[#0a0a0a]" /> },
  { name: "Java", icon: <Coffee className="techf-icon size-8 text-[var(--color-link-ui)] html[data-theme=light]:text-[#0a0a0a]" /> },
  { name: "Spring Boot", icon: <PlayCircle className="techf-icon size-8 text-[var(--color-link-ui)] html[data-theme=light]:text-[#0a0a0a]" /> },
  { name: "ElasticSearch", icon: <Search className="techf-icon size-8 text-[var(--color-link-ui)] html[data-theme=light]:text-[#0a0a0a]" /> },
  { name: "Cloudinary", icon: <CloudUpload className="techf-icon size-8 text-[var(--color-link-ui)] html[data-theme=light]:text-[#0a0a0a]" /> },
  { name: "RabbitMQ", icon: <Network className="techf-icon size-8 text-[var(--color-link-ui)] html[data-theme=light]:text-[#0a0a0a]" /> },
  { name: "Docker", icon: <Package className="techf-icon size-8 text-[var(--color-link-ui)] html[data-theme=light]:text-[#0a0a0a]" /> },
  { name: "Nginx", icon: <Globe className="techf-icon size-8 text-[var(--color-link-ui)] html[data-theme=light]:text-[#0a0a0a]" /> },
  { name: "JWT Token", icon: <Shield className="techf-icon size-8 text-[var(--color-link-ui)] html[data-theme=light]:text-[#0a0a0a]" /> },
  { name: "GPT (AI)", icon: <Brain className="techf-icon size-8 text-[var(--color-link-ui)] html[data-theme=light]:text-[#0a0a0a]" /> },
  { name: "Lingui", icon: <Languages className="techf-icon size-8 text-[var(--color-link-ui)] html[data-theme=light]:text-[#0a0a0a]" /> },
];

void cdLogo;

const TechFooter = () => {
  return (
    <footer className="techf-footer w-full border-t border-[var(--color-border-strong)] bg-[var(--color-footer-bg)] px-3 text-center text-[var(--color-footer-text)] shadow-[0_-8px_24px_rgba(0,0,0,0.1)] html[data-theme=light]:shadow-[0_-14px_40px_rgba(0,0,0,0.22)] max-[700px]:px-2">
      <h2 className="techf-title text-lg font-bold text-[var(--color-link-ui)] html[data-theme=light]:text-[#0a0a0a]">
        <Trans id="tecnologie_che_utilizzo" />
      </h2>
      <div className="techf-grid grid w-full">
        {technologies.map((tech) => (
          <div
            key={tech.name}
            className="techf-item flex flex-col items-center text-center"
          >
            <Button
              variant="ghost"
              size="icon"
              disabled
              className="text-[var(--color-link-ui)] opacity-100 disabled:opacity-100 html[data-theme=light]:text-[#0a0a0a]"
            >
              <span
                className={`inline-flex items-center justify-center${tech.brandLogo ? " techf-icon-wrap-brand" : ""}`}
              >
                {tech.icon}
              </span>
            </Button>
            <span className="techf-name block text-xs text-[var(--color-link-ui)] opacity-90 html[data-theme=light]:text-[#0a0a0a] html[data-theme=light]:opacity-100">
              {tech.name}
            </span>
          </div>
        ))}
      </div>
    </footer>
  );
};

export default TechFooter;
