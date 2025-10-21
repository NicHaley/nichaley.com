import { notFound } from "next/navigation";
import Client from "./client";

export default function Page() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }
  return <Client />;
}
