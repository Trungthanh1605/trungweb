"use client";

import { type ReactNode, useState } from "react";

const navItems = [
  {
    label: "Tổng quan",
    description: "Tóm tắt không gian cá nhân của bạn.",
    path: <path strokeLinecap="round" strokeLinejoin="round" d="M3 11.5 12 4l9 7.5M5.5 10v9h13v-9M9 19v-5h6v5" />,
  },
  {
    label: "Dự án",
    description: "Khu vực mock dành cho các dự án sau này.",
    path: <path strokeLinecap="round" strokeLinejoin="round" d="M3.5 7.5h6l1.5 2h9.5v8.5a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2V7.5Zm0 2h17" />,
  },
  {
    label: "Ghi chú",
    description: "Khu vực mock dành cho ghi chú cá nhân.",
    path: <path strokeLinecap="round" strokeLinejoin="round" d="M6 3.5h9l3 3V20H6V3.5Zm8.5.5v3h3M9 11h6M9 15h6" />,
  },
  {
    label: "Hoạt động",
    description: "Dòng thời gian mẫu, chưa kết nối dữ liệu.",
    path: <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 2m6-2a9 9 0 1 1-9-9 9 9 0 0 1 9 9Z" />,
  },
  {
    label: "Thư viện",
    description: "Khu vực mock dành cho hình ảnh và tài liệu.",
    path: <path strokeLinecap="round" strokeLinejoin="round" d="M4 5h16v14H4V5Zm3 11 3.5-3.5 2.5 2.5 2-2 3 3M15.5 9h.01" />,
  },
] as const;

const settingsItem = {
  label: "Cài đặt",
  description: "Khu vực mock dành cho các thiết lập sau này.",
};

const searchItem = {
  label: "Tìm kiếm",
  description: "Khu vực tìm kiếm mẫu, chưa kết nối dữ liệu.",
};

function SidebarIcon({ children }: { children: ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="app-icon"
    >
      {children}
    </svg>
  );
}

