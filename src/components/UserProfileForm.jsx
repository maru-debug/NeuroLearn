import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const initialState = {
  name: "",
  email: "",
  goal: "",
  level: "beginner",
  format: "video",
};

function validate(values) {
  const errors = {};
  if (!values.name.trim()) {
    errors.name = "Введите имя";
  } else if (values.name.trim().length < 2) {
    errors.name = "Имя должно быть не короче 2 символов";
  }

  if (!values.email.trim()) {
    errors.email = "Укажите email";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Некорректный формат email";
  }

  if (!values.goal.trim()) {
    errors.goal = "Опишите вашу учебную цель";
  } else if (values.goal.trim().length < 10) {
    errors.goal = "Опишите цель немного подробнее (минимум 10 символов)";
  }

  return errors;
}

function UserProfileForm({ onSubmitProfile }) {
  const { user } = useAuth();
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Если пользователь авторизован – подставляем его имя и email
  useEffect(() => {
    if (user) {
      setValues((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setSubmitted(true);
      if (onSubmitProfile) {
        onSubmitProfile(values);
      }
    } else {
      setSubmitted(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-5 flex flex-col gap-4"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="font-semibold text-slate-900 text-base">
            Профиль обучающегося
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Заполните форму, чтобы система могла подбирать для вас персональные
            рекомендации.
          </p>
        </div>
        {submitted && (
          <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">
            Данные сохранены
          </span>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-600">Имя</label>
          <input
            name="name"
            type="text"
            value={values.name}
            onChange={handleChange}
            placeholder="Например, Алия"
            className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.name && (
            <span className="text-[11px] text-red-600">{errors.name}</span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-600">Email</label>
          <input
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            placeholder="student@example.com"
            className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.email && (
            <span className="text-[11px] text-red-600">{errors.email}</span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-slate-600">Учебная цель</label>
        <textarea
          name="goal"
          value={values.goal}
          onChange={handleChange}
          rows={3}
          placeholder="Например: хочу научиться строить рекомендательные системы для образовательной платформы"
          className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
        />
        {errors.goal && (
          <span className="text-[11px] text-red-600">{errors.goal}</span>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-600">Уровень подготовки</label>
          <select
            name="level"
            value={values.level}
            onChange={handleChange}
            className="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="beginner">Начальный</option>
            <option value="intermediate">Средний</option>
            <option value="advanced">Продвинутый</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-600">
            Предпочитаемый формат материалов
          </label>
          <select
            name="format"
            value={values.format}
            onChange={handleChange}
            className="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="video">Видео-курсы</option>
            <option value="text">Статьи и конспекты</option>
            <option value="mixed">Смешанный формат</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition"
      >
        Сохранить профиль
      </button>
    </form>
  );
}

export default UserProfileForm;
