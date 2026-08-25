"use client";

import type { PasskeyListItem } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import HoldToDeleteButton from "./hold-to-delete-button";

function PasskeyIcon({ busy }: { busy: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={`profile-action-icon ${busy ? "animate-pulse" : ""}`}
    >
      <circle cx="8" cy="15" r="4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m11 12 8-8m-2 2 2 2m-5 1 2 2" />
    </svg>
  );
}

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
    setPending(true);
    setMessage(undefined);
    const { error } = await createClient().auth.passkey.delete({ passkeyId: passkey.id });
    setPending(false);

    if (error) {
      setMessage(`Không thể xóa passkey: ${error.message}`);
      return false;
    }

    setPasskeys((current) => current.filter(({ id }) => id !== passkey.id));
    setMessage("Đã xóa passkey.");
    return true;
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
              className="flex h-11 items-center justify-between gap-2 rounded-2xl bg-black/[0.04] pl-3 dark:bg-white/[0.06]"
            >
              <span
                className="overflow-marquee min-w-0 flex-1 text-sm"
                title={passkey.friendly_name || "Passkey"}
              >
                <span>{passkey.friendly_name || "Passkey"}</span>
              </span>
              <HoldToDeleteButton
                label={passkey.friendly_name || "Passkey"}
                disabled={pending}
                onDelete={() => handleDelete(passkey)}
              />
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        aria-label={
          loading
            ? "Đang tải passkey"
            : pending
              ? "Đang xử lý passkey"
              : register
                ? "Tạo passkey"
                : "Đăng nhập bằng passkey"
        }
        title={register ? "Tạo passkey" : "Đăng nhập bằng passkey"}
        onClick={register ? handleRegister : handleSignIn}
        disabled={pending || loading}
        className={`${register ? "h-11 w-full justify-start rounded-2xl bg-black/[0.04] px-3 text-left text-sm font-medium dark:bg-white/[0.06]" : "size-11 justify-center rounded-full border border-current"} flex cursor-pointer items-center transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-color)] disabled:cursor-wait disabled:opacity-50`}
      >
        {register ? (
          loading ? (
            "Đang tải Passkey"
          ) : pending ? (
            "Đang xử lý Passkey"
          ) : (
            "Tạo Passkey"
          )
        ) : (
          <span className="profile-action-visual" aria-hidden="true">
            <PasskeyIcon busy={pending || loading} />
          </span>
        )}
      </button>
      {message && (
        <p role="status" className="max-w-md text-sm text-[var(--page-muted)]">
          {message}
        </p>
      )}
    </div>
  );
}
