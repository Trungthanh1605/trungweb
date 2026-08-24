import LogoutButton from "./logout-button";
import PasskeyButton from "./passkey-button";
import ThemeToggle from "./theme-toggle";
import { signOut } from "./auth/actions";

export default function ProfileMenu({ email }: { email: string }) {
  return (
    <details className="profile-menu group fixed right-4 top-4 z-20 sm:right-6 sm:top-6">
      <summary
        aria-label="Mở hồ sơ người dùng"
        className="flex size-12 cursor-pointer list-none items-center justify-center rounded-full bg-blue-600 text-lg font-semibold text-white shadow-sm ring-2 ring-white transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--focus-color)] [&::-webkit-details-marker]:hidden"
      >
        {email.charAt(0).toUpperCase()}
      </summary>

      <div className="profile-panel absolute right-0 mt-3 max-h-[calc(100dvh-6.25rem)] w-72 overflow-y-auto rounded-3xl border border-black/10 bg-[var(--page-background)] p-4 text-center shadow-xl dark:border-white/10">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-semibold text-white">
          {email.charAt(0).toUpperCase()}
        </div>
        <p className="mt-3 truncate text-sm text-[var(--page-muted)]">{email}</p>

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
