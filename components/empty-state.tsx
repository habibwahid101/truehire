export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="panel px-5 py-12 sm:px-8">
      <p className="serif text-2xl">{title}</p>
      <p className="mt-2 max-w-lg text-sm text-muted">{body}</p>
    </div>
  );
}
