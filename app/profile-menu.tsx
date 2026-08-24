"use client";

import LogoutButton from "./logout-button";
import PasskeyButton from "./passkey-button";
import ThemeToggle from "./theme-toggle";
import { signOut } from "./auth/actions";
import Image from "next/image";
import { useEffect, useRef } from "react";

export default function ProfileMenu({
  email,
  name,
  avatarUrl,
}: {
  email: string;
  name: string;
  avatarUrl: string | null;
}) {
  const menu = useRef<HTMLDetailsElement>(null);
  const initial = name.charAt(0).toUpperCase();

  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      const current = menu.current;
      if (current && !current.contains(event.target as Node)) current.open = false;
    };

    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, []);

  return (
    <details ref={menu} className="profile-menu group fixed right-4 top-4 z-20 sm:right-6 sm:top-6">
      <summary
        aria-label="Mở hồ sơ người dùng"
        className="flex size-12 cursor-pointer list-none items-center justify-center rounded-full bg-blue-600 text-lg font-semibold text-white shadow-sm ring-2 ring-white transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--focus-color)] [&::-webkit-details-marker]:hidden"
      >
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={`Ảnh đại diện của ${name}`}
            width={48}
            height={48}
            className="size-12 rounded-full object-cover"
          />
        ) : (
          initial
        )}
      </summary>

      <div className="profile-panel absolute right-0 mt-3 max-h-[calc(100dvh-6.25rem)] w-72 overflow-y-auto rounded-3xl border border-black/10 bg-[var(--page-background)] p-4 text-center shadow-xl dark:border-white/10">
        <div className="mx-auto flex size-16 items-center justify-center overflow-hidden rounded-full bg-blue-600 text-2xl font-semibold text-white">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt=""
              width={64}
              height={64}
              className="size-16 object-cover"
            />
          ) : (
            initial
          )}
        </div>
        <p className="mt-3 truncate font-semibold">{name}</p>
        <p className="mt-1 truncate text-sm text-[var(--page-muted)]">{email}</p>

        <div className="mt-5 flex flex-col items-center gap-3 border-t border-black/10 pt-4 dark:border-white/10">
          <div className="flex min-h-11 w-full items-center justify-between rounded-2xl bg-black/[0.04] px-3 dark:bg-white/[0.06]">
            <span className="text-sm font-medium">Giao diện</span>
            <ThemeToggle compact />
          </div>
          <PasskeyButton mode="register" />
          <form action={signOut}>
            <LogoutButton />
          </form>
        </div>
      </div>
    </details>
  );
}
