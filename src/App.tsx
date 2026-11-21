import { useCallback, useEffect, useRef, useState } from 'react';
import { BottomBar } from './components/BottomBar';
import { CategoryReader } from './components/CategoryReader';
import { FrontStage } from './components/FrontStage';
import { InfoModal } from './components/InfoModal';
import { MomentsGallery } from './components/MomentsGallery';
import { NavDrawer } from './components/NavDrawer';
import { SimToolbar } from './components/SimToolbar';
import { TopBar } from './components/TopBar';
import { CATEGORY_ORDER, content } from './data/content';
import { GALLERY_PHOTOS } from './data/gallery';
import { UPCOMING_PROGRAMMES } from './data/programmes';
import type { ActiveView, CategoryId, Language, ModalState, NavItem, SimWidth } from './types';

function hasPreviewInUrl(): boolean {
  if (typeof window === 'undefined') return false;
  const hashMatches = window.location.hash.toLowerCase() === '#preview';
  const queryMatches = new URLSearchParams(window.location.search).get('preview') === 'true';
  return hashMatches || queryMatches;
}

function clearPreviewFromUrl(): void {
  if (typeof window === 'undefined') return;
  try {
    const url = new URL(window.location.href);
    let changed = false;
    if (url.searchParams.has('preview')) {
      url.searchParams.delete('preview');
      changed = true;
    }
    if (url.hash.toLowerCase() === '#preview') {
      url.hash = '';
      changed = true;
    }
    if (changed) {
      const nextUrl = `${url.pathname}${url.search}${url.hash}`;
      window.history.replaceState({}, '', nextUrl);
    }
  } catch {
    // Ignore history API restrictions in sandboxed frames
  }
}

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [activeView, setActiveView] = useState<ActiveView>({ type: 'front' });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modal, setModal] = useState<ModalState>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [drawerControlsVisible, setDrawerControlsVisible] = useState<boolean>(hasPreviewInUrl);
  const [programmesToggled, setProgrammesToggled] = useState<boolean>(false);
  const [toolbarOpen, setToolbarOpen] = useState<boolean>(false);
  const [simWidth, setSimWidth] = useState<SimWidth>('full');
  const [simZoom, setSimZoom] = useState<number>(1);

  const siteShellRef = useRef<HTMLDivElement>(null);
  const siteScrollRef = useRef<HTMLDivElement>(null);
  const heroLinesRef = useRef<HTMLDivElement>(null);
  const logoTapTimestampsRef = useRef<number[]>([]);

  const dict = content[currentLang];
  const isFront = activeView.type === 'front';
  const isGallery = activeView.type === 'gallery';
  const activeCategoryId = activeView.type === 'category' ? activeView.id : null;
  const activeCategory = activeCategoryId ? dict.categories[activeCategoryId] : null;
  const backdropOpen = drawerOpen || modal !== null;
  const programmesVisible = UPCOMING_PROGRAMMES.length > 0 || programmesToggled;

  const currentCategoryIndex = activeCategoryId
    ? CATEGORY_ORDER.indexOf(activeCategoryId)
    : -1;
  const prevCategoryId =
    currentCategoryIndex > 0 ? CATEGORY_ORDER[currentCategoryIndex - 1] : null;
  const nextCategoryId =
    currentCategoryIndex >= 0 && currentCategoryIndex < CATEGORY_ORDER.length - 1
      ? CATEGORY_ORDER[currentCategoryIndex + 1]
      : null;

  const prevCategory = prevCategoryId
    ? { id: prevCategoryId, title: dict.categories[prevCategoryId].title }
    : null;
  const nextCategory = nextCategoryId
    ? { id: nextCategoryId, title: dict.categories[nextCategoryId].title }
    : null;

  const lastCategoryId = CATEGORY_ORDER[CATEGORY_ORDER.length - 1];
  const lastCategory = {
    id: lastCategoryId,
    title: dict.categories[lastCategoryId].title,
  };

  const fitIntroLines = useCallback(() => {
    const heroLines = heroLinesRef.current;
    if (!heroLines) return;
    const spans = heroLines.querySelectorAll<HTMLSpanElement>('span');
    if (!spans.length) return;

    const siteShell = siteShellRef.current;
    const containerWidth = siteShell ? siteShell.clientWidth : window.innerWidth;
    const isDesktop = containerWidth >= 768;
    const isGreekOrRussian = currentLang === 'el' || currentLang === 'ru';
    const baseSize = isDesktop
      ? (isGreekOrRussian ? 22 : 21)
      : (isGreekOrRussian ? 18 : 17.5);
    const minSize = 7.5;
    const maxWidth = containerWidth - (isDesktop ? 16 : 12);

    spans.forEach((span) => {
      span.style.fontSize = `${baseSize}px`;
    });

    let currentSize = baseSize;
    while (currentSize > minSize) {
      let overflows = false;
      spans.forEach((span) => {
        if (span.scrollWidth > maxWidth) {
          overflows = true;
        }
      });
      if (!overflows) break;
      currentSize = Math.round((currentSize - 0.25) * 100) / 100;
      spans.forEach((span) => {
        span.style.fontSize = `${currentSize}px`;
      });
    }
  }, [currentLang]);

  const applyPreviewSim = useCallback(
    (nextWidth: SimWidth, nextZoom: number, autoFit = false) => {
      let resolvedZoom = nextZoom;

      if (autoFit && nextWidth !== 'full') {
        const numericW = Number(nextWidth);
        const availW = window.innerWidth - 24;
        if (numericW > availW) {
          resolvedZoom = Math.max(0.4, Math.floor((availW / numericW) * 20) / 20);
        } else {
          resolvedZoom = 1;
        }
      }

      setSimWidth(nextWidth);
      setSimZoom(resolvedZoom);
    },
    []
  );

  const resetAndHideToolbar = useCallback(() => {
    setToolbarOpen(false);
  }, []);

  const toggleToolbar = useCallback(() => {
    setToolbarOpen((prev) => !prev);
    setDrawerOpen(false);
  }, []);

  const toggleProgrammesSlot = useCallback(() => {
    setProgrammesToggled((prev) => !prev);
    setDrawerOpen(false);
  }, []);

  const togglePreviewControls = useCallback(() => {
    setDrawerControlsVisible((prev) => !prev);
  }, []);

  // Document-level pointerdown listener for front-page center logo (3 taps within 1.5s toggles drawer control buttons)
  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target;
      if (!(target instanceof Element) || target.closest('.logo-card-wrap') === null) {
        return;
      }

      const now = Date.now();
      const recent = logoTapTimestampsRef.current.filter((t) => now - t <= 1500);
      recent.push(now);
      logoTapTimestampsRef.current = recent;

      if (recent.length >= 3) {
        logoTapTimestampsRef.current = [];
        setDrawerControlsVisible((prev) => !prev);
      }
    };

    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  // React to #preview hash fragment changes (preserved inside iframes)
  useEffect(() => {
    const onHashChange = () => {
      if (window.location.hash.toLowerCase() === '#preview') {
        setDrawerControlsVisible(true);
      }
    };

    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Cleanly reset preview controls and URL markers when drawer controls are hidden again
  useEffect(() => {
    if (!drawerControlsVisible) {
      setToolbarOpen(false);
      setProgrammesToggled(false);
      clearPreviewFromUrl();
    }
  }, [drawerControlsVisible]);

  // Reset simulation dimensions whenever the toolbar closes
  useEffect(() => {
    document.body.classList.toggle('sim-toolbar-open', toolbarOpen);
    if (!toolbarOpen) {
      setSimWidth('full');
      setSimZoom(1);
    }
  }, [toolbarOpen]);

  // Sync body classes and .site-shell dimensions for screen/zoom preview simulation
  useEffect(() => {
    const isSim = toolbarOpen && (simWidth !== 'full' || simZoom !== 1);
    document.body.classList.toggle('sim-active', isSim);

    const siteShell = siteShellRef.current;
    if (siteShell) {
      siteShell.style.width = !toolbarOpen || simWidth === 'full' ? '100%' : `${simWidth}px`;
      siteShell.style.maxWidth = 'none';
      siteShell.style.minHeight = '';
      siteShell.style.transform = !toolbarOpen || simZoom === 1 ? 'none' : `scale(${simZoom})`;
    }

    if (isFront) {
      const rafId = requestAnimationFrame(fitIntroLines);
      return () => cancelAnimationFrame(rafId);
    }
  }, [toolbarOpen, simWidth, simZoom, isFront, fitIntroLines]);

  // Refit hero lines on language change, returning to front page, fonts ready, or resize
  useEffect(() => {
    if (!isFront) return;

    const rafId = requestAnimationFrame(fitIntroLines);
    const onResize = () => fitIntroLines();
    window.addEventListener('resize', onResize);

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (isFront) {
          fitIntroLines();
        }
      });
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
    };
  }, [currentLang, isFront, fitIntroLines]);

  // Lightbox keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null || GALLERY_PHOTOS.length === 0) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxIndex(null);
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev - 1 + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length
        );
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev + 1) % GALLERY_PHOTOS.length
        );
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxIndex]);

  const closeOverlays = useCallback(() => {
    setDrawerOpen(false);
    setModal(null);
    setLightboxIndex(null);
  }, []);

  const openDrawer = useCallback(() => {
    setModal(null);
    setLightboxIndex(null);
    setDrawerOpen(true);
  }, []);

  const openModalState = useCallback((nextModal: Exclude<ModalState, null>) => {
    setDrawerOpen(false);
    setLightboxIndex(null);
    setModal(nextModal);
  }, []);

  const scrollToTop = useCallback(() => {
    siteScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const showFrontPage = useCallback(() => {
    setActiveView({ type: 'front' });
    scrollToTop();
  }, [scrollToTop]);

  const openCategory = useCallback(
    (categoryId: CategoryId) => {
      setActiveView({ type: 'category', id: categoryId });
      scrollToTop();
    },
    [scrollToTop]
  );

  const openGallery = useCallback(() => {
    setActiveView({ type: 'gallery' });
    scrollToTop();
  }, [scrollToTop]);

  const handleSelectNavItem = useCallback(
    (item: NavItem) => {
      closeOverlays();
      if (item.action === 'front') {
        showFrontPage();
      } else if (item.action === 'gallery') {
        openGallery();
      } else if (item.action === 'category' && item.categoryId) {
        openCategory(item.categoryId);
      } else {
        openModalState({ type: 'note', title: item.title, text: item.note ?? '' });
      }
    },
    [closeOverlays, showFrontPage, openGallery, openCategory, openModalState]
  );

  const activeLightboxPhoto =
    lightboxIndex !== null ? GALLERY_PHOTOS[lightboxIndex] ?? null : null;

  return (
    <>
      <div className="site-shell" ref={siteShellRef} lang={currentLang} data-lang={currentLang}>
        <div className="site-scroll" ref={siteScrollRef}>
          <TopBar
            menuLabel={dict.menuLabel}
            currentLang={currentLang}
            onOpenDrawer={openDrawer}
            onSelectLanguage={setCurrentLang}
          />

          <FrontStage
            hidden={!isFront}
            lines={dict.lines}
            heroLinesRef={heroLinesRef}
            programmesVisible={programmesVisible}
            programmesLabel={dict.programmes}
            onOpenProgrammes={() => openModalState({ type: 'programmes' })}
          />

          <CategoryReader
            category={activeCategory}
            backFrontLabel={dict.backFront}
            sectionLabel={dict.sectionLabel}
            currentIndex={currentCategoryIndex + 1}
            totalCategories={CATEGORY_ORDER.length}
            prevLabel={dict.prevCategory}
            nextLabel={dict.nextCategory}
            prevCategory={prevCategory}
            nextCategory={nextCategory}
            galleryLink={
              activeCategoryId === lastCategoryId
                ? {
                    tag: dict.gallery.tag,
                    title: dict.gallery.title,
                    onOpen: openGallery,
                  }
                : null
            }
            onBackFront={showFrontPage}
            onSelectCategory={openCategory}
          />

          <MomentsGallery
            active={isGallery}
            isPreviewMode={drawerControlsVisible}
            gallery={dict.gallery}
            backFrontLabel={dict.backFront}
            prevLabel={dict.prevCategory}
            lastCategory={lastCategory}
            onBackFront={showFrontPage}
            onSelectCategory={openCategory}
            onOpenLightbox={setLightboxIndex}
          />

          <BottomBar
            contactLabel={dict.contactLabel}
            privacyLabel={dict.privacyLabel}
            onOpenContact={() => openModalState({ type: 'contact' })}
            onOpenPrivacy={() => openModalState({ type: 'privacy' })}
          />
        </div>

        {/* Backdrop */}
        <div
          className={`backdrop${backdropOpen ? ' open' : ''}`}
          id="backdrop"
          onClick={closeOverlays}
        />

        <NavDrawer
          open={drawerOpen}
          navItems={dict.nav}
          activeView={activeView}
          drawerContactLabel={dict.drawerContact}
          showPreviewControls={drawerControlsVisible}
          toggleProgrammesLabel={dict.toggleProgrammes}
          toggleToolbarLabel={dict.toggleToolbar}
          onClose={closeOverlays}
          onSelectNavItem={handleSelectNavItem}
          onOpenContact={() => openModalState({ type: 'contact' })}
          onTogglePreviewControls={togglePreviewControls}
          onToggleProgrammes={toggleProgrammesSlot}
          onToggleToolbar={toggleToolbar}
        />

        <InfoModal
          modal={modal}
          dict={dict}
          currentLang={currentLang}
          onClose={closeOverlays}
        />

        {activeLightboxPhoto && (
          <div
            className="lightbox-overlay"
            role="dialog"
            aria-modal="true"
            aria-label={dict.gallery.title}
            onClick={() => setLightboxIndex(null)}
          >
            <button
              type="button"
              className="lightbox-close-btn"
              aria-label="Close photo"
              onClick={() => setLightboxIndex(null)}
            >
              ×
            </button>

            {GALLERY_PHOTOS.length > 1 && (
              <button
                type="button"
                className="lightbox-step-btn lightbox-step-btn--prev"
                aria-label="Previous photo"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) =>
                    prev === null
                      ? null
                      : (prev - 1 + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length
                  );
                }}
              >
                ‹
              </button>
            )}

            <img
              src={activeLightboxPhoto.src}
              alt={activeLightboxPhoto.alt ?? ''}
              className="lightbox-image"
              onClick={(e) => e.stopPropagation()}
            />

            {GALLERY_PHOTOS.length > 1 && (
              <button
                type="button"
                className="lightbox-step-btn lightbox-step-btn--next"
                aria-label="Next photo"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) =>
                    prev === null ? null : (prev + 1) % GALLERY_PHOTOS.length
                  );
                }}
              >
                ›
              </button>
            )}
          </div>
        )}
      </div>

      {toolbarOpen && (
        <SimToolbar
          simWidth={simWidth}
          simZoom={simZoom}
          onSelectWidth={(w) => applyPreviewSim(w, simZoom, true)}
          onSelectZoom={(z) => applyPreviewSim(simWidth, z, false)}
          onResetAndHide={resetAndHideToolbar}
        />
      )}
    </>
  );
}
