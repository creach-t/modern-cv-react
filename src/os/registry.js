import {
  TerminalSquare,
  FolderGit2,
  Briefcase,
  Cpu,
  GraduationCap,
  User,
  Mail,
  Server,
} from "lucide-react";

/**
 * Métadonnées des applications de creachOS.
 * Volontairement SANS import de composants React ni du contexte OS,
 * pour éviter tout cycle d'import (osContext -> registry).
 * Le mapping id -> composant vit dans ./apps/appComponents.js
 */
export const APPS = [
  {
    id: "terminal",
    title: "terminal",
    icon: TerminalSquare,
    width: 720,
    height: 460,
    onDesktop: true,
    accent: true,
  },
  {
    id: "projects",
    title: "projects.app",
    icon: FolderGit2,
    width: 720,
    height: 520,
    onDesktop: true,
  },
  {
    id: "skills",
    title: "system-monitor",
    icon: Cpu,
    width: 660,
    height: 520,
    onDesktop: true,
  },
  {
    id: "experience",
    title: "experience.log",
    icon: Briefcase,
    width: 620,
    height: 500,
    onDesktop: true,
  },
  {
    id: "education",
    title: "education.log",
    icon: GraduationCap,
    width: 600,
    height: 440,
    onDesktop: true,
  },
  {
    id: "infra",
    title: "live-infra",
    icon: Server,
    width: 560,
    height: 470,
    onDesktop: true,
  },
  {
    id: "about",
    title: "whoami",
    icon: User,
    width: 600,
    height: 460,
    onDesktop: true,
  },
  {
    id: "contact",
    title: "contact.sh",
    icon: Mail,
    width: 520,
    height: 420,
    onDesktop: true,
  },
];

export const getApp = (id) => APPS.find((a) => a.id === id);
