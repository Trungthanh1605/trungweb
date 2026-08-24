# Trungweb

Dự án Next.js chạy trên Cloudflare Workers và sử dụng Supabase.

## Chạy trên máy

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Mở `http://localhost:3000`.

## Kết nối Supabase

Điền Project URL và Publishable key vào `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Không đưa secret key hoặc service-role key vào Git.

## Đăng nhập Google

1. Trong Google Auth Platform, tạo OAuth client loại **Web application** và thêm
   callback Supabase `https://<project-ref>.supabase.co/auth/v1/callback` vào
   **Authorized redirect URIs**.
2. Trong Supabase Dashboard → Authentication → Providers → Google, bật Google
   và nhập Client ID/Client Secret vừa tạo.
3. Trong Supabase Dashboard → Authentication → URL Configuration, thêm
   `http://localhost:3000/auth/callback` và callback của website production vào
   **Redirect URLs**.

## Kiểm tra Cloudflare

```powershell
npm run build
npm run preview
```

Cloudflare Builds chạy `npx opennextjs-cloudflare build`, sau đó dùng
`npx wrangler deploy` để triển khai production.

## Push GitHub và deploy

Chạy một lệnh trong PowerShell:

```powershell
npm run deploy -- "Mô tả thay đổi"
```

Lệnh này kiểm tra build, commit toàn bộ thay đổi, push lên nhánh `main`, sau đó
Cloudflare Builds tự động deploy lên `https://itstrung.dpdns.org`.
