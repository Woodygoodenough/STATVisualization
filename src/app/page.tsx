import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <h1 className="text-4xl font-bold mb-4">Statistics Visualization</h1>
      <p className="text-xl text-slate-600 mb-8 max-w-2xl">
        Interactive explanations and visualizations for statistics concepts.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl w-full">
        <Link
          href="/multivariate-normal"
          className="group relative flex flex-col items-start justify-between p-6 bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-200 transition-all"
        >
          <div>
            <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 mb-2">
              Multivariate Normal Distribution
            </h3>
            <p className="text-sm text-slate-500 text-left">
              Explore the 3D joint density, marginal distributions, and conditional probabilities.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
