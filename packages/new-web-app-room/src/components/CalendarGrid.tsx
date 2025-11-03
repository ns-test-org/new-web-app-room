'use client';

import { Event } from './Calendar';

interface CalendarGridProps {
  currentDate: Date;
  events: Event[];
  onDateClick: (date: string) => void;
  onDeleteEvent: (eventId: string) => void;
}

export default function CalendarGrid({ 
  currentDate, 
  events, 
  onDateClick, 
  onDeleteEvent 
}: CalendarGridProps) {
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getEventsForDate = (date: string) => {
    return events.filter(event => event.date === date);
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Create array of all calendar cells
  const calendarCells = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    calendarCells.push(null);
  }
  
  // Add cells for each day of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarCells.push(day);
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      {/* Day headers */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {dayNames.map(day => (
          <div key={day} className="text-center font-semibold text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {calendarCells.map((day, index) => {
          if (day === null) {
            return <div key={index} className="h-24"></div>;
          }

          const dateString = formatDate(year, month, day);
          const dayEvents = getEventsForDate(dateString);
          const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

          return (
            <div
              key={day}
              className={`
                h-24 p-2 border rounded-lg cursor-pointer transition-colors
                ${isToday 
                  ? 'bg-blue-100 border-blue-300' 
                  : 'bg-white border-gray-200 hover:bg-gray-50'
                }
              `}
              onClick={() => onDateClick(dateString)}
            >
              <div className={`font-semibold mb-1 ${isToday ? 'text-blue-600' : 'text-gray-800'}`}>
                {day}
              </div>
              
              {/* Events for this date */}
              <div className="space-y-1">
                {dayEvents.slice(0, 2).map(event => (
                  <div
                    key={event.id}
                    className="text-xs bg-blue-500 text-white px-2 py-1 rounded truncate cursor-pointer hover:bg-blue-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteEvent(event.id);
                    }}
                    title={`${event.title} - Click to delete`}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-xs text-gray-500">
                    +{dayEvents.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
