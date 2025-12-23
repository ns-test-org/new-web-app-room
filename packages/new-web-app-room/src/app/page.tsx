export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl md:text-8xl font-bold text-gray-800 mb-6">
          Hello World
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8">
          Welcome to your new landing page
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl">
          Get Started
        </button>
      </div>
    </div>
  );
}

