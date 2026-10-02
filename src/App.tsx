import { useState } from 'react';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DocumentList from './components/DocumentList';

function App() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );

  return (
    <div className="app">
      <Header />

      <div className="app-body">
        <Sidebar onSelectCategory={setSelectedCategoryId} />

        <main className="app-content">
          <DocumentList categoryId={selectedCategoryId} />
        </main>
      </div>
    </div>
  );
}

export default App;