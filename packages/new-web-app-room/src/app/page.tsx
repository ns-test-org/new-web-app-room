import Calendar from '../components/Calendar';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Simple Calendar App</h1>
          <p className="text-gray-600">Click on any date to add events</p>
        </div>
        <Calendar />
      </div>
    </div>
  );
}

