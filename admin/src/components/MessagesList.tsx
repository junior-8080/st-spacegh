"use client";

import { ChevronDown, Inbox, Mail, MailOpen, MessageCircle, Phone, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button, buttonClass } from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { PageHeader } from "@/components/ui/Field";
import { Pagination } from "@/components/ui/Pagination";
import { useToast } from "@/components/ui/Toast";
import { apiFetch, notifyMessagesChanged, useApi } from "@/lib/api-client";
import { cn, formatDateTime, toWhatsAppNumber } from "@/lib/format";
import type { MessageDTO, Paginated } from "@/lib/types";

export function MessagesList() {
  const toast = useToast();
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<MessageDTO | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { data, error, loading, reload, mutate } = useApi<Paginated<MessageDTO>>(`/api/admin/messages?page=${page}`);

  async function setRead(message: MessageDTO, read: boolean) {
    mutate((prev) => ({ ...prev, data: prev.data.map((m) => (m.id === message.id ? { ...m, read } : m)) }));
    try {
      await apiFetch(`/api/admin/messages/${message.id}`, { method: "PATCH", json: { read } });
      notifyMessagesChanged();
    } catch (err) {
      mutate((prev) => ({ ...prev, data: prev.data.map((m) => (m.id === message.id ? { ...m, read: !read } : m)) }));
      toast.error(err instanceof Error ? err.message : "Could not update the message");
    }
  }

  function toggle(message: MessageDTO) {
    const opening = expanded !== message.id;
    setExpanded(opening ? message.id : null);
    if (opening && !message.read) setRead(message, true);
  }

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await apiFetch(`/api/admin/messages/${toDelete.id}`, { method: "DELETE" });
      toast.success("Message deleted");
      setToDelete(null);
      notifyMessagesChanged();
      reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete the message");
    } finally {
      setDeleting(false);
    }
  }

  const messages = data?.data ?? [];

  return (
    <>
      <PageHeader title="Messages" description="Enquiries and quote requests sent from the website contact form." />

      {loading && !data && (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-white" />
          ))}
        </div>
      )}
      {error && !data && <p className="text-sm text-red-600">{error}</p>}
      {data && !messages.length && (
        <div className="rounded-xl border border-neutral-200 bg-white px-6 py-16 text-center">
          <Inbox className="mx-auto size-10 text-neutral-300" aria-hidden />
          <p className="mt-3 font-semibold text-neutral-900">No messages yet</p>
          <p className="text-sm text-neutral-500">Submissions from the website contact form will appear here.</p>
        </div>
      )}

      <ul className="space-y-3">
        {messages.map((message) => {
          const isOpen = expanded === message.id;
          const subject = encodeURIComponent("Re: Your enquiry to ST-SPACE");
          const whatsappText = encodeURIComponent(`Hello ${message.name}, thank you for contacting ST-SPACE. `);
          return (
            <li
              key={message.id}
              className={cn(
                "overflow-hidden rounded-xl border bg-white shadow-sm transition",
                message.read ? "border-neutral-200" : "border-brand-gold/60 ring-1 ring-brand-gold/30",
              )}
            >
              <button
                type="button"
                onClick={() => toggle(message)}
                aria-expanded={isOpen}
                className="flex w-full items-start gap-4 px-5 py-4 text-left hover:bg-neutral-50"
              >
                <span
                  className={cn(
                    "mt-1.5 size-2.5 shrink-0 rounded-full",
                    message.read ? "bg-transparent ring-1 ring-neutral-300" : "bg-brand-gold",
                  )}
                  aria-hidden
                />
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <span className={cn("text-sm text-neutral-900", !message.read && "font-bold")}>
                      {message.name}
                      {message.company && <span className="font-normal text-neutral-500"> · {message.company}</span>}
                    </span>
                    <span className="text-xs text-neutral-500">{formatDateTime(message.createdAt)}</span>
                  </span>
                  <span className="mt-0.5 block text-xs font-semibold uppercase tracking-wide text-brand-gold-ink">
                    {message.service || "General enquiry"}
                  </span>
                  {!isOpen && <span className="mt-1 block truncate text-sm text-neutral-600">{message.message}</span>}
                  <span className="sr-only">{message.read ? "Read" : "Unread"}</span>
                </span>
                <ChevronDown className={cn("mt-1 size-4 shrink-0 text-neutral-400 transition", isOpen && "rotate-180")} aria-hidden />
              </button>

              {isOpen && (
                <div className="border-t border-neutral-100 px-5 pb-5 pt-4 sm:pl-11">
                  <dl className="grid gap-2 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="text-xs text-neutral-500">Email</dt>
                      <dd>
                        <a href={`mailto:${message.email}`} className="font-medium text-neutral-900 hover:text-brand-gold-ink">
                          {message.email}
                        </a>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-neutral-500">Phone</dt>
                      <dd>
                        <a href={`tel:${message.phone}`} className="font-medium text-neutral-900 hover:text-brand-gold-ink">
                          {message.phone}
                        </a>
                      </dd>
                    </div>
                  </dl>
                  <p className="mt-4 whitespace-pre-wrap rounded-lg bg-neutral-50 p-4 text-sm leading-relaxed text-neutral-800">
                    {message.message}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <a href={`mailto:${message.email}?subject=${subject}`} className={buttonClass("primary", "sm")}>
                      <Mail className="size-3.5" aria-hidden /> Reply by email
                    </a>
                    <a
                      href={`https://wa.me/${toWhatsAppNumber(message.phone)}?text=${whatsappText}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={buttonClass("dark", "sm")}
                    >
                      <MessageCircle className="size-3.5" aria-hidden /> Reply on WhatsApp
                    </a>
                    <a href={`tel:${message.phone}`} className={buttonClass("secondary", "sm")}>
                      <Phone className="size-3.5" aria-hidden /> Call
                    </a>
                    <Button variant="ghost" size="sm" onClick={() => setRead(message, !message.read)}>
                      <MailOpen className="size-3.5" aria-hidden /> Mark as {message.read ? "unread" : "read"}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => setToDelete(message)}>
                      <Trash2 className="size-3.5" aria-hidden /> Delete
                    </Button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {data && (
        <div className="mt-4 overflow-hidden rounded-xl bg-white">
          <Pagination page={data.page} totalPages={data.totalPages} total={data.total} onChange={setPage} />
        </div>
      )}

      <ConfirmModal
        open={Boolean(toDelete)}
        title="Delete this message?"
        message={`The message from ${toDelete?.name ?? ""} will be permanently deleted.`}
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}
