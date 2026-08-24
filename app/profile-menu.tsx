import PasskeyButton from "./passkey-button";
import { signOut } from "./auth/actions";

export default function ProfileMenu({ email }: { email: string }) {
  return (
    <details className="group fixed right-4 top-4 z-20 sm:right-6 sm:top-6">
      <summary
        aria-label="Mở hồ sơ người dùng"
        className="flex size-12 cursor-pointer list-none items-center justify-center rounded-full bg-blue-600 text-lg font-semibold text-white shadow-sm ring-2 ring-white transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--focus-color)] [&::-webkit-details-marker]:hidden"
      >
        {email.charAt(0).toUpperCase()}
      </summary>

      <div className="absolute right-0 mt-3 w-72 rounded-3xl border border-black/10 bg-[var(--page-background)] p-4 text-center shadow-xl dark:border-white/10">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-semibold text-white">
          {email.charAt(0).toUpperCase()}
        </div>
        <p className="mt-3 truncate text-sm text-[var(--page-muted)]">{email}</p>

        <div className="mt-5 flex flex-col items-center gap-3 border-t border-black/10 pt-4 dark:border-white/10">
          <PasskeyButton mode="register" />
          <form action={signOut}>
            <button className="min-h-11 cursor-pointer rounded-full border border-current px-5 py-2 text-sm font-semibold transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-color)]">
              Đăng xuất
            </button>
          </form>
        </div>
      </div>
    </details>
  );
}
