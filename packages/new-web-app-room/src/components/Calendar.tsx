'use client';

import { useState, useEffect } from 'react';
import CalendarGrid from './CalendarGrid';
import EventModal from './EventModal';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD format
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load events from localStorage on component mount
  useEffect(() => {
    const savedEvents = localStorage.getItem('calendar-events');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  }, []);

  // Save events to localStorage whenever events change
  useEffect(() => {
    localStorage.setItem('calendar-events', JSON.stringify(events));
  }, [events]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleAddEvent = (title: string, description: string) => {
    if (selectedDate) {
      const newEvent: Event = {
        id: Date.now().toString(),
        title,
        description,
        date: selectedDate
      };
      setEvents(prev => [...prev, newEvent]);
    }
    setIsModalOpen(false);
    setSelectedDate(null);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          ← Previous
        </button>
        
        <h1 className="text-2xl font-bold text-gray-800">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h1>
        
        <button
          onClick={() => navigateMonth('next')}
          className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          Next →
        </button>
      </div>

      {/* Calendar Grid */}
      <CalendarGrid
        currentDate={currentDate}
        events={events}
        onDateClick={handleDateClick}
        onDeleteEvent={handleDeleteEvent}
      />

      {/* Event Modal */}
      {isModalOpen && selectedDate && (
        <EventModal
          date={selectedDate}
          onAddEvent={handleAddEvent}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedDate(null);
          }}
        />
      )}
    </div>
  );
}
