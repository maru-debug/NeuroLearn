import { NavLink } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const [open, setOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      isActive
        ? "bg-indigo-600 text-white"
        : "text-slate-700 hover:bg-slate-100"
    }`;

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-20">
      <div className="container flex items-center justify-between py-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-lg font-bold">
            AI
          </div>
          <span className="font-semibold text-slate-900 text-sm sm:text-base">
            Интеллектуальная рекомендательная система для обучения
          </span>
        </div>

        {/* Кнопка-бургер для мобильной версии */}
        <button
          className="sm:hidden inline-flex items-center justify-center p-2 rounded-md hover:bg-slate-100"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
        >
          <span className="material-icons">{open ? "close" : "menu"}</span>
        </button>

        {/* Меню для десктопа */}
        <div className="hidden sm:flex items-center gap-2">
          <NavLink to="/" className={navLinkClass} end>
            Главная
          </NavLink>
          <NavLink to="/materials" className={navLinkClass}>
            Материалы и рекомендации
          </NavLink>
          <NavLink to="/catalog" className={navLinkClass}>
            Каталог рекомендаций
          </NavLink>
        </div>
      </div>

      {/* Меню для мобильной версии */}
      {open && (
        <div className="sm:hidden border-t border-slate-100 bg-white">
          <div className="container flex flex-col py-2 gap-1">
            <NavLink
              to="/"
              end
              className={navLinkClass}
              onClick={() => setOpen(false)}
            >
              Главная
            </NavLink>
            <NavLink
              to="/materials"
              className={navLinkClass}
              onClick={() => setOpen(false)}
            >
              Материалы и рекомендации
            </NavLink>
            <NavLink
              to="/catalog"
              className={navLinkClass}
              onClick={() => setOpen(false)}
            >
              Каталог рекомендаций
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;