import { useState } from 'react';
import type { Category } from '../models/Category';

interface SidebarProps {
  categories: Category[];
  onSelectCategory: (categoryId: string | null) => void;
  selectedCategoryId: string | null;
}

export default function Sidebar({
  categories,
  onSelectCategory,
  selectedCategoryId,
}: SidebarProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const children = new Map<string | undefined, Category[]>();
  for (const category of categories) {
    const siblings = children.get(category.parentId) ?? [];
    siblings.push(category);
    children.set(category.parentId, siblings);
  }
  function renderBranch(parentId?: string) {
    return (
      <ul className={parentId ? 'sidebar-sublist' : 'sidebar-list'}>
        {(children.get(parentId) ?? []).map((category) => (
          <li key={category.id}>
            <div className="category-row">
              {children.has(category.id) && (
                <button
                  className="category-toggle"
                  aria-label={`${expanded.has(category.id) ? 'Plega' : 'Desplega'} ${category.name}`}
                  aria-expanded={expanded.has(category.id)}
                  onClick={() =>
                    setExpanded((previous) => {
                      const next = new Set(previous);
                      if (next.has(category.id)) next.delete(category.id);
                      else next.add(category.id);
                      return next;
                    })
                  }
                >
                  {expanded.has(category.id) ? '▾' : '▸'}
                </button>
              )}
              <button
                className={`sidebar-item ${selectedCategoryId === category.id ? 'active' : ''}`}
                aria-current={
                  selectedCategoryId === category.id ? 'page' : undefined
                }
                onClick={() => onSelectCategory(category.id)}
              >
                {category.name}
              </button>
            </div>
            {expanded.has(category.id) && renderBranch(category.id)}
          </li>
        ))}
      </ul>
    );
  }
  return (
    <aside className="sidebar" aria-label="Categories de documents">
      <h2 className="sidebar-title">Temes</h2>
      <button
        className={`sidebar-item ${selectedCategoryId === null ? 'active' : ''}`}
        onClick={() => onSelectCategory(null)}
      >
        Tots els documents
      </button>
      {renderBranch()}
    </aside>
  );
}
