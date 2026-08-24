"use server";

import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function signInWithGoogle() {
  const origin = (await headers()).get("origin");
  if (!origin) throw new Error("Không xác định được địa chỉ website.");

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${origin}/auth/callback` },
  });

  if (error || !data.url) throw new Error("Không thể đăng nhập bằng Google.");
  redirect(data.url);
}

export async function signOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error("Không thể đăng xuất.");
  redirect("/");
}

export async function saveTheme(theme: "light" | "dark") {
  if (theme !== "light" && theme !== "dark") {
    throw new Error("Giao diện không hợp lệ.");
  }

  const supabase = await createClient();
  const { data, error: authError } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;

  if (authError || !userId) throw new Error("Bạn cần đăng nhập để lưu giao diện.");

  const { error } = await supabase
    .from("user_preferences")
    .upsert({ user_id: userId, theme }, { onConflict: "user_id" });

  if (error) throw new Error("Không thể lưu giao diện.");
}
