import Link from "next/link";

interface ListProps {
  items: {
    slug: string;
    title: string;
    dateString: string;
  }[];
}

export default function List({ items }: ListProps) {
  return (
    <ul className="space-y-4 list-none pl-0">
      {items.map((item) => (
        <li className="pl-0" key={item.slug}>
          <div className="flex flex-col gap-1">
            <div className="flex justify-between gap-2">
              <Link
                href={`/projects/${item.slug}`}
                className="no-underline hover:underline"
              >
                {item.title}
              </Link>
              <span className="text-stone-400 whitespace-nowrap text-base">
                {item.dateString}
              </span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
