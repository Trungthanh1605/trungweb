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

## Kiểm tra Cloudflare

```powershell
npm run build
npm run preview
```

Cloudflare Builds chạy `npx opennextjs-cloudflare build`, sau đó dùng
`npx wrangler deploy` để triển khai production.