export default function WorkspaceShell({
  profile,
  children,
}: {
  profile: ReactNode;
  children?: ReactNode;
}) {
  const [expanded, setExpanded] = useState(true);
  const [active, setActive] = useState<string>("Tổng quan");
  const activeItem =
    active === searchItem.label
      ? searchItem
      : active === settingsItem.label
        ? settingsItem
        : (navItems.find((item) => item.label === active) ?? navItems[0]);

  return (
    <main className="min-h-dvh overflow-x-hidden bg-[var(--page-background)] text-[var(--page-foreground)] transition-colors duration-300">
      <aside
        aria-label="Điều hướng chính"
        data-expanded={expanded}
        className={`${expanded ? "w-64" : "w-14"} fixed inset-y-0 left-0 z-10 flex overflow-hidden border-r border-[var(--ui-border)] bg-[var(--page-background)] transition-[width] duration-300 ease-out`}
      >
        <div className="flex h-full w-64 shrink-0 flex-col p-2">
          <button
            type="button"
            aria-label={expanded ? "Thu gọn sidebar" : "Mở rộng sidebar"}
            aria-expanded={expanded}
            onClick={() => setExpanded((value) => !value)}
            className="grid h-12 w-full cursor-pointer grid-cols-[2.5rem_1fr_2.5rem] items-center gap-2 rounded-2xl text-left transition-colors hover:bg-[var(--ui-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-color)]"
          >
            <span className="grid size-10 place-items-center rounded-xl bg-[var(--page-foreground)] text-sm font-bold text-[var(--page-background)]">
              T
            </span>
            <span className={`min-w-0 whitespace-nowrap transition-[opacity,transform] duration-200 ${expanded ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"}`}>
              <span className="block truncate text-sm font-semibold">Trung Space</span>
              <span className="block truncate text-xs text-[var(--page-muted)]">Personal workspace</span>
            </span>
            <span className={`grid size-10 place-items-center transition-[opacity,transform] duration-200 ${expanded ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"}`}>
              <SidebarIcon>
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.5 7-5 5 5 5" />
              </SidebarIcon>
            </span>
          </button>

          <div className="my-3 border-t border-[var(--ui-border)]" />

          <div className="min-h-0 flex-1 overflow-y-auto">
            <button
              type="button"
              title={expanded ? undefined : searchItem.label}
              aria-pressed={active === searchItem.label}
              onClick={() => setActive(searchItem.label)}
              className={`mb-3 grid h-11 w-full cursor-pointer grid-cols-[2.5rem_1fr_3rem] items-center gap-2 rounded-xl text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-color)] ${active === searchItem.label ? "bg-[var(--ui-active)] font-semibold" : "bg-[var(--ui-subtle)] hover:bg-[var(--ui-hover)]"}`}
            >
              <span className="grid size-10 place-items-center">
                <SidebarIcon>
                  <circle cx="11" cy="11" r="6" />
                  <path strokeLinecap="round" d="m16 16 4 4" />
                </SidebarIcon>
              </span>
              <span className={`whitespace-nowrap text-sm text-[var(--page-muted)] transition-[opacity,transform] duration-200 ${expanded ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"}`}>
                Tìm kiếm...
              </span>
              <kbd className={`whitespace-nowrap rounded-md border border-[var(--ui-border)] px-1.5 py-1 text-[10px] font-medium text-[var(--page-muted)] transition-[opacity,transform] duration-200 ${expanded ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"}`}>
                Ctrl K
              </kbd>
            </button>

            <nav aria-label="Không gian cá nhân" className="space-y-1">
              {navItems.map((item) => {
                const selected = item.label === active;
                return (
                  <button
                    key={item.label}
                    type="button"
                    title={expanded ? undefined : item.label}
                    aria-pressed={selected}
                    onClick={() => setActive(item.label)}
                    className={`grid h-11 w-full cursor-pointer grid-cols-[2.5rem_1fr] items-center gap-2 rounded-xl text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-color)] ${selected ? "bg-[var(--ui-active)] font-semibold" : "hover:bg-[var(--ui-hover)]"}`}
                  >
                    <span className="grid size-10 place-items-center">
                      <SidebarIcon>{item.path}</SidebarIcon>
                    </span>
                    <span className={`whitespace-nowrap text-sm transition-[opacity,transform] duration-200 ${expanded ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"}`}>
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="mt-2 border-t border-[var(--ui-border)] pt-2">
            <button
              type="button"
              title={expanded ? undefined : "Cài đặt"}
              aria-pressed={active === settingsItem.label}
              onClick={() => setActive(settingsItem.label)}
              className={`grid h-11 w-full cursor-pointer grid-cols-[2.5rem_1fr] items-center gap-2 rounded-xl text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-color)] ${active === settingsItem.label ? "bg-[var(--ui-active)] font-semibold" : "hover:bg-[var(--ui-hover)]"}`}
            >
              <span className="grid size-10 place-items-center">
                <SidebarIcon>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm8 3-1.7-1 .1-2-2-1.2-1.7 1-1.8-.9-1.8.9-1.7-1-2 1.2.1 2-1.7 1v2l1.7 1-.1 2 2 1.2 1.7-1 1.8.9 1.8-.9 1.7 1 2-1.2-.1-2 1.7-1v-2Z" />
                </SidebarIcon>
              </span>
              <span className={`whitespace-nowrap text-sm transition-[opacity,transform] duration-200 ${expanded ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"}`}>
                Cài đặt <span className="text-xs text-[var(--page-muted)]">(mock)</span>
              </span>
            </button>
          </div>
        </div>
      </aside>

      {profile}

      <section
        aria-labelledby="workspace-title"
        className={`${expanded ? "pl-64" : "pl-14"} min-h-dvh transition-[padding-left] duration-300 ease-out`}
      >
        <div className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8">
          <div className="flex flex-wrap items-center gap-3">
            <h1 id="workspace-title" className="text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
              {activeItem.label}
            </h1>
            <span className="rounded-full border border-[var(--ui-border)] px-2.5 py-1 text-xs font-medium text-[var(--page-muted)]">
              Mock
            </span>
          </div>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--page-muted)] sm:text-base">
            {activeItem.description}
          </p>

          <div className="mt-8 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
            <section className="min-h-72 rounded-3xl border border-[var(--ui-border)] bg-[var(--ui-subtle)] p-5">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-sm font-semibold">Nội dung mẫu</h2>
                <span className="text-xs text-[var(--page-muted)]">Chưa kết nối dữ liệu</span>
              </div>
              <div aria-hidden="true" className="mt-8 space-y-4">
                <div className="h-16 rounded-2xl bg-[var(--ui-fill)]" />
                <div className="h-16 rounded-2xl bg-[var(--ui-fill)]" />
                <div className="h-16 rounded-2xl bg-[var(--ui-fill)]" />
              </div>
            </section>
            <section className="grid min-h-72 place-items-center rounded-3xl border border-dashed border-[var(--ui-border-strong)] p-6 text-center">
              <div>
                <span className="mx-auto grid size-11 place-items-center rounded-2xl bg-[var(--ui-fill)]">
                  <SidebarIcon>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
                  </SidebarIcon>
                </span>
                <h2 className="mt-4 text-sm font-semibold">Khu vực trống</h2>
                <p className="mt-1 text-sm text-[var(--page-muted)]">Chức năng thật sẽ được bổ sung sau.</p>
              </div>
            </section>
          </div>
        </div>
      </section>

      {children}
    </main>
  );
}
