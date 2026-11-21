import { useEffect, useState } from 'react';
import { PSP_EMAIL } from '../data/content';
import { UPCOMING_PROGRAMMES } from '../data/programmes';
import type { Language, LocaleContent, ModalState } from '../types';

interface InfoModalProps {
  modal: ModalState;
  dict: LocaleContent;
  currentLang: Language;
  onClose: () => void;
}

export function InfoModal({ modal, dict, currentLang, onClose }: InfoModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCopied(false);
  }, [modal, dict]);

  const handleCopyEmail = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(PSP_EMAIL).catch(() => {
        const tempInput = document.createElement('input');
        tempInput.value = PSP_EMAIL;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      });
    } else {
      const tempInput = document.createElement('input');
      tempInput.value = PSP_EMAIL;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
    }
    setCopied(true);
  };

  let title = '';
  if (modal) {
    switch (modal.type) {
      case 'contact':
        title = dict.contactHeading;
        break;
      case 'privacy':
        title = dict.privacyTitle;
        break;
      case 'programmes':
        title = dict.programmesTitle;
        break;
      case 'note':
        title = modal.title;
        break;
    }
  }

  return (
    <div
      className={`modal-card${modal ? ' open' : ''}`}
      id="infoModal"
      role="dialog"
      aria-modal="true"
      aria-hidden={!modal}
    >
      <div className="modal-top">
        <h2 className="modal-title" id="modalTitle">
          {title}
        </h2>
        <button
          type="button"
          className="close-btn"
          id="closeModalBtn"
          aria-label="Close modal"
          onClick={onClose}
        >
          ×
        </button>
      </div>

      <div className="modal-body" id="modalBody">
        {modal?.type === 'contact' && (
          <>
            <p>{dict.contactText}</p>
            <div className="contact-email-box">
              <span id="pspEmailText">{PSP_EMAIL}</span>
              <button
                type="button"
                className="copy-btn"
                id="copyEmailBtn"
                onClick={handleCopyEmail}
              >
                {copied ? dict.copiedLabel : dict.copyLabel}
              </button>
            </div>
          </>
        )}

        {modal?.type === 'privacy' && <p>{dict.privacyBody}</p>}

        {modal?.type === 'programmes' &&
          (UPCOMING_PROGRAMMES.length > 0 ? (
            <ul className="programme-list">
              {UPCOMING_PROGRAMMES.map((item) => (
                <li className="programme-item" key={item.id}>
                  <div className="programme-date">{item.date[currentLang]}</div>
                  <div className="programme-title">{item.title[currentLang]}</div>
                  {item.location && (
                    <div className="programme-meta">{item.location[currentLang]}</div>
                  )}
                  {item.details && (
                    <p className="programme-details">{item.details[currentLang]}</p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>{dict.programmesBody}</p>
          ))}

        {modal?.type === 'note' && <p>{modal.text}</p>}
      </div>
    </div>
  );
}
