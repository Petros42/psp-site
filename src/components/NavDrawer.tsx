import type { ActiveView, NavItem } from '../types';

interface NavDrawerProps {
  open: boolean;
  navItems: NavItem[];
  activeView: ActiveView;
  drawerContactLabel: string;
  toggleProgrammesLabel: string;
  onClose: () => void;
  onOpenSimToolbar: () => void;
  onSelectNavItem: (item: NavItem) => void;
  onOpenContact: () => void;
  onToggleProgrammes: () => void;
}

export function NavDrawer({
  open,
  navItems,
  activeView,
  drawerContactLabel,
  toggleProgrammesLabel,
  onClose,
  onOpenSimToolbar,
  onSelectNavItem,
  onOpenContact,
  onToggleProgrammes,
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

        <button
          type="button"
          className="drawer-sub-btn drawer-sim-btn"
          id="openSimToolbarBtn"
          onClick={onOpenSimToolbar}
        >
          <span>Screen &amp; Zoom Toolbar</span>
          <span className="drawer-sim-btn-note">390 · A56 · 768 · %</span>
        </button>

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
        <button
          type="button"
          className="drawer-sub-btn"
          id="toggleProgrammesBtn"
          onClick={onToggleProgrammes}
        >
          {toggleProgrammesLabel}
        </button>
      </div>
    </aside>
  );
}
