"use client";

import Link from "next/link";
import Calendar, { type Activity } from "react-activity-calendar";
import type { Response } from "@/lib/github";

export default function Contributions({
  contributions,
}: {
  contributions?: Response;
}) {
  if (!contributions) return null;

  return (
    <Link
      href="https://github.com/nichaley"
      target="_blank"
      className="group no-underline block overflow-hidden rounded-lg bg-linear-to-t from-stone-200 to-stone-100 p-4 dark:from-stone-900 dark:to-stone-800"
    >
      <div className="flex">
        <span className="mb-1 inline-flex rounded-md bg-stone-800 px-2 py-0.5 text-xs font-medium text-white dark:bg-stone-200 dark:text-stone-800">
          Contributions
        </span>
      </div>
      <div className="mb-3 text-lg font-medium text-stone-800 group-hover:underline dark:text-stone-200">
        {contributions.total.lastYear} in the last year
      </div>
      <div className="overflow-x-auto" style={{ direction: "rtl" }}>
        <Calendar
          data={contributions.contributions as Activity[]}
          maxLevel={4}
          theme={{
            light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
            dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
          }}
          hideTotalCount
        />
      </div>
    </Link>
  );
}
