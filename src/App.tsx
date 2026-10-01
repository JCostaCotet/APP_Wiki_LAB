import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DocumentList from './components/DocumentList';

function App() {
  return (
    <div className="app">
      <Header />

      <div className="app-body">
        <Sidebar />

        <main className="app-content">
          <DocumentList />
        </main>
      </div>
    </div>
  );
}

export default App;