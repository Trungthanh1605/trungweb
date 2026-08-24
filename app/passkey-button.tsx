"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function PasskeyButton({ mode }: { mode: "register" | "sign-in" }) {
  const router = useRouter();
  const [message, setMessage] = useState<string>();
  const [pending, setPending] = useState(false);
  const register = mode === "register";

  async function handleClick() {
    setPending(true);
    setMessage(undefined);

    const supabase = createClient();
    const { error } = register
      ? await supabase.auth.registerPasskey()
      : await supabase.auth.signInWithPasskey();

    setPending(false);
    if (error) {
      setMessage(`Không thể ${register ? "tạo" : "đăng nhập bằng"} passkey: ${error.message}`);
      return;
    }

    if (register) setMessage("Đã tạo passkey thành công.");
    else router.refresh();
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className="cursor-pointer rounded-full border border-current px-5 py-2 text-sm font-semibold transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-color)] disabled:cursor-wait disabled:opacity-50"
      >
        {pending ? "Đang xử lý…" : register ? "Tạo passkey" : "Đăng nhập bằng passkey"}
      </button>
      {message && (
        <p role="status" className="max-w-md text-sm text-[var(--page-muted)]">
          {message}
        </p>
      )}
    </div>
  );
}
