"use client";

import { DotLottie } from "@lottiefiles/dotlottie-web";
import { useEffect, useRef } from "react";

const SELECTED_FRAME = 216;
const LAST_FRAME = 431;

export default function SettingsIcon({ selected }: { selected: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const animation = useRef<DotLottie>(null);
  const selectedRef = useRef(selected);

  const playSegment = (start: number, end: number) => {
    const player = animation.current;
    if (!player?.isLoaded) return;
    player.setSegment(start, end);
    player.setFrame(start);
    player.play();
  };

  useEffect(() => {
    selectedRef.current = selected;
    if (selected) {
      playSegment(0, SELECTED_FRAME);
    } else if (animation.current?.isLoaded) {
      playSegment(SELECTED_FRAME, LAST_FRAME);
    }
  }, [selected]);

  useEffect(() => {
    let player: DotLottie | undefined;
    let handleLoad: (() => void) | undefined;
    const initialize = window.setTimeout(() => {
      if (!canvas.current) return;

      player = new DotLottie({
        canvas: canvas.current,
        src: "/settings.lottie",
        autoplay: false,
        loop: false,
        speed: 3,
        renderConfig: { autoResize: false, devicePixelRatio: 2 },
      });
      handleLoad = () => player?.setFrame(selectedRef.current ? SELECTED_FRAME : 0);
      animation.current = player;
      player.addEventListener("load", handleLoad);
    });

    return () => {
      window.clearTimeout(initialize);
      if (handleLoad) player?.removeEventListener("load", handleLoad);
      player?.destroy();
      animation.current = null;
    };
  }, []);

  return (
    <span
      aria-hidden="true"
      className="grid size-10 place-items-center"
      onPointerEnter={() => {
        if (!selectedRef.current) playSegment(0, SELECTED_FRAME);
      }}
      onPointerLeave={() => {
        if (selectedRef.current) {
          animation.current?.setFrame(SELECTED_FRAME);
        } else {
          playSegment(SELECTED_FRAME, LAST_FRAME);
        }
      }}
    >
      <canvas
        ref={canvas}
        width={40}
        height={40}
        className="size-5 scale-x-[3.6] scale-y-[3.6]"
      />
    </span>
  );
}
