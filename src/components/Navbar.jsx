import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      isActive
        ? "bg-indigo-600 text-white"
        : "text-slate-700 hover:bg-slate-100"
    }`;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

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

        {/* Десктоп меню */}
        <div className="hidden sm:flex items-center gap-3">
          <NavLink to="/" className={navLinkClass} end>
            Главная
          </NavLink>
          <NavLink to="/materials" className={navLinkClass}>
            Материалы и рекомендации
          </NavLink>
          <NavLink to="/catalog" className={navLinkClass}>
            Каталог рекомендаций
          </NavLink>

          {user ? (
            <div className="flex items-center gap-2 ml-4">
              <span className="text-sm text-slate-700">
                Привет,&nbsp;
                <span className="font-semibold">{user.name}</span>
              </span>
              <button
                onClick={handleLogout}
                className="text-xs px-3 py-1 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-100"
              >
                Выйти
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="ml-4 text-sm px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Вход
            </button>
          )}
        </div>

        {/* Мобильная кнопка */}
        <button
          className="sm:hidden inline-flex items-center justify-center p-2 rounded-md hover:bg-slate-100"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
        >
          <span className="material-icons">{open ? "close" : "menu"}</span>
        </button>
      </div>

      {/* Мобильное меню */}
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

            {user ? (
              <button
                onClick={() => {
                  setOpen(false);
                  handleLogout();
                }}
                className="mt-1 text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
              >
                Выйти ({user.name})
              </button>
            ) : (
              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/login");
                }}
                className="mt-1 text-left px-3 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-md"
              >
                Вход
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
