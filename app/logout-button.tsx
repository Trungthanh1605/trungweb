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
      className="flex size-11 cursor-pointer items-center justify-center overflow-hidden rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-color)] disabled:cursor-wait disabled:opacity-60"
    >
      <canvas
        ref={canvas}
        aria-hidden="true"
        className="pointer-events-none size-11 scale-[2] opacity-0 transition-opacity duration-200"
      />
    </button>
  );
}
