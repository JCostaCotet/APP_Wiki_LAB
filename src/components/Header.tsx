function Header() {
  return (
    <header className="header">
      <h1 className="header-title">APP Wiki LAB</h1>

      <input
        className="header-search"
        type="text"
        placeholder="Buscar..."
      />
    </header>
  );
}

export default Header;