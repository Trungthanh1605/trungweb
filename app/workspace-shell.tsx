"use client";

import { type ReactNode, useEffect, useRef, useState, useTransition } from "react";
import {
  createWorkspace,
  deleteWorkspace,
  saveLanguage,
  updateWorkspace,
} from "./auth/actions";
import HoldToDeleteButton from "./hold-to-delete-button";
import ProfileSettings from "./profile-settings";
import SettingsIcon from "./settings-icon";

export type Workspace = {
  id: number;
  name: string;
};

type Language = "vi" | "en";
type Section = "overview" | "projects" | "notes" | "activity" | "library" | "search" | "settings";

const navItems = [
  {
    id: "overview",
    path: <path strokeLinecap="round" strokeLinejoin="round" d="M3 11.5 12 4l9 7.5M5.5 10v9h13v-9M9 19v-5h6v5" />,
  },
  {
    id: "projects",
    path: <path strokeLinecap="round" strokeLinejoin="round" d="M3.5 7.5h6l1.5 2h9.5v8.5a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2V7.5Zm0 2h17" />,
  },
  {
    id: "notes",
    path: <path strokeLinecap="round" strokeLinejoin="round" d="M6 3.5h9l3 3V20H6V3.5Zm8.5.5v3h3M9 11h6M9 15h6" />,
  },
  {
    id: "activity",
    path: <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 2m6-2a9 9 0 1 1-9-9 9 9 0 0 1 9 9Z" />,
  },
  {
    id: "library",
    path: <path strokeLinecap="round" strokeLinejoin="round" d="M4 5h16v14H4V5Zm3 11 3.5-3.5 2.5 2.5 2-2 3 3M15.5 9h.01" />,
  },
] as const;

const copy = {
  vi: {
    sidebar: "Điều hướng chính",
    personalWorkspace: "Không gian cá nhân",
    collapse: "Thu gọn sidebar",
    expand: "Mở rộng sidebar",
    switchWorkspace: "Chuyển workspace",
    workspaces: "Workspace của bạn",
    newWorkspace: "Tạo workspace mới",
    workspacePlaceholder: "Ví dụ: Công việc",
    create: "Tạo",
    creating: "Đang tạo…",
    workspaceNameError: "Nhập tên workspace từ 1 đến 48 ký tự.",
    workspaceCreateError: "Không thể tạo workspace. Vui lòng thử lại.",
    workspaceUpdateError: "Không thể sửa workspace. Vui lòng thử lại.",
    workspaceDeleteError: "Không thể xóa workspace. Vui lòng thử lại.",
    editWorkspace: "Sửa workspace",
    saveWorkspace: "Lưu tên workspace",
    cancelWorkspaceEdit: "Hủy sửa workspace",
    holdToDelete: "Giữ để xóa",
    search: "Tìm kiếm",
    searchPlaceholder: "Tìm kiếm...",
    overview: "Tổng quan",
    projects: "Dự án",
    notes: "Ghi chú",
    activity: "Hoạt động",
    library: "Thư viện",
    settings: "Cài đặt",
    descriptions: {
      overview: "Tóm tắt không gian cá nhân của bạn.",
      projects: "Khu vực mock dành cho các dự án sau này.",
      notes: "Khu vực mock dành cho ghi chú cá nhân.",
      activity: "Dòng thời gian mẫu, chưa kết nối dữ liệu.",
      library: "Khu vực mock dành cho hình ảnh và tài liệu.",
      search: "Khu vực tìm kiếm mẫu, chưa kết nối dữ liệu.",
      settings: "Quản lý tài khoản và các tùy chọn cá nhân.",
    },
    mock: "Mock",
    sampleContent: "Nội dung mẫu",
    notConnected: "Chưa kết nối dữ liệu",
    emptyArea: "Khu vực trống",
    futureFeature: "Chức năng thật sẽ được bổ sung sau.",
    languageError: "Không thể lưu ngôn ngữ. Vui lòng thử lại.",
  },
  en: {
    sidebar: "Main navigation",
    personalWorkspace: "Personal workspace",
    collapse: "Collapse sidebar",
    expand: "Expand sidebar",
    switchWorkspace: "Switch workspace",
    workspaces: "Your workspaces",
    newWorkspace: "Create a new workspace",
    workspacePlaceholder: "For example: Work",
    create: "Create",
    creating: "Creating…",
    workspaceNameError: "Enter a workspace name between 1 and 48 characters.",
    workspaceCreateError: "Could not create the workspace. Please try again.",
    workspaceUpdateError: "Could not update the workspace. Please try again.",
    workspaceDeleteError: "Could not delete the workspace. Please try again.",
    editWorkspace: "Edit workspace",
    saveWorkspace: "Save workspace name",
    cancelWorkspaceEdit: "Cancel workspace editing",
    holdToDelete: "Hold to delete",
    search: "Search",
    searchPlaceholder: "Search...",
    overview: "Overview",
    projects: "Projects",
    notes: "Notes",
    activity: "Activity",
    library: "Library",
    settings: "Settings",
    descriptions: {
      overview: "A summary of your personal workspace.",
      projects: "A mock area reserved for future projects.",
      notes: "A mock area reserved for personal notes.",
      activity: "A sample timeline that is not connected to data yet.",
      library: "A mock area reserved for images and documents.",
      search: "A sample search area that is not connected to data yet.",
      settings: "Manage your account and personal preferences.",
    },
    mock: "Mock",
    sampleContent: "Sample content",
    notConnected: "Not connected to data",
    emptyArea: "Empty area",
    futureFeature: "The real feature will be added later.",
    languageError: "Could not save the language. Please try again.",
  },
} as const;

