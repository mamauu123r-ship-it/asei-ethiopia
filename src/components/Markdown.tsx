import ReactMarkdown from "react-markdown";

// Shows text written in the admin editor. Markdown lets editors add headings
// (## Heading), bold (**bold**), lists (- item) and links ([text](https://...)).
// Raw HTML is not allowed, which keeps the site safe.
export function Markdown({ children }: { children: string }) {
  return (
    <div className="flex max-w-3xl flex-col gap-5 text-[18px] [&_a]:font-semibold [&_h2]:mt-6 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-ink [&_h3]:mt-4 [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-ink [&_ol]:ml-6 [&_ol]:list-decimal [&_strong]:text-ink [&_ul]:ml-6 [&_ul]:list-disc">
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  );
}
