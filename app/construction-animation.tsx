"use client";

import { DotLottie } from "@lottiefiles/dotlottie-web";
import { useEffect, useRef } from "react";

export default function ConstructionAnimation({ decorative = false }: { decorative?: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const animation = useRef<DotLottie>(null);

  useEffect(() => {
    let dotLottie: DotLottie | undefined;
    let startStateMachine: (() => void) | undefined;

    const initialize = window.setTimeout(() => {
      if (!canvas.current) return;

      dotLottie = new DotLottie({
        canvas: canvas.current,
        src: "/under-construction.lottie",
        autoplay: true,
        loop: true,
        renderConfig: { autoResize: true },
      });
      startStateMachine = () => {
        if (dotLottie?.stateMachineLoad("StateMachine1")) {
          dotLottie.stateMachineStart();
        }
      };

      animation.current = dotLottie;
      dotLottie.addEventListener("load", startStateMachine);
    });

    return () => {
      window.clearTimeout(initialize);
      if (startStateMachine) {
        dotLottie?.removeEventListener("load", startStateMachine);
      }
      dotLottie?.destroy();
      animation.current = null;
    };
  }, []);

  return (
    <canvas
      ref={canvas}
      role={decorative ? undefined : "button"}
      tabIndex={decorative ? -1 : 0}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : "Nhấn để lật hoạt ảnh"}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          animation.current?.stateMachineFireEvent("clickEvent");
        }
      }}
      className={`aspect-square w-full max-w-md rounded-[2rem] [@media(max-height:600px)]:max-w-40 ${decorative ? "" : "cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--focus-color)]"}`}
    />
  );
}