function SidebarIcon({ children }: { children: ReactNode }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="app-icon">
      {children}
    </svg>
  );
}

export default function WorkspaceShell({
  workspaces: initialWorkspaces,
  initialWorkspaceId,
  initialLanguage,
  account,
  children,
}: {
  workspaces: Workspace[];
  initialWorkspaceId: number;
  initialLanguage: Language;
  account: { email: string; name: string; avatarUrl: string | null };
  children?: ReactNode;
}) {
  const workspaceMenu = useRef<HTMLDetailsElement>(null);
  const [expanded, setExpanded] = useState(true);
  const [active, setActive] = useState<Section>("overview");
  const [workspaces, setWorkspaces] = useState(initialWorkspaces);
  const [workspaceId, setWorkspaceId] = useState(initialWorkspaceId);
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceError, setWorkspaceError] = useState<string>();
  const [editingWorkspaceId, setEditingWorkspaceId] = useState<number>();
  const [workspaceDraft, setWorkspaceDraft] = useState("");
  const [deletingWorkspaceId, setDeletingWorkspaceId] = useState<number>();
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const [languageError, setLanguageError] = useState<string>();
  const [workspacePending, startWorkspaceTransition] = useTransition();
  const [languagePending, startLanguageTransition] = useTransition();
  const text = copy[language];
  const currentWorkspace = workspaces.find((workspace) => workspace.id === workspaceId) ?? workspaces[0];
  const currentTitle = active === "search" ? text.search : text[active];
  const currentDescription = text.descriptions[active];

  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      const current = workspaceMenu.current;
      if (current?.open && !current.contains(event.target as Node)) current.open = false;
    };

    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, []);

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 639px)");
    const syncSidebar = () => setExpanded(!mobile.matches);
    syncSidebar();
    mobile.addEventListener("change", syncSidebar);
    return () => mobile.removeEventListener("change", syncSidebar);
  }, []);

  function selectWorkspace(id: number) {
    setWorkspaceId(id);
    setActive("overview");
    workspaceMenu.current?.removeAttribute("open");
    const url = new URL(window.location.href);
    url.searchParams.set("workspace", String(id));
    window.history.replaceState(window.history.state, "", url);
  }

  function handleCreateWorkspace(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedName = workspaceName.trim();
    setWorkspaceError(undefined);

    if (normalizedName.length < 1 || normalizedName.length > 48) {
      setWorkspaceError(text.workspaceNameError);
      return;
    }

    startWorkspaceTransition(async () => {
      try {
        const workspace = await createWorkspace(normalizedName);
        setWorkspaces((current) => [...current, workspace]);
        setWorkspaceName("");
        selectWorkspace(workspace.id);
      } catch {
        setWorkspaceError(text.workspaceCreateError);
      }
    });
  }

  function beginWorkspaceEdit(workspace: Workspace) {
    setWorkspaceError(undefined);
    setEditingWorkspaceId(workspace.id);
    setWorkspaceDraft(workspace.name);
  }

  function cancelWorkspaceEdit() {
    setEditingWorkspaceId(undefined);
    setWorkspaceDraft("");
  }

  function handleUpdateWorkspace(
    event: React.FormEvent<HTMLFormElement>,
    id: number,
  ) {
    event.preventDefault();
    const normalizedName = workspaceDraft.trim();
    setWorkspaceError(undefined);

    if (normalizedName.length < 1 || normalizedName.length > 48) {
      setWorkspaceError(text.workspaceNameError);
      return;
    }

    startWorkspaceTransition(async () => {
      try {
        const updated = await updateWorkspace(id, normalizedName);
        setWorkspaces((current) =>
          current.map((workspace) => workspace.id === id ? updated : workspace),
        );
        cancelWorkspaceEdit();
      } catch {
        setWorkspaceError(text.workspaceUpdateError);
      }
    });
  }

  async function handleDeleteWorkspace(workspace: Workspace) {
    setWorkspaceError(undefined);
    setDeletingWorkspaceId(workspace.id);

    try {
      await deleteWorkspace(workspace.id);
      const remaining = workspaces.filter(({ id }) => id !== workspace.id);

      if (editingWorkspaceId === workspace.id) cancelWorkspaceEdit();
      if (remaining.length === 0) {
        window.location.replace("/");
        return true;
      }

      setWorkspaces(remaining);
      setDeletingWorkspaceId(undefined);
      if (workspaceId === workspace.id) selectWorkspace(remaining[0].id);
      return true;
    } catch {
      setDeletingWorkspaceId(undefined);
      setWorkspaceError(text.workspaceDeleteError);
      return false;
    }
  }

  function handleLanguageChange(nextLanguage: Language) {
    const previousLanguage = language;
    setLanguage(nextLanguage);
    setLanguageError(undefined);
    document.documentElement.lang = nextLanguage;

    startLanguageTransition(async () => {
      try {
        await saveLanguage(nextLanguage);
      } catch {
        setLanguage(previousLanguage);
        document.documentElement.lang = previousLanguage;
        setLanguageError(copy[previousLanguage].languageError);
      }
    });
  }

  function selectSection(section: Section) {
    setActive(section);
    if (!expanded) setExpanded(true);
  }

  return (
    <main className="min-h-dvh overflow-x-hidden bg-[var(--page-background)] text-[var(--page-foreground)] transition-colors duration-300">
      <aside
        aria-label={text.sidebar}
        data-expanded={expanded}
        className={`${expanded ? "w-64 overflow-visible" : "w-14 overflow-hidden"} fixed inset-y-0 left-0 z-10 flex border-r border-[var(--ui-border)] bg-[var(--page-background)] transition-[width] duration-300 ease-out`}
      >
        <div className={`${expanded ? "w-64" : "w-14"} flex h-full shrink-0 flex-col p-2`}>
          <div className="flex items-center gap-1">
            <details
              ref={workspaceMenu}
              className={`group/workspace relative min-w-0 ${expanded ? "flex-1" : "w-10 shrink-0"}`}
            >
              <summary
                aria-label={text.switchWorkspace}
                onClick={(event) => {
                  if (!expanded) {
                    event.preventDefault();
                    setExpanded(true);
                  }
                }}
                className="grid h-12 cursor-pointer list-none grid-cols-[2.5rem_minmax(0,1fr)] items-center gap-2 rounded-2xl text-left transition-colors hover:bg-[var(--ui-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-color)] [&::-webkit-details-marker]:hidden"
              >
                <span className="grid size-10 place-items-center rounded-xl bg-[var(--page-foreground)] text-sm font-bold uppercase text-[var(--page-background)]">
                  {currentWorkspace?.name.charAt(0) || "W"}
                </span>
                <span className={`grid min-w-0 grid-cols-[minmax(0,1fr)_2rem] items-center transition-[opacity,transform] duration-200 ${expanded ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"}`}>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">{currentWorkspace?.name}</span>
                    <span className="block truncate text-xs text-[var(--page-muted)]">{text.personalWorkspace}</span>
                  </span>
                  <SidebarIcon>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m7 10 5 5 5-5" />
                  </SidebarIcon>
                </span>
              </summary>

              <div className="absolute left-0 top-14 z-20 w-[min(22rem,calc(100vw-1rem))] rounded-2xl border border-[var(--ui-border)] bg-[var(--page-background)] p-2 shadow-xl">
                <p className="px-2 pb-2 pt-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--page-muted)]">{text.workspaces}</p>
                <div className="max-h-56 space-y-1 overflow-y-auto">
                  {workspaces.map((workspace) => {
                    const editing = editingWorkspaceId === workspace.id;
                    return (
                      <div
                        key={workspace.id}
                        className={`flex h-11 min-w-0 items-center rounded-xl transition-colors ${workspace.id === workspaceId ? "bg-[var(--ui-active)] font-semibold" : "hover:bg-[var(--ui-hover)]"}`}
                      >
                        {editing ? (
                          <form
                            onSubmit={(event) => handleUpdateWorkspace(event, workspace.id)}
                            className="grid h-11 min-w-0 flex-1 grid-cols-[minmax(0,1fr)_2.75rem_2.75rem] items-center"
                          >
                            <input
                              autoFocus
                              aria-label={text.editWorkspace}
                              value={workspaceDraft}
                              maxLength={48}
                              disabled={workspacePending}
                              onChange={(event) => setWorkspaceDraft(event.target.value)}
                              className="h-9 min-w-0 rounded-lg border border-[var(--ui-border)] bg-[var(--page-background)] px-2 text-sm font-normal outline-none focus-visible:border-[var(--focus-color)] disabled:cursor-wait disabled:opacity-60"
                            />
                            <button
                              type="submit"
                              aria-label={text.saveWorkspace}
                              title={text.saveWorkspace}
                              disabled={workspacePending}
                              className="grid size-11 cursor-pointer place-items-center rounded-xl hover:bg-[var(--ui-hover)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--focus-color)] disabled:cursor-wait disabled:opacity-50"
                            >
                              <SidebarIcon><path strokeLinecap="round" strokeLinejoin="round" d="m5 12 4 4L19 6" /></SidebarIcon>
                            </button>
                            <button
                              type="button"
                              aria-label={text.cancelWorkspaceEdit}
                              title={text.cancelWorkspaceEdit}
                              disabled={workspacePending}
                              onClick={cancelWorkspaceEdit}
                              className="grid size-11 cursor-pointer place-items-center rounded-xl hover:bg-[var(--ui-hover)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--focus-color)] disabled:cursor-wait disabled:opacity-50"
                            >
                              <SidebarIcon><path strokeLinecap="round" d="m7 7 10 10M17 7 7 17" /></SidebarIcon>
                            </button>
                          </form>
                        ) : (
                          <>
                            <button
                              type="button"
                              aria-pressed={workspace.id === workspaceId}
                              onClick={() => selectWorkspace(workspace.id)}
                              className="flex h-11 min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-xl px-2 text-left text-sm focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--focus-color)]"
                            >
                              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[var(--ui-fill)] font-semibold uppercase">{workspace.name.charAt(0)}</span>
                              <span className="truncate">{workspace.name}</span>
                            </button>
                            <button
                              type="button"
                              aria-label={`${text.editWorkspace} ${workspace.name}`}
                              title={text.editWorkspace}
                              disabled={workspacePending || deletingWorkspaceId !== undefined}
                              onClick={() => beginWorkspaceEdit(workspace)}
                              className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-xl hover:bg-[var(--ui-hover)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--focus-color)] disabled:cursor-wait disabled:opacity-50"
                            >
                              <SidebarIcon><path strokeLinecap="round" strokeLinejoin="round" d="m4 20 4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20Zm10-12 3 3" /></SidebarIcon>
                            </button>
                            <HoldToDeleteButton
                              label={workspace.name}
                              actionLabel={text.holdToDelete}
                              disabled={workspacePending || deletingWorkspaceId !== undefined}
                              onDelete={() => handleDeleteWorkspace(workspace)}
                            />
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>

                <form onSubmit={handleCreateWorkspace} className="mt-2 border-t border-[var(--ui-border)] pt-2">
                  <label htmlFor="workspace-name" className="px-2 text-xs font-medium text-[var(--page-muted)]">{text.newWorkspace}</label>
                  <input
                    id="workspace-name"
                    value={workspaceName}
                    maxLength={48}
                    disabled={workspacePending}
                    placeholder={text.workspacePlaceholder}
                    onChange={(event) => setWorkspaceName(event.target.value)}
                    className="mt-1 h-11 w-full rounded-xl border border-[var(--ui-border)] bg-[var(--ui-subtle)] px-3 text-sm outline-none placeholder:text-[var(--page-muted)] focus-visible:border-[var(--focus-color)] disabled:cursor-wait disabled:opacity-60"
                  />
                  {workspaceError && <p role="alert" className="px-2 pt-1 text-xs text-red-600 dark:text-red-400">{workspaceError}</p>}
                  <button
                    type="submit"
                    disabled={workspacePending}
                    className="mt-2 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[var(--page-foreground)] px-3 text-sm font-semibold text-[var(--page-background)] transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-color)] disabled:cursor-wait disabled:opacity-60"
                  >
                    <SidebarIcon><path strokeLinecap="round" d="M12 5v14M5 12h14" /></SidebarIcon>
                    {workspacePending ? text.creating : text.create}
                  </button>
                </form>
              </div>
            </details>

            <button
              type="button"
              aria-label={expanded ? text.collapse : text.expand}
              aria-expanded={expanded}
              onClick={() => setExpanded((value) => !value)}
              className={`grid size-11 shrink-0 cursor-pointer place-items-center rounded-xl transition-[opacity,transform,background-color] hover:bg-[var(--ui-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-color)] ${expanded ? "opacity-100" : "pointer-events-none -translate-x-2 opacity-0"}`}
            >
              <SidebarIcon><path strokeLinecap="round" strokeLinejoin="round" d="m14.5 7-5 5 5 5" /></SidebarIcon>
            </button>
          </div>

          <div className="my-3 border-t border-[var(--ui-border)]" />

          <div className="min-h-0 flex-1 overflow-y-auto">
            <button
              type="button"
              title={expanded ? undefined : text.search}
              aria-pressed={active === "search"}
              onClick={() => selectSection("search")}
              className={`group/sidebar-item mb-3 grid h-11 w-full cursor-pointer grid-cols-[2.5rem_1fr_3rem] items-center gap-2 rounded-xl text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-color)] ${active === "search" ? "bg-[var(--ui-active)] font-semibold" : "bg-[var(--ui-subtle)] hover:bg-[var(--ui-hover)]"}`}
            >
              <span className={`grid size-10 place-items-center transition-transform duration-200 group-hover/sidebar-item:scale-110 ${active === "search" ? "scale-110" : ""}`}><SidebarIcon><circle cx="11" cy="11" r="6" /><path strokeLinecap="round" d="m16 16 4 4" /></SidebarIcon></span>
              <span className={`whitespace-nowrap text-sm text-[var(--page-muted)] transition-[opacity,transform] duration-200 ${expanded ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"}`}>{text.searchPlaceholder}</span>
              <kbd className={`whitespace-nowrap rounded-md border border-[var(--ui-border)] px-1.5 py-1 text-[10px] font-medium text-[var(--page-muted)] transition-[opacity,transform] duration-200 ${expanded ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"}`}>Ctrl K</kbd>
            </button>

            <nav aria-label={text.personalWorkspace} className="space-y-1">
              {navItems.map((item) => {
                const selected = item.id === active;
                return (
                  <button
                    key={item.id}
                    type="button"
                    title={expanded ? undefined : text[item.id]}
                    aria-pressed={selected}
                    onClick={() => selectSection(item.id)}
                    className={`group/sidebar-item grid h-11 w-full cursor-pointer grid-cols-[2.5rem_1fr] items-center gap-2 rounded-xl text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-color)] ${selected ? "bg-[var(--ui-active)] font-semibold" : "hover:bg-[var(--ui-hover)]"}`}
                  >
                    <span className={`grid size-10 place-items-center transition-transform duration-200 group-hover/sidebar-item:scale-110 ${selected ? "scale-110" : ""}`}><SidebarIcon>{item.path}</SidebarIcon></span>
                    <span className={`whitespace-nowrap text-sm transition-[opacity,transform] duration-200 ${expanded ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"}`}>{text[item.id]}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="mt-2 border-t border-[var(--ui-border)] pt-2">
            <button
              type="button"
              title={expanded ? undefined : text.settings}
              aria-pressed={active === "settings"}
              onClick={() => selectSection("settings")}
              className={`group/sidebar-item grid h-11 w-full cursor-pointer grid-cols-[2.5rem_1fr] items-center gap-2 rounded-xl text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-color)] ${active === "settings" ? "bg-[var(--ui-active)] font-semibold" : "hover:bg-[var(--ui-hover)]"}`}
            >
              <span className={`grid size-10 place-items-center transition-transform duration-200 group-hover/sidebar-item:scale-110 ${active === "settings" ? "scale-110" : ""}`}><SettingsIcon selected={active === "settings"} /></span>
              <span className={`whitespace-nowrap text-sm transition-[opacity,transform] duration-200 ${expanded ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"}`}>{text.settings}</span>
            </button>
          </div>
        </div>
      </aside>

      <section aria-labelledby="workspace-title" className={`${expanded ? "pl-14 sm:pl-64" : "pl-14"} min-h-dvh transition-[padding-left] duration-300 ease-out`}>
        <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="flex flex-wrap items-center gap-3">
            <h1 id="workspace-title" className="text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">{currentTitle}</h1>
            {active !== "settings" && <span className="rounded-full border border-[var(--ui-border)] px-2.5 py-1 text-xs font-medium text-[var(--page-muted)]">{text.mock}</span>}
          </div>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--page-muted)] sm:text-base">{currentDescription}</p>

          {active === "settings" ? (
            <ProfileSettings
              {...account}
              language={language}
              languagePending={languagePending}
              languageError={languageError}
              onLanguageChange={handleLanguageChange}
            />
          ) : (
            <div className="mt-8 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
              <section className="min-h-72 rounded-3xl border border-[var(--ui-border)] bg-[var(--ui-subtle)] p-5">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-sm font-semibold">{text.sampleContent}</h2>
                  <span className="text-xs text-[var(--page-muted)]">{text.notConnected}</span>
                </div>
                <div aria-hidden="true" className="mt-8 space-y-4">
                  <div className="h-16 rounded-2xl bg-[var(--ui-fill)]" />
                  <div className="h-16 rounded-2xl bg-[var(--ui-fill)]" />
                  <div className="h-16 rounded-2xl bg-[var(--ui-fill)]" />
                </div>
              </section>
              <section className="grid min-h-72 place-items-center rounded-3xl border border-dashed border-[var(--ui-border-strong)] p-6 text-center">
                <div>
                  <span className="mx-auto grid size-11 place-items-center rounded-2xl bg-[var(--ui-fill)]"><SidebarIcon><path strokeLinecap="round" d="M12 5v14M5 12h14" /></SidebarIcon></span>
                  <h2 className="mt-4 text-sm font-semibold">{text.emptyArea}</h2>
                  <p className="mt-1 text-sm text-[var(--page-muted)]">{text.futureFeature}</p>
                </div>
              </section>
            </div>
          )}
        </div>
      </section>

      {children}
    </main>
  );
}
