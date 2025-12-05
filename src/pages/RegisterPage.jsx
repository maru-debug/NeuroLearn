import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const STORAGE_KEY = "neurolearn_registered_user";

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

function RegisterPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  // Если уже авторизован — редирект на главную
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Если уже есть данные регистрации — подставим имя и email
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setValues((prev) => ({
          ...prev,
          name: parsed.name || "",
          email: parsed.email || "",
          // пароль не подставляем
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
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const vErrors = validateRegister(values);
    setErrors(vErrors);
    if (Object.keys(vErrors).length > 0) return;

    const newUser = {
      name: values.name.trim(),
      email: values.email.trim(),
      password: values.password,
    };

    // Сохраняем "зарегистрированного" пользователя локально
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));

    // Сразу логиним и отправляем на главную
    login({ name: newUser.name, email: newUser.email });
    navigate("/");
  };

  return (
    <div className="container py-6 sm:py-10 flex justify-center">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-sm border border-slate-100 p-5 sm:p-6 flex flex-col gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
          Регистрация
        </h1>
        <p className="text-sm text-slate-600">
          Создайте учебный профиль, чтобы система могла подбирать для вас
          персональные рекомендации.
        </p>

        <p className="text-xs text-slate-500">
          Уже есть аккаунт?{" "}
          <Link
            to="/login"
            className="text-indigo-600 hover:underline font-medium"
          >
            Войдите
          </Link>
          .
        </p>

        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-600">Имя</label>
            <input
              name="name"
              type="text"
              value={values.name}
              onChange={handleChange}
              className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ваше имя"
            />
            {errors.name && (
              <span className="text-[11px] text-red-600">
                {errors.name}
              </span>
            )}
          </div>

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
              placeholder="Придумайте пароль"
            />
            {errors.password && (
              <span className="text-[11px] text-red-600">
                {errors.password}
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
      </div>
    </div>
  );
}

export default RegisterPage;
