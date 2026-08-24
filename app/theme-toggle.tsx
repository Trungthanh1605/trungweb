"use client";

import { DotLottie } from "@lottiefiles/dotlottie-web";
import { useEffect, useRef } from "react";

type Theme = "light" | "dark";

const currentTheme = (): Theme =>
  document.documentElement.dataset.theme === "dark" ? "dark" : "light";

const idleMarker = (theme: Theme) =>
  theme === "dark" ? "Night Idle" : "Day Idle";

export default function ThemeToggle() {
  const button = useRef<HTMLButtonElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const animation = useRef<DotLottie>(null);
  const theme = useRef<Theme>("light");

  useEffect(() => {
    let dotLottie: DotLottie | undefined;
    let handleLoad: (() => void) | undefined;
    let handleComplete: (() => void) | undefined;

    theme.current = currentTheme();
    document.documentElement.dataset.theme = theme.current;
    button.current?.setAttribute(
      "aria-pressed",
      String(theme.current === "dark"),
    );

    const initialize = window.setTimeout(() => {
      if (!canvas.current) return;

      dotLottie = new DotLottie({
        canvas: canvas.current,
        src: "/theme-toggle.lottie",
        autoplay: true,
        loop: true,
        marker: idleMarker(theme.current),
        renderConfig: { autoResize: true },
      });
      handleLoad = () => {
        dotLottie?.setSpeed(2.5);
        canvas.current?.classList.remove("opacity-0");
      };
      handleComplete = () => {
        dotLottie?.setMarker(idleMarker(theme.current));
        dotLottie?.setLoop(true);
        dotLottie?.play();
      };

      animation.current = dotLottie;
      dotLottie.addEventListener("load", handleLoad);
      dotLottie.addEventListener("complete", handleComplete);
    });

    return () => {
      window.clearTimeout(initialize);
      if (handleLoad) dotLottie?.removeEventListener("load", handleLoad);
      if (handleComplete) {
        dotLottie?.removeEventListener("complete", handleComplete);
      }
      dotLottie?.destroy();
      animation.current = null;
    };
  }, []);

  const toggleTheme = () => {
    const next: Theme = theme.current === "dark" ? "light" : "dark";
    theme.current = next;
    document.documentElement.dataset.theme = next;
    button.current?.setAttribute("aria-pressed", String(next === "dark"));

    try {
      localStorage.setItem("theme", next);
    } catch {}

    animation.current?.setMarker(
      next === "dark" ? "Day to Night" : "Night to Day",
    );
    animation.current?.setLoop(false);
    animation.current?.play();
  };

  return (
    <button
      ref={button}
      type="button"
      aria-label="Chế độ tối"
      aria-pressed="false"
      title="Chuyển chế độ sáng/tối"
      onClick={toggleTheme}
      className="fixed right-4 top-4 z-10 h-12 w-[5.5rem] touch-manipulation overflow-hidden rounded-full transition-transform active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--focus-color)] sm:right-6 sm:top-6"
    >
      <canvas
        ref={canvas}
        aria-hidden="true"
        className="pointer-events-none h-full w-full opacity-0 transition-opacity duration-200"
      />
    </button>
  );
}
