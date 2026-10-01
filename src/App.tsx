import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DocumentList from './components/DocumentList';

function App() {
  return (
    <>
      <Header />

      <main>
        <Sidebar />
        <DocumentList />
      </main>
    </>
  );
}

export default App;