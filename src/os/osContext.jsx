import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { APPS } from "./registry";

const OSContext = createContext(null);

export const useOS = () => {
  const ctx = useContext(OSContext);
  if (!ctx) throw new Error("useOS must be used within an OSProvider");
  return ctx;
};

const MODE_KEY = "creachos_mode";
const readMode = () => {
  try {
    const m = localStorage.getItem(MODE_KEY);
    return m === "cv" || m === "os" ? m : "os";
  } catch {
    return "os";
  }
};

// Cascade legère pour les fenêtres ouvertes successivement
const spawnPosition = (index) => ({
  x: 80 + (index % 5) * 34,
  y: 70 + (index % 5) * 30,
});

export const OSProvider = ({ children }) => {
  const [mode, setModeState] = useState(readMode);
  const [windows, setWindows] = useState([]);
  const [zTop, setZTop] = useState(10);
  const [openCount, setOpenCount] = useState(0);
  const [activeId, setActiveId] = useState(null);

  const setMode = useCallback((next) => {
    setModeState(next);
    try {
      localStorage.setItem(MODE_KEY, next);
    } catch {
      /* stockage indisponible : on ignore */
    }
  }, []);

  const toggleMode = useCallback(
    () => setMode(mode === "os" ? "cv" : "os"),
    [mode, setMode]
  );

  const focusWindow = useCallback((id) => {
    setZTop((z) => {
      const next = z + 1;
      setWindows((ws) =>
        ws.map((w) => (w.id === id ? { ...w, z: next, minimized: false } : w))
      );
      return next;
    });
    setActiveId(id);
  }, []);

  const openApp = useCallback(
    (appId) => {
      const app = APPS.find((a) => a.id === appId);
      if (!app) return;
      setWindows((ws) => {
        const existing = ws.find((w) => w.id === appId);
        const nextZ = zTop + 1;
        setZTop(nextZ);
        setActiveId(appId);
        if (existing) {
          return ws.map((w) =>
            w.id === appId ? { ...w, z: nextZ, minimized: false } : w
          );
        }
        const pos = spawnPosition(openCount);
        setOpenCount((c) => c + 1);
        return [
          ...ws,
          {
            id: appId,
            title: app.title,
            icon: app.icon,
            x: pos.x,
            y: pos.y,
            w: app.width || 640,
            h: app.height || 460,
            z: nextZ,
            minimized: false,
            maximized: false,
          },
        ];
      });
    },
    [zTop, openCount]
  );

  const closeWindow = useCallback(
    (id) => setWindows((ws) => ws.filter((w) => w.id !== id)),
    []
  );

  const minimizeWindow = useCallback(
    (id) =>
      setWindows((ws) =>
        ws.map((w) => (w.id === id ? { ...w, minimized: true } : w))
      ),
    []
  );

  const toggleMaximize = useCallback(
    (id) =>
      setWindows((ws) =>
        ws.map((w) => (w.id === id ? { ...w, maximized: !w.maximized } : w))
      ),
    []
  );

  const moveWindow = useCallback(
    (id, x, y) =>
      setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, x, y } : w))),
    []
  );

  const value = useMemo(
    () => ({
      mode,
      setMode,
      toggleMode,
      windows,
      activeId,
      openApp,
      closeWindow,
      minimizeWindow,
      toggleMaximize,
      moveWindow,
      focusWindow,
    }),
    [
      mode,
      setMode,
      toggleMode,
      windows,
      activeId,
      openApp,
      closeWindow,
      minimizeWindow,
      toggleMaximize,
      moveWindow,
      focusWindow,
    ]
  );

  return <OSContext.Provider value={value}>{children}</OSContext.Provider>;
};
