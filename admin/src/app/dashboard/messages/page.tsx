import type { Metadata } from "next";
import { MessagesList } from "@/components/MessagesList";

export const metadata: Metadata = { title: "Messages" };

export default function MessagesPage() {
  return <MessagesList />;
}
