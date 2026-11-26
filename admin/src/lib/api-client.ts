"use client";

import { useCallback, useEffect, useState } from "react";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: Record<string, string[] | undefined>,
  ) {
    super(message);
  }
}

/** Fetches a same-origin admin API route and returns the parsed JSON body. */
export async function apiFetch<T>(path: string, init?: RequestInit & { json?: unknown }): Promise<T> {
  const { json, ...rest } = init ?? {};
  const response = await fetch(path, {
    ...rest,
    headers: json === undefined ? rest.headers : { "Content-Type": "application/json", ...rest.headers },
    body: json === undefined ? rest.body : JSON.stringify(json),
  });

  if (response.status === 401) {
    window.dispatchEvent(new Event("st:unauthorized"));
    throw new ApiError("Your session has expired", 401);
  }

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError(body?.error ?? "Something went wrong", response.status, body?.details);
  }
  return body as T;
}

type State<T> = { key: string; data?: T; error?: string };

/** Loads `url` on mount and whenever it changes; `reload()` fetches again. */
export function useApi<T>(url: string) {
  const [version, setVersion] = useState(0);
  const [state, setState] = useState<State<T>>({ key: "" });
  const key = `${url}#${version}`;

  useEffect(() => {
    let active = true;
    apiFetch<T>(url).then(
      (data) => active && setState({ key, data }),
      (error: Error) => active && setState((prev) => ({ key, data: prev.data, error: error.message })),
    );
    return () => {
      active = false;
    };
  }, [url, key]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);
  const mutate = useCallback((update: (data: T) => T) => {
    setState((prev) => (prev.data === undefined ? prev : { ...prev, data: update(prev.data) }));
  }, []);

  return { data: state.data, error: state.error, loading: state.key !== key, reload, mutate };
}

/** Tells the dashboard shell to refresh the unread-messages badge. */
export function notifyMessagesChanged() {
  window.dispatchEvent(new Event("st:messages-changed"));
}
