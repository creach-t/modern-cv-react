import React, { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Linkedin,
  Github,
  Globe,
  Copy,
  Check,
} from "lucide-react";
import { useColor } from "../../contexts/ColorContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useData } from "../data/DataContext";
import { Loading } from "./ui";

const ICONS = { Phone, Mail, MapPin, Linkedin, Github, Globe };

const ContactApp = () => {
  const { data } = useData();
  const { secondaryColor } = useColor();
  const { language } = useLanguage();
  const [copied, setCopied] = useState(null);

  if (!data) return <Loading label="running contact.sh…" />;

  const copy = (value) => {
    navigator.clipboard?.writeText(value).then(
      () => {
        setCopied(value);
        setTimeout(() => setCopied(null), 1500);
      },
      () => {}
    );
  };

  return (
    <div className="p-5">
      <p className="mb-4 font-mono text-xs text-gray-500">
        $ cat contact.json —{" "}
        {language === "fr" ? "disponible pour un poste" : "open to work"}
      </p>
      <ul className="space-y-2">
        {data.contacts.map((c) => {
          const Icon = ICONS[c.icon] || Globe;
          const external = c.link?.startsWith("http");
          return (
            <li key={c.label}>
              <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5">
                <span
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-md"
                  style={{ backgroundColor: `${secondaryColor}22` }}
                >
                  <Icon className="h-4 w-4" style={{ color: secondaryColor }} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] uppercase tracking-wider text-gray-500">
                    {c.label}
                  </div>
                  <a
                    href={c.link}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noreferrer" : undefined}
                    className="block truncate text-sm text-gray-200 hover:underline"
                  >
                    {c.value}
                  </a>
                </div>
                <button
                  aria-label={`Copier ${c.label}`}
                  onClick={() => copy(c.value)}
                  className="grid h-7 w-7 place-items-center rounded-md text-gray-500 hover:bg-white/5 hover:text-gray-200"
                >
                  {copied === c.value ? (
                    <Check className="h-4 w-4" style={{ color: secondaryColor }} />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ContactApp;
