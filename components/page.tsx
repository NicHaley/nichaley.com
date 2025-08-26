interface PageProps {
  title: string;
  formattedDate: string;
  description: string;
  children: React.ReactNode;
}

export default function Page({
  title,
  formattedDate,
  description,
  children,
}: PageProps) {
  return (
    <article>
      <div>
        <h1 className="mb-2 text-2xl font-semibold">{title}</h1>
        <p className="mb-2 mt-0 text-stone-500">{description}</p>
        <span className="text-sm">{formattedDate}</span>
      </div>
      {/* The markdown content */}
      {children}
    </article>
  );
}
