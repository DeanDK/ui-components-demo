import './App.css';

import { useState } from 'react';

import { DataGrid } from '@/components/DataGrid/DataGrid';
import { eventColumns } from '@/config/dataGridColumns';
import { generateMockEvents } from '@/utils/mockData';

function App() {
  const [events] = useState(() => generateMockEvents(500));

  return (
    <div className="app">
      <header className="app-header">
        <h1>Event Manager</h1>
      </header>
      <main className="app-content">
        <DataGrid data={events} columns={eventColumns} pageSize={100} />
      </main>
    </div>
  );
}

export default App;
