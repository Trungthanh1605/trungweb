import Image from "next/image";

const services = ["Next.js", "Supabase", "Cloudflare Workers"];

export default function Home() {
  return (
    <main className="min-h-dvh bg-[#f3f4ef] px-6 py-8 text-[#17231c] sm:px-10 sm:py-12">
      <section className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-6xl flex-col justify-between rounded-3xl border border-[#17231c]/15 bg-white p-7 shadow-[0_24px_80px_rgba(23,35,28,0.08)] sm:min-h-[calc(100dvh-6rem)] sm:p-12">
        <header className="flex items-center justify-between gap-4 border-b border-[#17231c]/10 pb-5">
          <p className="text-sm font-bold uppercase tracking-[0.2em]">Trungweb</p>
          <span className="rounded-full bg-[#dceadf] px-3 py-1 text-xs font-semibold text-[#265f39]">
            Đang xây dựng
          </span>
        </header>

        <div className="grid items-center gap-12 py-16 md:grid-cols-[1.35fr_0.65fr]">
          <div>
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-[#50705a]">
              Nền tảng web mới
            </p>
            <h1 className="max-w-3xl text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-7xl">
              Chúng tôi đang chuẩn bị một trải nghiệm mới.
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-[#536158]">
              Đây là trang tạm thời trong lúc nội dung, hình ảnh và nhận diện
              chính thức được hoàn thiện.
            </p>
          </div>

          <div className="flex aspect-square items-center justify-center rounded-[2rem] bg-[#e7eee8]">
            <Image
              src="/globe.svg"
              alt="Hình ảnh minh họa tạm thời"
              width={140}
              height={140}
              priority
              className="h-28 w-28 opacity-55 sm:h-36 sm:w-36"
            />
          </div>
        </div>

        <footer className="flex flex-col gap-4 border-t border-[#17231c]/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[#667169]">Hạ tầng ban đầu đã sẵn sàng.</p>
          <ul className="flex flex-wrap gap-2" aria-label="Công nghệ sử dụng">
            {services.map((service) => (
              <li
                key={service}
                className="rounded-full border border-[#17231c]/15 px-3 py-1 text-xs font-medium"
              >
                {service}
              </li>
            ))}
          </ul>
        </footer>
      </section>
    </main>
  );
}
