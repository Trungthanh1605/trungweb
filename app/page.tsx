import ConstructionAnimation from "./construction-animation";
import ThemeToggle from "./theme-toggle";
import PasskeyButton from "./passkey-button";
import { signInWithGoogle, signOut } from "./auth/actions";
import { createClient } from "@/utils/supabase/server";

export default async function Home({ searchParams }: PageProps<"/">) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  const email = typeof claims?.email === "string" ? claims.email : null;
  const authError = (await searchParams).authError === "google";

  return (
    <main className="flex min-h-dvh items-center justify-center bg-[var(--page-background)] px-6 py-12 text-[var(--page-foreground)] transition-colors duration-300 [@media(max-height:600px)]:py-4">
      <ThemeToggle />

      <section className="flex w-full max-w-3xl flex-col items-center text-center">
        <ConstructionAnimation />

        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--page-muted)] transition-colors duration-300 [@media(max-height:600px)]:mt-0">
          Website đang được xây dựng
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.045em] sm:text-6xl [@media(max-height:600px)]:mt-2 [@media(max-height:600px)]:text-3xl">
          WELCOME
        </h1>
        <p className="mt-5 max-w-md text-base leading-7 text-[var(--page-muted)] transition-colors duration-300 sm:text-lg [@media(max-height:600px)]:mt-2 [@media(max-height:600px)]:text-sm [@media(max-height:600px)]:leading-5">
          PERSONAL WEBSITE.
        </p>

        {email ? (
          <div className="mt-8 flex flex-col items-center gap-3 [@media(max-height:600px)]:mt-4">
            <p className="text-sm text-[var(--page-muted)]">Đã đăng nhập: {email}</p>
            <PasskeyButton mode="register" />
            <form action={signOut}>
              <button className="cursor-pointer rounded-full border border-current px-5 py-2 text-sm font-semibold transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-color)]">
                Đăng xuất
              </button>
            </form>
          </div>
        ) : (
          <div className="mt-8 flex flex-col items-center gap-3 [@media(max-height:600px)]:mt-4">
            <form action={signInWithGoogle}>
              <button className="inline-flex cursor-pointer items-center gap-3 rounded-full border border-black/15 bg-white px-5 py-3 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-color)]">
                <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5">
                  <path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.5-.2-2.2H12v4.3h5.4a4.6 4.6 0 0 1-2 3v2.8h3.5c2-1.9 3.2-4.6 3.2-7.9Z" />
                  <path fill="#34A853" d="M12 22c2.9 0 5.3-1 7-2.6l-3.5-2.8c-1 .7-2.2 1-3.5 1a6.1 6.1 0 0 1-5.7-4.2H2.7v2.9A10 10 0 0 0 12 22Z" />
                  <path fill="#FBBC05" d="M6.3 13.4A6 6 0 0 1 6 12c0-.5.1-1 .3-1.4v-3H2.7A10 10 0 0 0 2 12c0 1.6.4 3 1 4.3l3.3-2.9Z" />
                  <path fill="#EA4335" d="M12 6.4c1.6 0 3 .6 4.1 1.6l3.1-3A10 10 0 0 0 2.7 7.7l3.6 2.9A6.1 6.1 0 0 1 12 6.4Z" />
                </svg>
                Đăng nhập bằng Google
              </button>
            </form>
            <PasskeyButton mode="sign-in" />
          </div>
        )}

        {authError && (
          <p role="alert" className="mt-3 text-sm text-red-600 dark:text-red-400">
            Đăng nhập Google không thành công. Vui lòng thử lại.
          </p>
        )}
      </section>
    </main>
  );
}
