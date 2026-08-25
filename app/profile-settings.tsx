"use client";

import Image from "next/image";
import LogoutButton from "./logout-button";
import PasskeyButton from "./passkey-button";
import ThemeToggle from "./theme-toggle";
import { signOut } from "./auth/actions";

type Language = "vi" | "en";

export default function ProfileSettings({
  email,
  name,
  avatarUrl,
  language,
  languagePending,
  languageError,
  onLanguageChange,
}: {
  email: string;
  name: string;
  avatarUrl: string | null;
  language: Language;
  languagePending: boolean;
  languageError?: string;
  onLanguageChange: (language: Language) => void;
}) {
  const english = language === "en";
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.8fr)]">
      <section className="rounded-3xl border border-[var(--ui-border)] bg-[var(--ui-subtle)] p-4 sm:p-5">
        <h2 className="text-sm font-semibold">
          {english ? "Account" : "Tài khoản"}
        </h2>

        <div className="mt-4 flex min-h-20 items-center gap-3 rounded-2xl bg-[var(--ui-fill)] p-3">
          <span className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-full bg-blue-600 font-semibold text-white ring-1 ring-[var(--ui-border-strong)]">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={
                  english
                    ? `${name}'s account avatar`
                    : `Ảnh đại diện tài khoản của ${name}`
                }
                width={48}
                height={48}
                className="size-12 object-cover"
              />
            ) : (
              initial
            )}
          </span>
          <div className="min-w-0 flex-1">
            <p className="overflow-marquee text-sm font-semibold" title={name}>
              <span>{name}</span>
            </p>
            <p
              className="overflow-marquee mt-0.5 text-xs text-[var(--page-muted)]"
              title={email}
            >
              <span>{email}</span>
            </p>
          </div>
        </div>

        <div className="mt-3">
          <PasskeyButton mode="register" language={language} />
        </div>
      </section>

      <section className="flex rounded-3xl border border-[var(--ui-border)] bg-[var(--ui-subtle)] p-4 sm:p-5">
        <div className="flex w-full flex-col">
          <h2 className="text-sm font-semibold">
            {english ? "Preferences" : "Tùy chọn"}
          </h2>

          <label className="mt-4 grid h-11 grid-cols-[minmax(0,1fr)_8.75rem] items-center gap-3 rounded-2xl bg-[var(--ui-fill)] pl-3">
            <span className="truncate text-sm font-medium">
              {english ? "Language" : "Ngôn ngữ"}
            </span>
            <select
              value={language}
              disabled={languagePending}
              aria-describedby={languageError ? "language-error" : undefined}
              onChange={(event) => onLanguageChange(event.target.value as Language)}
              className="h-11 min-w-0 cursor-pointer rounded-2xl border border-[var(--ui-border)] bg-[var(--page-background)] px-3 text-sm outline-none focus-visible:border-[var(--focus-color)] disabled:cursor-wait disabled:opacity-60"
            >
              <option value="vi">Tiếng Việt</option>
              <option value="en">English</option>
            </select>
          </label>

          <div className="mt-2 flex h-11 w-full items-center justify-between rounded-2xl bg-[var(--ui-fill)] pl-3">
            <span className="text-sm font-medium">
              {english ? "Appearance" : "Giao diện"}
            </span>
            <ThemeToggle compact language={language} />
          </div>

          {languageError && (
            <p id="language-error" role="alert" className="mt-2 text-sm text-red-600 dark:text-red-400">
              {languageError}
            </p>
          )}

          <form action={signOut} className="mt-auto pt-5">
            <LogoutButton label={english ? "Log out" : "Đăng xuất"} />
          </form>
        </div>
      </section>
    </div>
  );
}
