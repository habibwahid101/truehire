export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="panel px-4 py-8 sm:px-6 sm:py-10">
      <p className="serif text-xl sm:text-2xl">{title}</p>
      <p className="mt-2 max-w-lg text-sm text-muted">{body}</p>
    </div>
  );
}
