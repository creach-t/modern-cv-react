import React from "react";
import { Layout, Server, Cog, Wrench } from "lucide-react";
import { useColor } from "../../contexts/ColorContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useData } from "../../os/data/DataContext";
import Section from "../components/Section";
import Reveal from "../components/Reveal";

const COPY = {
  fr: {
    title: "Ce que je maîtrise",
    subtitle: "Les outils que j'utilise au quotidien pour concevoir, développer et déployer.",
    legend: "En couleur : les technologies que je manie avec aisance.",
  },
  en: {
    title: "What I work with",
    subtitle: "The tools I use daily to design, build and ship.",
    legend: "Highlighted: the technologies I'm most comfortable with.",
  },
};

const CAT_ICONS = { Frontend: Layout, Backend: Server, DevOps: Cog, Tools: Wrench };

const Skills = () => {
  const { secondaryColor } = useColor();
  const { language } = useLanguage();
  const { data } = useData();
  const t = COPY[language] || COPY.fr;

  return (
    <Section id="skills" index="04" title={t.title} subtitle={t.subtitle} doodle="chip">
      <Reveal stagger className="grid gap-5 sm:grid-cols-2">
        {(data?.skills || []).map((cat) => {
          const Icon = CAT_ICONS[cat.category] || Cog;
          const skills = cat.skills
            .filter((s) => s.level >= 2)
            .sort((a, b) => b.level - a.level);
          return (
            <div
              key={cat.category}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              <div className="mb-4 flex items-center gap-2.5">
                <span
                  className="grid h-9 w-9 place-items-center rounded-lg"
                  style={{ backgroundColor: `${secondaryColor}22` }}
                >
                  <Icon className="h-4 w-4" style={{ color: secondaryColor }} />
                </span>
                <h3 className="text-lg font-semibold text-white">{cat.category}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((s) => {
                  const strong = s.level >= 3;
                  return (
                    <span
                      key={s.name}
                      className="rounded-lg px-2.5 py-1 text-sm font-medium"
                      style={
                        strong
                          ? {
                              color: secondaryColor,
                              backgroundColor: `${secondaryColor}1c`,
                              border: `1px solid ${secondaryColor}55`,
                            }
                          : {
                              color: "#cbd5e1",
                              backgroundColor: "rgba(255,255,255,0.04)",
                              border: "1px solid rgba(255,255,255,0.08)",
                            }
                      }
                    >
                      {s.name}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </Reveal>
      <p className="mt-6 text-center text-xs text-gray-500">{t.legend}</p>
    </Section>
  );
};

export default Skills;
