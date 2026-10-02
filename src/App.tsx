import { useState } from 'react';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DocumentList from './components/DocumentList';

function App() {

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null,);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);

  return (
    <div className="app">
      <Header />

      <div className="app-body">
       <Sidebar
        onSelectCategory={setSelectedCategoryId}
        selectedCategoryId={selectedCategoryId}
      />        
        <main className="app-content">
          <DocumentList categoryId={selectedCategoryId} onSelectDocument={setSelectedDocumentId}/>
        </main>
      </div>
    </div>
  );
}

export default App;