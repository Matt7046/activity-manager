"use client";
import { navigateRouting } from "@/general/structure/Utils";
import { Trans } from "@lingui/react";
import { useRouter } from "next/navigation";
import React from "react";
import { SectionName } from "../../general/structure/Constant";

const BannerOpenSource: React.FC = () => {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleClick = () => {
    navigateRouting(router, SectionName.POLICY, { newLogin: true });
  };

  return (
    <div className="mx-auto my-5 rounded-[var(--radius-lg)] border border-[var(--color-border-strong)] bg-[var(--color-banner-bg,var(--color-footer-bg))] px-5 py-5 text-center shadow-[0_12px_40px_rgba(0,0,0,0.35)] html[data-theme=light]:shadow-[0_14px_40px_rgba(0,0,0,0.24)]">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="mb-2 text-sm text-[var(--color-footer-text)]">
          <Trans id="iscriviti" />{" "}
          <span onClick={handleClick} className="cursor-pointer text-[var(--color-link-ui)] underline hover:text-[var(--color-link-ui-hover)]">
            <Trans id="privacy_policy" />
          </span>
          {" | "}
          <a
            href="https://github.com/Matt7046/activity-manager"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-link-ui)] underline hover:text-[var(--color-link-ui-hover)]"
          >
            <Trans id="github_repo" />
          </a>
        </label>
      </form>
    </div>
  );
};

export default BannerOpenSource;
