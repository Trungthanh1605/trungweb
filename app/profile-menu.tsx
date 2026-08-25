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

      <div className="profile-panel absolute right-0 mt-3 max-h-[calc(100dvh-6.25rem)] w-72 overflow-y-auto rounded-3xl border border-black/10 bg-[var(--page-background)] p-4 shadow-xl dark:border-white/10">
        <details open className="account-details w-full">
          <summary className="grid h-11 cursor-pointer list-none grid-cols-[2.25rem_minmax(0,1fr)_2.75rem] items-center gap-2 rounded-2xl bg-black/[0.04] px-2 text-left dark:bg-white/[0.06] [&::-webkit-details-marker]:hidden">
            <div className="flex size-9 items-center justify-center overflow-hidden rounded-full bg-blue-600 font-semibold text-white">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={`Ảnh đại diện của ${name}`}
                  width={36}
                  height={36}
                  className="size-9 object-cover"
                />
              ) : (
                initial
              )}
            </div>
            <div className="min-w-0">
              <p
                className="overflow-marquee text-sm font-semibold leading-4"
                title={name}
              >
                <span>{name}</span>
              </p>
              <p
                className="overflow-marquee text-xs leading-4 text-[var(--page-muted)]"
                title={email}
              >
                <span>{email}</span>
              </p>
            </div>
            <span className="profile-action-visual justify-self-center" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="account-chevron profile-action-icon transition-transform duration-200"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m6 9 6 6 6-6"
                />
              </svg>
            </span>
          </summary>

          <div className="mt-2 flex flex-col items-center gap-2">
            <PasskeyButton mode="register" />
          </div>
        </details>

        <div className="mt-2 flex h-11 w-full items-center justify-between rounded-2xl bg-black/[0.04] px-3 dark:bg-white/[0.06]">
          <span className="text-sm font-medium">Giao diện</span>
          <ThemeToggle compact />
        </div>
        <form action={signOut} className="mt-2 w-full">
          <LogoutButton />
        </form>
      </div>
    </details>
  );
}
