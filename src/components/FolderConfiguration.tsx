import { useEffect, useState } from 'react';
import {
  folderLabels,
  type FolderKey,
  type FolderSettings,
} from '../models/Settings';

export default function FolderConfiguration() {
  return (
    <div>
      {(Object.keys(folderLabels) as FolderKey[]).map((key) => (
        <FolderConfigurationItem key={key} folderKey={key} />
      ))}
    </div>
  );
}

function FolderConfigurationItem({ folderKey }: { folderKey: FolderKey }) {
  const [saved, setSaved] = useState<FolderSettings | null>(null);
  const [folderPath, setFolderPath] = useState('');
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    window.settings
      .load(folderKey)
      .then((result) => {
        setSaved(result);
        setFolderPath(result.folderPath);
        setError(result.error ?? '');
        setEditing(!result.accessible);
      })
      .catch(() => {
        setError('No s’ha pogut carregar la configuració.');
        setEditing(true);
      })
      .finally(() => setBusy(false));
  }, [folderKey]);

  async function chooseFolder() {
    setBusy(true);
    try {
      const selected = await window.settings.chooseFolder();
      if (selected) {
        setFolderPath(selected);
        setError('');
        setMessage('');
      }
    } catch {
      setError('No s’ha pogut obrir el selector de carpetes.');
    } finally {
      setBusy(false);
    }
  }

  async function save() {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const result = await window.settings.save(folderKey, folderPath);
      if (!result.accessible) {
        setError(result.error ?? 'La carpeta no és accessible.');
        return;
      }
      setSaved(result);
      setFolderPath(result.folderPath);
      setEditing(false);
      setMessage('Configuració desada en aquest ordinador.');
    } catch {
      setError('No s’ha pogut desar la configuració. Torna-ho a provar.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section
      className="folder-configuration"
      aria-labelledby={`${folderKey}-heading`}
      aria-busy={busy}
    >
      <div className="folder-heading-row">
        <h2 id={`${folderKey}-heading`}>{folderLabels[folderKey]}</h2>
        <span
          className={`folder-status ${saved?.accessible ? 'is-connected' : ''}`}
        >
          {busy
            ? 'Comprovant…'
            : saved?.accessible
              ? 'Accessible'
              : saved?.folderPath
                ? 'No accessible'
                : 'Sense configurar'}
        </span>
        {!editing && saved?.folderPath && (
          <button
            disabled={busy}
            onClick={() => {
              setEditing(true);
              setMessage('');
            }}
          >
            Canvia la carpeta
          </button>
        )}
      </div>
      {busy && <p role="status">Comprovant la carpeta…</p>}
      {editing ? (
        <>
          <p>
            Selecciona la carpeta compartida. La ruta es guardarà en aquest
            ordinador.
          </p>
          <label htmlFor={`${folderKey}-path`}>Ruta de la carpeta</label>
          <div className="folder-path-row">
            <input
              id={`${folderKey}-path`}
              value={folderPath}
              onChange={(event) => {
                setFolderPath(event.target.value);
                setError('');
              }}
              placeholder="\\servidor\documentacio"
              disabled={busy}
            />
            <button onClick={chooseFolder} disabled={busy}>
              Explora…
            </button>
          </div>
          <div className="folder-actions">
            <button
              className="primary-button"
              onClick={save}
              disabled={busy || !folderPath.trim()}
            >
              Desa la carpeta
            </button>
            {saved?.accessible && (
              <button
                disabled={busy}
                onClick={() => {
                  setFolderPath(saved.folderPath);
                  setEditing(false);
                  setError('');
                }}
              >
                Cancel·la
              </button>
            )}
          </div>
        </>
      ) : (
        saved?.folderPath && (
          <p className="folder-saved-path">{saved.folderPath}</p>
        )
      )}
      {error && (
        <p className="folder-error" role="alert">
          {error}
        </p>
      )}
      {message && (
        <p className="folder-success" role="status">
          {message}
        </p>
      )}
    </section>
  );
}
