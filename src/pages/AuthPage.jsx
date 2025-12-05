import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const STORAGE_KEY = "neurolearn_registered_user";

// Простая валидация
function validateRegister(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = "Введите имя";
  if (!values.email.trim()) errors.email = "Введите email";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
    errors.email = "Некорректный email";
  if (!values.password.trim()) errors.password = "Введите пароль";
  else if (values.password.length < 4)
    errors.password = "Пароль минимум 4 символа";
  return errors;
}

function validateLogin(values) {
  const errors = {};
  if (!values.email.trim()) errors.email = "Введите email";
  if (!values.password.trim()) errors.password = "Введите пароль";
  return errors;
}

function AuthPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [registeredUser, setRegisteredUser] = useState(null);

  const [mode, setMode] = useState("login"); // "login" | "register"

  const [registerValues, setRegisterValues] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [registerErrors, setRegisterErrors] = useState({});

  const [loginValues, setLoginValues] = useState({
    email: "",
    password: "",
  });
  const [loginErrors, setLoginErrors] = useState({});
  const [loginErrorMsg, setLoginErrorMsg] = useState("");

  // При загрузке страницы читаем зарегистрированного пользователя
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setRegisteredUser(parsed);
        setRegisterValues({
          name: parsed.name || "",
          email: parsed.email || "",
          password: "",
        });
        setLoginValues({ email: parsed.email || "", password: "" });
      }
    } catch (e) {
      console.error("Failed to parse registered user", e);
    }
  }, []);

  // Если уже авторизован – перенаправляем на главную
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterValues((prev) => ({ ...prev, [name]: value }));
    setRegisterErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginValues((prev) => ({ ...prev, [name]: value }));
    setLoginErrors((prev) => ({ ...prev, [name]: "" }));
    setLoginErrorMsg("");
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const errors = validateRegister(registerValues);
    setRegisterErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const newUser = {
      name: registerValues.name.trim(),
      email: registerValues.email.trim(),
      password: registerValues.password, // для демо храним как есть
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    setRegisteredUser(newUser);

    // Сразу логиним
    login({ name: newUser.name, email: newUser.email });
    navigate("/");
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const errors = validateLogin(loginValues);
    setLoginErrors(errors);
    if (Object.keys(errors).length > 0) return;

    if (!registeredUser) {
      setLoginErrorMsg("Пользователь ещё не зарегистрирован.");
      return;
    }

    if (
      loginValues.email.trim() === registeredUser.email &&
      loginValues.password === registeredUser.password
    ) {
      login({ name: registeredUser.name, email: registeredUser.email });
      navigate("/");
    } else {
      setLoginErrorMsg("Неверный email или пароль.");
    }
  };

  return (
    <div className="container py-6 sm:py-10 flex justify-center">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-sm border border-slate-100 p-5 sm:p-6 flex flex-col gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
          {mode === "login" ? "Вход в систему" : "Регистрация"}
        </h1>
        <p className="text-sm text-slate-600">
          Данные сохраняются локально в браузере, чтобы при повторном заходе
          система могла узнавать вас.
        </p>

        <div className="flex gap-2 text-sm">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 rounded-xl border px-3 py-2 ${
              mode === "login"
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-slate-700 border-slate-200"
            }`}
          >
            Вход
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`flex-1 rounded-xl border px-3 py-2 ${
              mode === "register"
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-slate-700 border-slate-200"
            }`}
          >
            Регистрация
          </button>
        </div>

        {mode === "register" ? (
          <form className="flex flex-col gap-3" onSubmit={handleRegisterSubmit}>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-600">Имя</label>
              <input
                name="name"
                type="text"
                value={registerValues.name}
                onChange={handleRegisterChange}
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Ваше имя"
              />
              {registerErrors.name && (
                <span className="text-[11px] text-red-600">
                  {registerErrors.name}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-600">Email</label>
              <input
                name="email"
                type="email"
                value={registerValues.email}
                onChange={handleRegisterChange}
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="student@example.com"
              />
              {registerErrors.email && (
                <span className="text-[11px] text-red-600">
                  {registerErrors.email}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-600">Пароль</label>
              <input
                name="password"
                type="password"
                value={registerValues.password}
                onChange={handleRegisterChange}
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Придумайте пароль"
              />
              {registerErrors.password && (
                <span className="text-[11px] text-red-600">
                  {registerErrors.password}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="mt-2 inline-flex items-center justify-center px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition"
            >
              Зарегистрироваться
            </button>
          </form>
        ) : (
          <form className="flex flex-col gap-3" onSubmit={handleLoginSubmit}>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-600">Email</label>
              <input
                name="email"
                type="email"
                value={loginValues.email}
                onChange={handleLoginChange}
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="student@example.com"
              />
              {loginErrors.email && (
                <span className="text-[11px] text-red-600">
                  {loginErrors.email}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-600">Пароль</label>
              <input
                name="password"
                type="password"
                value={loginValues.password}
                onChange={handleLoginChange}
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Пароль"
              />
              {loginErrors.password && (
                <span className="text-[11px] text-red-600">
                  {loginErrors.password}
                </span>
              )}
            </div>

            {loginErrorMsg && (
              <div className="text-[11px] text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                {loginErrorMsg}
              </div>
            )}

            <button
              type="submit"
              className="mt-2 inline-flex items-center justify-center px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition"
            >
              Войти
            </button>

            {registeredUser && (
              <p className="text-[11px] text-slate-500">
                Уже зарегистрированы как{" "}
                <span className="font-semibold">{registeredUser.email}</span>.
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}

export default AuthPage;