import React, { createContext, useContext, useEffect, useState } from "react";
import { Linkedin, Github, MapPin, Copy, Check, X, Send, AlertCircle } from "lucide-react";
import { useColor } from "../../contexts/ColorContext";
import { useLanguage } from "../../contexts/LanguageContext";

const Ctx = createContext(null);
export const useContactOverlay = () => useContext(Ctx) || {};

const API = "https://mail.creachtheo.fr/api/contact";

const COPY = {
  fr: {
    title: "Me contacter",
    subtitle: "Disponible pour un poste — je réponds vite.",
    copied: "Copié !",
    copy: "Copier",
    name: "Votre nom",
    email: "Votre email",
    subject: "Objet (optionnel)",
    message: "Votre message…",
    send: "Envoyer",
    sending: "Envoi…",
    okTitle: "Message envoyé !",
    okText: "Merci, je reviens vers vous très vite.",
    error: "Une erreur est survenue. Réessayez ou écrivez à creach.t@gmail.com",
    or: "ou directement",
  },
  en: {
    title: "Get in touch",
    subtitle: "Available for a job — I reply fast.",
    copied: "Copied!",
    copy: "Copy",
    name: "Your name",
    email: "Your email",
    subject: "Subject (optional)",
    message: "Your message…",
    send: "Send",
    sending: "Sending…",
    okTitle: "Message sent!",
    okText: "Thanks, I'll get back to you very soon.",
    error: "Something went wrong. Try again or email creach.t@gmail.com",
    or: "or directly",
  },
};

const LINKS = [
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/in/creachtheo" },
  { icon: Github, label: "GitHub", href: "https://github.com/creach-t" },
];

const EMPTY = { name: "", email: "", subject: "", message: "" };

const Overlay = ({ open, onClose }) => {
  const { secondaryColor } = useColor();
  const { language } = useLanguage();
  const t = COPY[language] || COPY.fr;

  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [errMsg, setErrMsg] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      setStatus("idle");
      setErrMsg("");
    }
  }, [open]);

  if (!open) return null;

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const copyEmail = () =>
    navigator.clipboard?.writeText("creach.t@gmail.com").then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      },
      () => {}
    );

  const submit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setErrMsg("");
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, language }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || t.error);
      setForm(EMPTY);
      setStatus("success");
    } catch (err) {
      setErrMsg(err.message || t.error);
      setStatus("error");
    }
  };

  const inputCls =
    "w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-gray-100 outline-none placeholder:text-gray-600 focus:border-white/25";

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-h-[88vh] w-full max-w-md overflow-auto rounded-2xl border border-white/10 bg-[#0e1017] p-6 shadow-2xl">
        <button
          onClick={onClose}
          aria-label="Fermer"
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-lg text-gray-500 hover:bg-white/5 hover:text-gray-200"
        >
          <X className="h-4 w-4" />
        </button>

        {status === "success" ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-full" style={{ backgroundColor: secondaryColor }}>
              <Check className="h-7 w-7 text-black" />
            </span>
            <h3 className="text-xl font-bold text-white">{t.okTitle}</h3>
            <p className="text-sm text-gray-400">{t.okText}</p>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-bold text-white">{t.title}</h3>
            <p className="mt-1 text-sm text-gray-400">{t.subtitle}</p>

            <form onSubmit={submit} className="mt-4 space-y-2.5">
              <div className="grid grid-cols-2 gap-2.5">
                <input name="name" value={form.name} onChange={change} required placeholder={t.name} className={inputCls} />
                <input name="email" type="email" value={form.email} onChange={change} required placeholder={t.email} className={inputCls} />
              </div>
              <input name="subject" value={form.subject} onChange={change} placeholder={t.subject} className={inputCls} />
              <textarea name="message" value={form.message} onChange={change} required rows={4} placeholder={t.message} className={inputCls} />

              {status === "error" && (
                <div className="flex items-center gap-2 rounded-lg bg-red-500/15 px-3 py-2 text-xs text-red-300">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {errMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-black transition-opacity disabled:opacity-60"
                style={{ backgroundColor: secondaryColor }}
              >
                {status === "sending" ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/40 border-t-transparent" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {status === "sending" ? t.sending : t.send}
              </button>
            </form>

            {/* contact direct */}
            <div className="mt-4 flex items-center gap-2 border-t border-white/10 pt-3">
              <span className="text-xs text-gray-500">{t.or}</span>
              <button
                onClick={copyEmail}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1 text-xs text-gray-200 hover:bg-white/5"
              >
                {copied ? <Check className="h-3.5 w-3.5" style={{ color: secondaryColor }} /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? t.copied : "creach.t@gmail.com"}
              </button>
              <div className="ml-auto flex items-center gap-1">
                {LINKS.map((l) => {
                  const Icon = l.icon;
                  return (
                    <a
                      key={l.label}
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={l.label}
                      className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-gray-300 hover:bg-white/5"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-gray-600">
              <MapPin className="h-3.5 w-3.5" />
              Saint-Maur-des-Fossés · full remote
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export const ContactOverlayProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const value = {
    open,
    openContact: () => setOpen(true),
    closeContact: () => setOpen(false),
  };
  return (
    <Ctx.Provider value={value}>
      {children}
      <Overlay open={open} onClose={() => setOpen(false)} />
    </Ctx.Provider>
  );
};

export default ContactOverlayProvider;
