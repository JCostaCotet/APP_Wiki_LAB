interface HeaderProps {
  settingsOpen: boolean;
  onOpenSettings: () => void;
  onBack: () => void;
}

function Header({ settingsOpen, onOpenSettings, onBack }: HeaderProps) {
  return (
    <header className="header">
      <h1 className="header-title">APP Wiki LAB</h1>

      {!settingsOpen && (
        <input
          className="header-search"
          type="text"
          placeholder="Buscar..."
          aria-label="Cerca documents"
        />
      )}
      <button
        className="navigation-button header-navigation"
        onClick={settingsOpen ? onBack : onOpenSettings}
      >
        {settingsOpen ? '← Torna als documents' : '⚙ Configuració'}
      </button>
    </header>
  );
}

export default Header;
