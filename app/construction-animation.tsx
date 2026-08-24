"use client";

import { DotLottie } from "@lottiefiles/dotlottie-web";
import { useEffect, useRef } from "react";

export default function ConstructionAnimation() {
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
      role="button"
      tabIndex={0}
      aria-label="Nhấn để lật hoạt ảnh"
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          animation.current?.stateMachineFireEvent("clickEvent");
        }
      }}
      className="aspect-square w-full max-w-md cursor-pointer rounded-[2rem] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--focus-color)] [@media(max-height:600px)]:max-w-40"
    />
  );
}
