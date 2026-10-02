interface SidebarProps {
  onSelectCategory: (categoryId: string) => void;
}

import { useState } from 'react';
import { categories } from '../data/categories';

function Sidebar({ onSelectCategory }: SidebarProps) {
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const rootCategories = categories.filter(
    (category) => !category.parentId,
  );

  const getChildren = (categoryId: string) =>
    categories.filter(
      (category) => category.parentId === categoryId,
    );

  const toggleCategory = (categoryId: string) => {
    setOpenCategory(
      openCategory === categoryId ? null : categoryId,
    );
  };

  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Temes</h2>

      <ul className="sidebar-list">
        {rootCategories.map((category) => {
          const children = getChildren(category.id);
          const hasChildren = children.length > 0;
          const isOpen = openCategory === category.id;

          return (
            <li key={category.id}>
              {hasChildren ? (
                <>
                  <button
                    className="sidebar-dropdown"
                    onClick={() => toggleCategory(category.id)}
                  >
                    <span>{isOpen ? '▼' : '▶'}</span>
                    {category.name}
                  </button>

                  {isOpen && (
                    <ul className="sidebar-sublist">
                      {children.map((child) => (
                        <li key={child.id}>
                          {child.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                category.name
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

export default Sidebar;