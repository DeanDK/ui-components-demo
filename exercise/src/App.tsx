import './App.css';

import { useMemo, useState } from 'react';

import { DataGrid } from '@/components/DataGrid/DataGrid';
import { Timeline } from '@/components/Timeline/Timeline';
import { eventColumns } from '@/config/dataGridColumns';
import type { Event } from '@/types';
import { generateMockEvents } from '@/utils/mockData';

function App() {
  const [events] = useState<Event[]>(() => generateMockEvents(250));

  // Get recent 50 events for timeline (sorted newest first)
  const timelineEvents = useMemo(
    () =>
      events
        .slice()
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, 50),
    [events],
  );

  const handleEventClick = (event: Event) => {
    console.log('Event clicked:', event);
    // TODO: Open edit modal when EventForm is ready
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>📅 Event Manager</h1>
      </header>

      <main className="app-content">
        <section className="section">
          <h2 className="section-title">📍 Timeline</h2>
          <Timeline events={timelineEvents} onEventClick={handleEventClick} />
        </section>

        <section className="section">
          <h2 className="section-title">📊 All Events</h2>
          <DataGrid data={events} columns={eventColumns} pageSize={20} />
        </section>
      </main>
    </div>
  );
}

export default App;
