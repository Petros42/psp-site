import type { ActiveView, NavItem } from '../types';

interface NavDrawerProps {
  open: boolean;
  navItems: NavItem[];
  activeView: ActiveView;
  drawerContactLabel: string;
  onClose: () => void;
  onSelectNavItem: (item: NavItem) => void;
  onOpenContact: () => void;
}

export function NavDrawer({
  open,
  navItems,
  activeView,
  drawerContactLabel,
  onClose,
  onSelectNavItem,
  onOpenContact,
}: NavDrawerProps) {
  return (
    <aside
      className={`nav-drawer${open ? ' open' : ''}`}
      id="navDrawer"
      aria-hidden={!open}
    >
      <div>
        <div className="drawer-header">
          <span className="drawer-brand">PSP</span>
          <button
            type="button"
            className="close-btn"
            id="closeDrawerBtn"
            aria-label="Close menu"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <ul className="nav-list" id="navList">
          {navItems.map((item, index) => {
            const isActive =
              (item.action === 'front' && activeView.type === 'front') ||
              (item.action === 'gallery' && activeView.type === 'gallery') ||
              (item.action === 'category' &&
                activeView.type === 'category' &&
                item.categoryId === activeView.id);

            return (
              <li
                key={index}
                className={item.separated ? 'nav-item-separated' : undefined}
              >
                <button
                  type="button"
                  className={`nav-item-btn${isActive ? ' active' : ''}`}
                  onClick={() => onSelectNavItem(item)}
                >
                  <span>{item.title}</span>
                  {item.note && <span className="nav-item-note">{item.note}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="drawer-footer">
        <button
          type="button"
          className="drawer-sub-btn"
          id="drawerContactBtn"
          onClick={onOpenContact}
        >
          {drawerContactLabel}
        </button>
      </div>
    </aside>
  );
}
