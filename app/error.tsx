'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8 text-center">
      <h1 className="text-3xl font-bold">Something went wrong</h1>
      <p className="text-zinc-400 max-w-sm">
        {error.message || 'An unexpected error occurred.'}
      </p>
      <button
        onClick={() => reset()}
        className="px-6 py-3 bg-rose-600 text-white rounded-lg text-lg cursor-pointer hover:bg-rose-700 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}