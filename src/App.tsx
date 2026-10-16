import { useEffect, useRef, useState } from 'react';

import Header from './components/Header';
import FolderConfiguration from './components/FolderConfiguration';
import Sidebar from './components/Sidebar';
import DocumentList from './components/DocumentList';
import DocumentDetails from './components/DocumentDetails';
import { libraryLabels, type LibraryResult } from './models/Library';
import {
  folderLabels,
  type FolderKey,
  type FolderSettings,
} from './models/Settings';

function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [libraries, setLibraries] = useState<
    Partial<Record<FolderKey, LibraryResult>>
  >({});
  const [loadingKeys, setLoadingKeys] = useState<FolderKey[]>([]);
  const [refresh, setRefresh] = useState(0);
  const keys = Object.keys(folderLabels) as FolderKey[];
  const categories = keys.flatMap(
    (key) =>
      libraries[key]?.categories ?? [{ id: key, name: libraryLabels[key] }],
  );
  const documents = keys.flatMap((key) => libraries[key]?.documents ?? []);
  const [folderStates, setFolderStates] = useState<
    Partial<Record<FolderKey, FolderSettings>>
  >({});
  const settingsTitle = useRef<HTMLHeadingElement>(null);
  const documentsTitle = useRef<HTMLElement>(null);
  const hasNavigated = useRef(false);

  useEffect(() => {
    if (settingsOpen) return;
    let cancelled = false;
    setLibraries({});
    setFolderStates({});
    setLoadingKeys(Object.keys(folderLabels) as FolderKey[]);
    for (const key of Object.keys(folderLabels) as FolderKey[]) {
      window.settings
        .load(key)
        .then(async (result) => {
          if (!cancelled)
            setFolderStates((current) => ({ ...current, [key]: result }));
          if (cancelled) return;
          const library = result.accessible
            ? await window.library.scan(key)
            : {
                categories: [{ id: key, name: libraryLabels[key] }],
                documents: [],
                warnings: result.error
                  ? [`${libraryLabels[key]}: ${result.error}`]
                  : [],
              };
          if (!cancelled)
            setLibraries((current) => ({ ...current, [key]: library }));
        })
        .catch(() => {
          if (!cancelled)
            setFolderStates((current) => ({
              ...current,
              [key]: { folderPath: '', accessible: false },
            }));
          if (!cancelled)
            setLibraries((current) => ({
              ...current,
              [key]: {
                categories: [{ id: key, name: libraryLabels[key] }],
                documents: [],
                warnings: [
                  `No s’ha pogut llegir ${libraryLabels[key]}. Revisa la configuració i la connexió.`,
                ],
              },
            }));
        })
        .finally(() => {
          if (!cancelled)
            setLoadingKeys((current) => current.filter((item) => item !== key));
        });
    }
    return () => {
      cancelled = true;
    };
  }, [settingsOpen, refresh]);

  useEffect(() => {
    if (hasNavigated.current) {
      if (settingsOpen) settingsTitle.current?.focus();
      else documentsTitle.current?.focus();
    }
    hasNavigated.current = true;
  }, [settingsOpen]);

  const missingFolders = (Object.keys(folderLabels) as FolderKey[]).filter(
    (key) => folderStates[key] && !folderStates[key].folderPath,
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(
    null,
  );
  const selectedDocument = documents.find(
    (document) => document.id === selectedDocumentId,
  );

  return (
    <div className="app">
      <Header
        settingsOpen={settingsOpen}
        onOpenSettings={() => setSettingsOpen(true)}
        onBack={() => setSettingsOpen(false)}
      />

      {settingsOpen ? (
        <main className="settings-content">
          <div className="settings-page">
            <p className="settings-eyebrow">PREFERÈNCIES DE L’APLICACIÓ</p>
            <h1 ref={settingsTitle} tabIndex={-1}>
              Configuració
            </h1>
            <h2 className="settings-section-title">Carpetes de documents</h2>
            <p className="settings-description">
              Configura les quatre ubicacions que vols consultar.
            </p>
            <p className="settings-readonly-note">
              Les rutes es desen en aquest ordinador. Els documents de xarxa
              només es consulten.
            </p>
            <FolderConfiguration />
          </div>
        </main>
      ) : (
        <div className="app-body">
          <Sidebar
            categories={categories}
            onSelectCategory={setSelectedCategoryId}
            selectedCategoryId={selectedCategoryId}
          />
          <main
            className="app-content"
            ref={documentsTitle}
            tabIndex={-1}
            aria-label="Documents"
          >
            {missingFolders.length > 0 && (
              <div className="configuration-notice" role="status">
                <span>
                  Carpetes pendents de configurar:{' '}
                  {missingFolders.map((key) => folderLabels[key]).join(', ')}.
                </span>
                <button
                  className="navigation-button"
                  onClick={() => setSettingsOpen(true)}
                >
                  Obre Configuració
                </button>
              </div>
            )}
            <div className="library-toolbar">
              <span>Biblioteca de documents · Només lectura</span>
              <button
                className="navigation-button"
                disabled={loadingKeys.length > 0}
                onClick={() => setRefresh((value) => value + 1)}
              >
                Actualitza
              </button>
            </div>
            {keys
              .flatMap((key) => libraries[key]?.warnings ?? [])
              .map((warning, index) => (
                <p
                  className="folder-error"
                  role="alert"
                  key={`${index}:${warning}`}
                >
                  {warning}
                </p>
              ))}
            <DocumentList
              categories={categories}
              documents={documents}
              loading={loadingKeys.length > 0}
              categoryId={selectedCategoryId}
              onSelectDocument={setSelectedDocumentId}
            />
            {selectedDocument && (
              <DocumentDetails document={selectedDocument} />
            )}
          </main>
        </div>
      )}
    </div>
  );
}

export default App;
