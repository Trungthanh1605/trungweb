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

export async function saveLanguage(language: "vi" | "en") {
  if (language !== "vi" && language !== "en") {
    throw new Error("Ngôn ngữ không hợp lệ.");
  }

  const supabase = await createClient();
  const { data, error: authError } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;

  if (authError || !userId) throw new Error("Bạn cần đăng nhập để lưu ngôn ngữ.");

  const { error } = await supabase
    .from("user_preferences")
    .upsert({ user_id: userId, language }, { onConflict: "user_id" });

  if (error) throw new Error("Không thể lưu ngôn ngữ.");
}

export async function createWorkspace(name: string) {
  const normalizedName = name.trim();
  if (normalizedName.length < 1 || normalizedName.length > 48) {
    throw new Error("Tên workspace phải có từ 1 đến 48 ký tự.");
  }

  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getClaims();
  const userId = authData?.claims?.sub;

  if (authError || !userId) throw new Error("Bạn cần đăng nhập để tạo workspace.");

  const { data, error } = await supabase
    .from("workspaces")
    .insert({ owner_user_id: userId, name: normalizedName })
    .select("id, name")
    .single();

  if (error?.code === "23505") throw new Error("Bạn đã có workspace với tên này.");
  if (error || !data) throw new Error("Không thể tạo workspace.");

  return { id: data.id as number, name: data.name as string };
}

export async function updateWorkspace(id: number, name: string) {
  const normalizedName = name.trim();
  if (!Number.isSafeInteger(id) || id < 1) {
    throw new Error("Workspace không hợp lệ.");
  }
  if (normalizedName.length < 1 || normalizedName.length > 48) {
    throw new Error("Tên workspace phải có từ 1 đến 48 ký tự.");
  }

  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getClaims();
  const userId = authData?.claims?.sub;

  if (authError || !userId) throw new Error("Bạn cần đăng nhập để sửa workspace.");

  const { data, error } = await supabase
    .from("workspaces")
    .update({ name: normalizedName })
    .eq("id", id)
    .eq("owner_user_id", userId)
    .select("id, name")
    .single();

  if (error?.code === "23505") throw new Error("Bạn đã có workspace với tên này.");
  if (error || !data) throw new Error("Không thể sửa workspace.");

  return { id: data.id as number, name: data.name as string };
}

export async function deleteWorkspace(id: number) {
  if (!Number.isSafeInteger(id) || id < 1) {
    throw new Error("Workspace không hợp lệ.");
  }

  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getClaims();
  const userId = authData?.claims?.sub;

  if (authError || !userId) throw new Error("Bạn cần đăng nhập để xóa workspace.");

  const { data, error } = await supabase
    .from("workspaces")
    .delete()
    .eq("id", id)
    .eq("owner_user_id", userId)
    .select("id")
    .single();

  if (error || !data) throw new Error("Không thể xóa workspace.");
}
