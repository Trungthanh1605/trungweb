"use client";

import { DotLottie } from "@lottiefiles/dotlottie-web";
import { useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";

export default function LogoutButton() {
  const { pending } = useFormStatus();
  const canvas = useRef<HTMLCanvasElement>(null);
  const animation = useRef<DotLottie>(null);

  useEffect(() => {
    let dotLottie: DotLottie | undefined;
    const handleLoad = () => canvas.current?.classList.remove("opacity-0");
    const initialize = window.setTimeout(() => {
      if (!canvas.current) return;

      dotLottie = new DotLottie({
        canvas: canvas.current,
        src: "/logout.lottie",
        autoplay: false,
        loop: false,
        renderConfig: { autoResize: true },
      });
      animation.current = dotLottie;
      dotLottie.addEventListener("load", handleLoad);
    });

    return () => {
      window.clearTimeout(initialize);
      dotLottie?.removeEventListener("load", handleLoad);
      dotLottie?.destroy();
      animation.current = null;
    };
  }, []);

  const play = () => {
    animation.current?.setFrame(0);
    animation.current?.play();
  };

  return (
    <button
      type="submit"
      aria-label="Đăng xuất"
      title="Đăng xuất"
      disabled={pending}
      onClick={play}
      onMouseEnter={play}
      onFocus={play}
      className="flex h-11 w-full cursor-pointer items-center justify-between overflow-hidden rounded-2xl bg-black/[0.04] pl-3 text-left transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-color)] disabled:cursor-wait disabled:opacity-60 dark:bg-white/[0.06]"
    >
      <span className="text-sm font-medium">Đăng xuất</span>
      <span className="profile-action-visual mr-1" aria-hidden="true">
        <canvas
          ref={canvas}
          className="pointer-events-none h-full w-full scale-[2.4] opacity-0 transition-opacity duration-200"
        />
      </span>
    </button>
  );
}
