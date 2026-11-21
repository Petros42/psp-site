import { useRef, type MouseEvent } from 'react';
import type { ActiveView, NavItem } from '../types';

interface NavDrawerProps {
  open: boolean;
  navItems: NavItem[];
  activeView: ActiveView;
  drawerContactLabel: string;
  showPreviewControls: boolean;
  toggleProgrammesLabel: string;
  toggleToolbarLabel: string;
  onClose: () => void;
  onSelectNavItem: (item: NavItem) => void;
  onOpenContact: () => void;
  onTogglePreviewControls: () => void;
  onToggleProgrammes: () => void;
  onToggleToolbar: () => void;
}

export function NavDrawer({
  open,
  navItems,
  activeView,
  drawerContactLabel,
  showPreviewControls,
  toggleProgrammesLabel,
  toggleToolbarLabel,
  onClose,
  onSelectNavItem,
  onOpenContact,
  onTogglePreviewControls,
  onToggleProgrammes,
  onToggleToolbar,
}: NavDrawerProps) {
  const tapTimestampsRef = useRef<number[]>([]);

  const handleTripleTap = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    const now = Date.now();
    const recent = tapTimestampsRef.current.filter((t) => now - t <= 1500);
    recent.push(now);
    tapTimestampsRef.current = recent;

    if (recent.length >= 3) {
      tapTimestampsRef.current = [];
      onTogglePreviewControls();
    }
  };

  const handleFooterEmptyClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target instanceof Element && e.target.closest('button') !== null) {
      return;
    }
    handleTripleTap(e);
  };

  return (
    <aside
      className={`nav-drawer${open ? ' open' : ''}`}
      id="navDrawer"
      aria-hidden={!open}
    >
      <div>
        <div
          className="drawer-header select-none cursor-pointer"
          onClick={handleTripleTap}
        >
          <span className="drawer-brand">PSP</span>
          <button
            type="button"
            className="close-btn"
            id="closeDrawerBtn"
            aria-label="Close menu"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
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

      <div
        className="drawer-empty-space select-none cursor-pointer"
        onClick={handleTripleTap}
      />

      <div className="drawer-footer" onClick={handleFooterEmptyClick}>
        <button
          type="button"
          className="drawer-sub-btn"
          id="drawerContactBtn"
          onClick={onOpenContact}
        >
          {drawerContactLabel}
        </button>

        {showPreviewControls && (
          <>
            <button
              type="button"
              className="drawer-sub-btn"
              id="toggleProgrammesBtn"
              onClick={onToggleProgrammes}
            >
              {toggleProgrammesLabel}
            </button>
            <button
              type="button"
              className="drawer-sub-btn"
              id="toggleToolbarBtn"
              onClick={onToggleToolbar}
            >
              {toggleToolbarLabel}
            </button>
          </>
        )}
      </div>
    </aside>
  );
}
