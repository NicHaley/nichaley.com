interface PageProps {
  title: string;
  formattedDate: string;
  children: React.ReactNode;
}

export default function Page({ title, formattedDate, children }: PageProps) {
  return (
    <article>
      <div>
        <h1 className="mb-2 text-2xl font-semibold">{title}</h1>
        <div className="flex items-center gap-2 py-2">
          <span className="text-sm">{formattedDate}</span>|
        </div>
      </div>
      {/* The markdown content */}
      {children}
    </article>
  );
}
