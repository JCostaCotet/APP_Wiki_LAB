import { useState } from 'react';

function Sidebar() {
  const [otIpsOpen, setOtIpsOpen] = useState(false);

  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Temes</h2>

      <ul className="sidebar-list">
        <li>
          <button
            className="sidebar-dropdown"
            onClick={() => setOtIpsOpen(!otIpsOpen)}
          >
            <span>{otIpsOpen ? '▼' : '▶'}</span>
            OT-IP's
          </button>

          {otIpsOpen && (
            <ul className="sidebar-sublist">
              <li>DPF</li>
              <li>Coure</li>
              <li>Màscara</li>
              <li>Marcatge</li>
              <li>Mecanitzat</li>
              <li>Test elèctric</li>
            </ul>
          )}
        </li>

        <li>Normes (IPC, UL...)</li>
        <li>Materials</li>
        <li>Normes Clients</li>
      </ul>
    </aside>
  );
}

export default Sidebar;