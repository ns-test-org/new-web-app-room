import DrawingCanvas from '@/components/DrawingCanvas';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🎨 Collaborative Drawing Canvas
          </h1>
          <p className="text-lg text-gray-600">
            Draw, create, and collaborate in real-time!
          </p>
        </div>

        {/* Drawing Canvas */}
        <div className="flex justify-center">
          <DrawingCanvas width={800} height={600} />
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Use your mouse or touch to draw on the canvas above</p>
          <p>Choose different tools, colors, and brush sizes from the toolbar</p>
        </div>
      </div>
    </div>
  );
}

