"use client";

import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type DropdownContextType = {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
};

const DropdownContext = createContext<DropdownContextType | undefined>(undefined);

export const DropdownMenu: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggle = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);

  // Закрытие при клике вне
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        close();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <DropdownContext.Provider value={{ isOpen, toggle, close }}>
      <div className="relative inline-block text-left" ref={menuRef}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
};

// Триггер кнопка
export const DropdownMenuTrigger: React.FC<{ children: React.ReactNode ; asChild?: boolean }> = ({ children }) => {
  const context = useContext(DropdownContext);
  if (!context) throw new Error("DropdownMenuTrigger must be inside DropdownMenu");

  return (
    <button
      onClick={context.toggle}
      className="inline-flex justify-center w-full px-4 py-2 bg-gradient-to-r from-yellow-400 to-pink-500 text-white font-medium rounded-md shadow-sm hover:opacity-90 transition"
    >
      {children}
    </button>
  );
};

// Контент меню
export const DropdownMenuContent: React.FC<{ children: React.ReactNode; className?: string; align?: "start" | "end" | "center"; forceMount?: boolean }> = ({
  children,
  className,
}) => {
  const context = useContext(DropdownContext);
  if (!context) throw new Error("DropdownMenuContent must be inside DropdownMenu");

  return (
    <AnimatePresence>
      {context.isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.15 }}
          className={`absolute right-0 mt-2 w-56 origin-top-right bg-white/5 backdrop-blur-xl border border-white/20 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 ${className}`}
        >
          <div className="py-1">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Элемент меню
export const DropdownMenuItem: React.FC<{ children: React.ReactNode; onClick?: () => void; icon?: React.ReactNode; className?: string }> = ({
  children,
  onClick,
  icon,
}) => {
  const context = useContext(DropdownContext);
  if (!context) throw new Error("DropdownMenuItem must be inside DropdownMenu");

  const handleClick = () => {
    onClick?.();
    context.close();
  };

  return (
    <button
      onClick={handleClick}
      className="group flex items-center w-full px-4 py-2 text-sm text-white hover:bg-white/10 transition"
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

// Метка раздела меню
export const DropdownMenuLabel: React.FC<{ children: React.ReactNode; className?: string }> = ({ children }) => {
  return <div className="px-4 py-2 text-xs text-white/60 uppercase">{children}</div>;
};

// Разделитель
export const DropdownMenuSeparator: React.FC<{ className?: string }> = () => {
  return <div className="border-t border-white/20 my-1" />;
};
