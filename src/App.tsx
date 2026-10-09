import { useState } from 'react';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DocumentList from './components/DocumentList';
import DocumentDetails from './components/DocumentDetails';
import { documents } from './data/documents';


function App() {

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null,);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const selectedDocument = documents.find(
  (document) => document.id === selectedDocumentId,
);

  return (
    <div className="app">
      <Header />

      <div className="app-body">
       <Sidebar
        onSelectCategory={setSelectedCategoryId}
        selectedCategoryId={selectedCategoryId}
      />        
        <main className="app-content">
          <DocumentList
            categoryId={selectedCategoryId}
            onSelectDocument={setSelectedDocumentId}
          />
          {selectedDocument && (<DocumentDetails document={selectedDocument} />)}
        </main>
      </div>
    </div>
  );
}

export default App;