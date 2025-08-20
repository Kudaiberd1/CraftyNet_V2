/**
 * Stylish 404 page (TypeScript + React + TailwindCSS)
 * - Modern gradient background
 * - Large, creative typography
 * - Simple but polished layout
 * - Only a button to go back to the home page
 */

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-6 text-center text-white">
      {/* Decorative blurred circles */}
      <div className="absolute -top-32 -left-32 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-black/20 blur-3xl" />

      <h1 className="mb-4 text-8xl font-extrabold tracking-tight drop-shadow-lg">
        404
      </h1>
      <p className="mb-8 max-w-lg text-lg font-medium text-white/90">
        Oops! The page you’re looking for has drifted into another galaxy.
      </p>

      <a
        href="/"
        className="rounded-xl bg-white/90 px-8 py-3 text-lg font-semibold text-indigo-700 shadow-lg transition hover:scale-105 hover:bg-white"
      >
        Back to Home
      </a>
    </div>
  );
}
