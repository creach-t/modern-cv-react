import { useEffect, useState } from "react";

/**
 * Charge en une seule passe toutes les données du CV (public/data/*.json)
 * et les expose aux "apps" de creachOS. Évite les fetch en cascade que
 * faisaient les anciens composants de section.
 */
const ENDPOINTS = {
  skills: "skills",
  experiences: "experiences",
  education: "education",
  projects: "projects",
  contacts: "contacts",
  softSkills: "softSkills",
  hobbies: "hobbies",
};

const fetchJson = async (name) => {
  const res = await fetch(`/data/${name}.json`);
  if (!res.ok) throw new Error(`HTTP ${res.status} on ${name}`);
  return res.json();
};

export const useCVData = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const entries = await Promise.all(
          Object.entries(ENDPOINTS).map(async ([key, file]) => [
            key,
            await fetchJson(file),
          ])
        );
        if (!alive) return;
        const raw = Object.fromEntries(entries);
        setData({
          skills: raw.skills || [],
          experiences: raw.experiences?.experiences || [],
          education: raw.education?.education || [],
          projects: raw.projects?.projects || [],
          contacts: raw.contacts || [],
          softSkills: raw.softSkills || [],
          hobbies: raw.hobbies || [],
        });
      } catch (err) {
        if (alive) setError(err);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return { data, error };
};
