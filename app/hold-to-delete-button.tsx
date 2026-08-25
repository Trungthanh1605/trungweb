"use client";

import { DotLottie, type StateMachineStateEnteredEvent } from "@lottiefiles/dotlottie-web";
import { useEffect, useRef } from "react";

export default function HoldToDeleteButton({
  label,
  disabled,
  onDelete,
}: {
  label: string;
  disabled: boolean;
  onDelete: () => Promise<boolean>;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const animation = useRef<DotLottie>(null);
  const deleteAction = useRef(onDelete);
  const deleting = useRef(false);
  const disabledRef = useRef(disabled);

  useEffect(() => {
    deleteAction.current = onDelete;
    disabledRef.current = disabled;
  }, [disabled, onDelete]);

  useEffect(() => {
    let dotLottie: DotLottie | undefined;
    let handleDeleted: ((event: StateMachineStateEnteredEvent) => void) | undefined;
    const initialize = window.setTimeout(() => {
      if (!canvas.current) return;

      dotLottie = new DotLottie({
        canvas: canvas.current,
        src: "/hold-to-delete.lottie",
        autoplay: false,
        loop: false,
        stateMachineId: "StateMachine1",
        renderConfig: { autoResize: true },
      });
      handleDeleted = ({ state }) => {
        if (state !== "Deleted" || deleting.current || disabledRef.current) return;
        deleting.current = true;
        const reset = () => {
          if (!dotLottie) return;
          dotLottie.stateMachineStop();
          dotLottie.stateMachineLoad("StateMachine1");
          dotLottie.stateMachineStart();
          deleting.current = false;
        };
        void deleteAction.current().then((deleted) => {
          if (!deleted) reset();
        }, reset);
      };
      animation.current = dotLottie;
      dotLottie.addEventListener("stateMachineStateEntered", handleDeleted);
    });

    return () => {
      window.clearTimeout(initialize);
      if (handleDeleted) {
        dotLottie?.removeEventListener("stateMachineStateEntered", handleDeleted);
      }
      dotLottie?.destroy();
      animation.current = null;
    };
  }, []);

  const setHold = (value: "hold" | "release") => {
    if (!disabledRef.current) {
      animation.current?.stateMachineSetStringInput("Pointer Hold", value);
    }
  };

  return (
    <button
      type="button"
      aria-label={`Giữ để xóa ${label}`}
      title={`Giữ để xóa ${label}`}
      disabled={disabled}
      onPointerDown={() => setHold("hold")}
      onPointerUp={() => setHold("release")}
      onPointerCancel={() => setHold("release")}
      onPointerLeave={() => setHold("release")}
      onKeyDown={(event) => {
        if ((event.key === "Enter" || event.key === " ") && !event.repeat) {
          event.preventDefault();
          setHold("hold");
        }
      }}
      onKeyUp={(event) => {
        if (event.key === "Enter" || event.key === " ") setHold("release");
      }}
      onBlur={() => setHold("release")}
      className="h-11 w-28 shrink-0 touch-manipulation cursor-pointer overflow-hidden rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-color)] disabled:pointer-events-none disabled:cursor-wait disabled:opacity-50"
    >
      <canvas ref={canvas} aria-hidden="true" className="pointer-events-none h-full w-full scale-[1.7]" />
    </button>
  );
}
