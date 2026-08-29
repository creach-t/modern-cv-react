import React from "react";
import { useColor } from "../../contexts/ColorContext";

export const AppPad = ({ children, className = "" }) => (
  <div className={`p-5 ${className}`}>{children}</div>
);

export const Tag = ({ children, tone = "default" }) => {
  const { secondaryColor } = useColor();
  if (tone === "accent") {
    return (
      <span
        className="inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium"
        style={{
          color: secondaryColor,
          backgroundColor: `${secondaryColor}1f`,
          border: `1px solid ${secondaryColor}40`,
        }}
      >
        {children}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] font-medium text-gray-300">
      {children}
    </span>
  );
};

export const Loading = ({ label = "loading…" }) => (
  <div className="flex h-full items-center justify-center font-mono text-sm text-gray-500">
    {label}
  </div>
);

export const Kbd = ({ children }) => (
  <kbd className="rounded border border-white/15 bg-white/5 px-1.5 py-0.5 font-mono text-[11px] text-gray-300">
    {children}
  </kbd>
);
