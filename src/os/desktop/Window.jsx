import React, { useCallback, useRef, useState } from "react";
import { Minus, Square, X } from "lucide-react";
import { useColor } from "../../contexts/ColorContext";
import { useOS } from "../osContext";

const TASKBAR_H = 44;

const Window = ({ win, active, children }) => {
  const { secondaryColor } = useColor();
  const { focusWindow, closeWindow, minimizeWindow, toggleMaximize, moveWindow } =
    useOS();

  const [drag, setDrag] = useState(null); // { dx, dy } offset live
  const start = useRef(null);

  const onPointerDown = useCallback(
    (e) => {
      if (win.maximized) return;
      if (e.target.closest("[data-no-drag]")) return;
      e.currentTarget.setPointerCapture?.(e.pointerId);
      start.current = { px: e.clientX, py: e.clientY, x: win.x, y: win.y };
      setDrag({ dx: 0, dy: 0 });
      focusWindow(win.id);
    },
    [win.maximized, win.x, win.y, win.id, focusWindow]
  );

  const onPointerMove = useCallback(
    (e) => {
      if (!start.current) return;
      setDrag({
        dx: e.clientX - start.current.px,
        dy: e.clientY - start.current.py,
      });
    },
    []
  );

  const commit = useCallback(() => {
    if (!start.current || !drag) {
      start.current = null;
      setDrag(null);
      return;
    }
    const nx = Math.max(-40, start.current.x + drag.dx);
    const ny = Math.max(0, start.current.y + drag.dy);
    moveWindow(win.id, nx, ny);
    start.current = null;
    setDrag(null);
  }, [drag, moveWindow, win.id]);

  const style = win.maximized
    ? {
        left: 0,
        top: 0,
        width: "100%",
        height: `calc(100% - ${TASKBAR_H}px)`,
        zIndex: win.z,
      }
    : {
        left: win.x + (drag?.dx || 0),
        top: win.y + (drag?.dy || 0),
        width: win.w,
        height: win.h,
        zIndex: win.z,
      };

  const Icon = win.icon;

  return (
    <section
      role="dialog"
      aria-label={win.title}
      onMouseDown={() => focusWindow(win.id)}
      style={style}
      className={`absolute flex flex-col overflow-hidden rounded-xl border backdrop-blur-md transition-shadow ${
        active
          ? "border-white/15 shadow-2xl shadow-black/60"
          : "border-white/5 shadow-lg shadow-black/40"
      } ${win.minimized ? "hidden" : ""} bg-[#12141c]/95`}
    >
      <header
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={commit}
        onPointerCancel={commit}
        onDoubleClick={() => toggleMaximize(win.id)}
        className={`flex h-9 shrink-0 select-none items-center gap-2 border-b border-white/5 px-3 ${
          win.maximized ? "cursor-default" : "cursor-grab active:cursor-grabbing"
        }`}
      >
        <div className="flex items-center gap-2" data-no-drag>
          <button
            aria-label="Fermer la fenêtre"
            onClick={() => closeWindow(win.id)}
            className="group grid h-3.5 w-3.5 place-items-center rounded-full bg-[#ff5f57] hover:brightness-110"
          >
            <X className="h-2 w-2 text-black/50 opacity-0 group-hover:opacity-100" />
          </button>
          <button
            aria-label="Réduire la fenêtre"
            onClick={() => minimizeWindow(win.id)}
            className="group grid h-3.5 w-3.5 place-items-center rounded-full bg-[#febc2e] hover:brightness-110"
          >
            <Minus className="h-2 w-2 text-black/50 opacity-0 group-hover:opacity-100" />
          </button>
          <button
            aria-label="Agrandir la fenêtre"
            onClick={() => toggleMaximize(win.id)}
            className="group grid h-3.5 w-3.5 place-items-center rounded-full bg-[#28c840] hover:brightness-110"
          >
            <Square className="h-1.5 w-1.5 text-black/50 opacity-0 group-hover:opacity-100" />
          </button>
        </div>
        <div className="ml-1 flex items-center gap-1.5 text-xs text-gray-300">
          {Icon && (
            <Icon
              className="h-3.5 w-3.5"
              style={{ color: active ? secondaryColor : undefined }}
            />
          )}
          <span className="font-mono">{win.title}</span>
        </div>
      </header>
      <div className="min-h-0 flex-1 overflow-auto overscroll-contain">
        {children}
      </div>
    </section>
  );
};

export default Window;
