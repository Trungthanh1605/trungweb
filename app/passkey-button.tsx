"use client";

import type { PasskeyListItem } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function PasskeyButton({ mode }: { mode: "register" | "sign-in" }) {
  const router = useRouter();
  const [message, setMessage] = useState<string>();
  const [pending, setPending] = useState(false);
  const [passkeys, setPasskeys] = useState<PasskeyListItem[]>([]);
  const [loading, setLoading] = useState(mode === "register");
  const register = mode === "register";

  useEffect(() => {
    if (!register) return;

    let active = true;
    const supabase = createClient();
    void supabase.auth.passkey.list().then(({ data, error }) => {
      if (!active) return;
      if (error) setMessage(`Không thể tải danh sách passkey: ${error.message}`);
      else setPasskeys(data ?? []);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [register]);

  async function handleRegister() {
    setPending(true);
    setMessage(undefined);

    const supabase = createClient();
    const { data, error } = await supabase.auth.registerPasskey();

    setPending(false);
    if (error) {
      if (error.name === "NotAllowedError") return;
      setMessage(`Không thể tạo passkey: ${error.message}`);
      return;
    }

    if (data) setPasskeys((current) => [...current, data]);
    setMessage("Đã tạo passkey thành công.");
  }

  async function handleDelete(passkey: PasskeyListItem) {
    const name = passkey.friendly_name || "Passkey";
    if (!window.confirm(`Xóa ${name}? Bạn sẽ không thể dùng passkey này để đăng nhập.`)) return;

    setPending(true);
    setMessage(undefined);
    const { error } = await createClient().auth.passkey.delete({ passkeyId: passkey.id });
    setPending(false);

    if (error) {
      setMessage(`Không thể xóa passkey: ${error.message}`);
      return;
    }

    setPasskeys((current) => current.filter(({ id }) => id !== passkey.id));
    setMessage("Đã xóa passkey.");
  }

  async function handleSignIn() {
    setPending(true);
    setMessage(undefined);
    const { error } = await createClient().auth.signInWithPasskey();
    setPending(false);

    if (error) {
      setMessage(`Không thể đăng nhập bằng passkey: ${error.message}`);
      return;
    }

    router.replace("/?welcome=1");
  }

  return (
    <div className="flex w-full flex-col items-center gap-2">
      {register && passkeys.length > 0 && (
        <ul className="w-full space-y-2 text-left">
          {passkeys.map((passkey) => (
            <li
              key={passkey.id}
              className="flex items-center justify-between gap-3 rounded-2xl bg-black/[0.04] px-3 py-2 dark:bg-white/[0.06]"
            >
              <span className="min-w-0 truncate text-sm">
                {passkey.friendly_name || "Passkey"}
              </span>
              <button
                type="button"
                onClick={() => handleDelete(passkey)}
                disabled={pending}
                className="cursor-pointer text-sm font-semibold text-red-600 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-color)] disabled:cursor-wait disabled:opacity-50 dark:text-red-400"
              >
                Xóa
              </button>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={register ? handleRegister : handleSignIn}
        disabled={pending || loading}
        className="cursor-pointer rounded-full border border-current px-5 py-2 text-sm font-semibold transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-color)] disabled:cursor-wait disabled:opacity-50"
      >
        {loading
          ? "Đang tải…"
          : pending
            ? "Đang xử lý…"
            : register
              ? passkeys.length > 0
                ? "Thêm passkey"
                : "Tạo passkey"
              : "Đăng nhập bằng passkey"}
      </button>
      {message && (
        <p role="status" className="max-w-md text-sm text-[var(--page-muted)]">
          {message}
        </p>
      )}
    </div>
  );
}
