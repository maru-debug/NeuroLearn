import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const STORAGE_KEY = "neurolearn_registered_user";

function validateLogin(values) {
  const errors = {};
  if (!values.email.trim()) errors.email = "Введите email";
  if (!values.password.trim()) errors.password = "Введите пароль";
  return errors;
}

function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [registeredUser, setRegisteredUser] = useState(null);

  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loginErrorMsg, setLoginErrorMsg] = useState("");

  // Если уже авторизован — редирект на главную
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Подгружаем зарегистрированного пользователя (только для email)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setRegisteredUser(parsed);
        setValues((prev) => ({
          ...prev,
          email: parsed.email || "",
          // пароль НЕ подставляем специально
        }));
      }
    } catch (e) {
      console.error("Failed to parse registered user", e);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setLoginErrorMsg("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const vErrors = validateLogin(values);
    setErrors(vErrors);
    if (Object.keys(vErrors).length > 0) return;

    if (!registeredUser) {
      setLoginErrorMsg("Пользователь ещё не зарегистрирован.");
      return;
    }

    if (
      values.email.trim() === registeredUser.email &&
      values.password === registeredUser.password
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
          Вход в систему
        </h1>
        <p className="text-sm text-slate-600">
          Данные сохраняются локально в браузере, чтобы при повторном заходе
          система могла узнавать вас.
        </p>

        <p className="text-xs text-slate-500">
          Нет аккаунта?{" "}
          <Link
            to="/register"
            className="text-indigo-600 hover:underline font-medium"
          >
            Зарегистрируйтесь
          </Link>
          .
        </p>

        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-600">Email</label>
            <input
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="student@example.com"
            />
            {errors.email && (
              <span className="text-[11px] text-red-600">
                {errors.email}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-600">Пароль</label>
            <input
              name="password"
              type="password"
              value={values.password}
              onChange={handleChange}
              className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Пароль"
            />
            {errors.password && (
              <span className="text-[11px] text-red-600">
                {errors.password}
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
      </div>
    </div>
  );
}

export default LoginPage;