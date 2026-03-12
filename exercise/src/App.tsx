import './App.css';

import { DataGrid } from '@/components/DataGrid';
import { Form } from '@/components/Form';
import { EventTimelineItem } from '@/components/Timeline/renderers/EventTimelineItem';
import { Timeline } from '@/components/Timeline/Timeline';
import { eventColumns } from '@/features/events/config/dataGridColumns';
import {
  eventFormFields,
  eventSchema,
} from '@/features/events/config/eventFormFields.tsx';
import { useEventManager } from '@/features/events/hooks/useEventManager/useEventManager.ts';

function App() {
  const {
    events,
    timelineEvents,
    isFormOpen,
    successMessage,
    handleSaveEvent,
    handleCloseForm,
    handleNewEvent,
  } = useEventManager({
    initialCount: 500,
    timelineLimit: 50,
  });

  return (
    <div className="app">
      <header className="app-header">
        <h1>📅 Event Manager</h1>
        <button
          className="btn btn-primary"
          onClick={handleNewEvent}
          aria-label="Create new event"
        >
          + New Event
        </button>
      </header>

      {successMessage && (
        <div className="success-banner" role="status" aria-live="polite">
          {successMessage}
        </div>
      )}

      <main className="app-content">
        <section className="section">
          <h2 className="section-title">📍 Timeline</h2>
          <p className="section-description">
            Recent 50 events grouped by day. Use arrow keys to navigate.
          </p>
          <Timeline
            items={timelineEvents}
            renderItem={(event) => <EventTimelineItem event={event} />}
          />
        </section>

        <section className="section">
          <h2 className="section-title">📊 All Events</h2>
          <p className="section-description">
            Showing {events.length} events. Click column headers to sort.
          </p>
          <DataGrid
            data={events}
            columns={eventColumns}
            pageSize={20}
            enableColumnFilters={true}
            enableSorting={true}
          />
        </section>
      </main>

      {isFormOpen && (
        <Form
          title="Create New Event"
          fields={eventFormFields}
          schema={eventSchema}
          onSubmit={handleSaveEvent}
          onCancel={handleCloseForm}
          submitLabel="Create Event"
        />
      )}
    </div>
  );
}

export default App;
