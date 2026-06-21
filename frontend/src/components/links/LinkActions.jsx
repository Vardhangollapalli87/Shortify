import { useEffect, useRef, useState } from 'react';

const menuButtonClass = 'w-full rounded-md px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-[#333333]';

export const LinkActions = ({ onEdit, onDelete, onToggle, onView, onQr, isActive }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    const closeMenu = (event) => {
      if (event.key === 'Escape' || !menuRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', closeMenu);
    window.addEventListener('mousedown', closeMenu);
    return () => {
      window.removeEventListener('keydown', closeMenu);
      window.removeEventListener('mousedown', closeMenu);
    };
  }, [isOpen]);

  const runAction = (action) => {
    setIsOpen(false);
    action();
  };

  return (
    <div className="relative flex items-center gap-1.5" aria-label="Link actions" ref={menuRef}>
      <button type="button" onClick={onView} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-[#333333] dark:bg-[#262626] dark:text-slate-100 dark:hover:bg-[#333333]">View</button>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-[#333333] dark:bg-[#262626] dark:text-slate-100 dark:hover:bg-[#333333]"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="More link actions"
      >
        ...
      </button>
      {isOpen ? (
        <div className="absolute right-0 top-10 z-20 w-44 rounded-lg border border-slate-200 bg-white p-1 shadow-lg dark:border-[#333333] dark:bg-[#262626]" role="menu">
          <button type="button" className={menuButtonClass} onClick={() => runAction(onQr)} role="menuitem">QR Code</button>
          <button type="button" className={menuButtonClass} onClick={() => runAction(onEdit)} role="menuitem">Edit</button>
          <button type="button" className={menuButtonClass} onClick={() => runAction(onToggle)} role="menuitem">{isActive ? 'Disable' : 'Enable'}</button>
          <button type="button" className="w-full rounded-md px-3 py-2 text-left text-sm font-medium text-red-700 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-950" onClick={() => runAction(onDelete)} role="menuitem">Delete</button>
        </div>
      ) : null}
    </div>
  );
};
