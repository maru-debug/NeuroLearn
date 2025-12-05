import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { mockRecommendations } from "../api/recommendations.js";
import { useLearning } from "../context/LearningContext.jsx";

function CoursePage() {
  const { id } = useParams();
  const courseId = Number(id);
  const navigate = useNavigate();

  const {
    isEnrolled,
    enrollCourse,
    unenrollCourse,
    getCourseProgress,
    toggleLessonCompletion,
    scoreCourseForProfile,
    progress,
    getRating,
    setRating,
  } = useLearning();

  const course = useMemo(
    () => mockRecommendations.find((item) => item.id === courseId),
    [courseId]
  );

  const existingRating = getRating(courseId);
  const [score, setScore] = useState(existingRating?.score || 0);
  const [comment, setComment] = useState(existingRating?.comment || "");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (existingRating) {
      setScore(existingRating.score);
      setComment(existingRating.comment || "");
    }
  }, [existingRating]);

  if (!course) {
    return (
      <div className="container py-6 sm:py-10">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <p className="text-sm text-slate-600 mb-3">
            Курс или материал не найден.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="text-sm px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Вернуться назад
          </button>
        </div>
      </div>
    );
  }

  const enrolled = isEnrolled(course.id);
  const hasLessons = course.type === "course" && course.lessons;
  const progressInfo = hasLessons
    ? getCourseProgress(course.id, course.lessons.length)
    : { completedCount: 0, totalCount: 0, percent: 0 };

  const matchScore = scoreCourseForProfile(course);

  const handleToggleEnroll = () => {
    if (enrolled) {
      unenrollCourse(course.id);
    } else {
      enrollCourse(course.id);
    }
  };

  const handleRatingSubmit = (e) => {
    e.preventDefault();
    if (!score) return;
    setRating(course.id, score, comment);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="container py-6 sm:py-10 flex flex-col gap-6">
      <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 sm:p-6 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-wide font-semibold text-indigo-600">
              {course.type === "course" ? "Курс" : "Статья"}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              {course.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
              <span className="bg-slate-100 px-2 py-1 rounded-full">
                Уровень:{" "}
                {course.level === "beginner"
                  ? "начальный"
                  : course.level === "intermediate"
                  ? "средний"
                  : "продвинутый"}
              </span>
              {course.duration && (
                <span className="bg-slate-100 px-2 py-1 rounded-full">
                  Длительность: {course.duration}
                </span>
              )}
              {matchScore > 0 && (
                <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full">
                  Совпадение с профилем: {matchScore}%
                </span>
              )}
              {existingRating && (
                <span className="bg-amber-50 text-amber-700 px-2 py-1 rounded-full">
                  Ваша оценка: {existingRating.score} / 5
                </span>
              )}
            </div>
          </div>

          {course.type === "course" && (
            <div className="flex flex-col items-end gap-2">
              <button
                onClick={handleToggleEnroll}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition ${
                  enrolled
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                    : "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {enrolled ? "Вы записаны на курс" : "Записаться на курс"}
              </button>
              {enrolled && hasLessons && (
                <p className="text-[11px] text-slate-500">
                  Прогресс и оценка сохраняются локально в браузере.
                </p>
              )}
            </div>
          )}
        </div>

        {course.description && (
          <p className="text-sm sm:text-base text-slate-600">
            {course.description}
          </p>
        )}

        {course.tags && (
          <div className="flex flex-wrap gap-1 mt-1">
            {course.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </section>

      {course.type === "course" && hasLessons && (
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 sm:p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-slate-900">
              Структура курса
            </h2>
            <div className="flex flex-col items-end text-xs text-slate-600">
              <span>
                Завершено: {progressInfo.completedCount} из{" "}
                {progressInfo.totalCount} уроков
              </span>
              <div className="w-40 h-2 bg-slate-100 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-indigo-500"
                  style={{ width: `${progressInfo.percent}%` }}
                />
              </div>
            </div>
          </div>

          <ul className="flex flex-col gap-2">
            {course.lessons.map((lesson, index) => {
              const current = progress[course.id] || [];
              const done = current.includes(index);

              return (
                <li
                  key={index}
                  className="flex items-start gap-2 p-2 rounded-xl hover:bg-slate-50"
                >
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={done}
                      onChange={() =>
                        toggleLessonCompletion(course.id, index)
                      }
                      className="mt-1"
                    />
                    <span
                      className={`text-sm ${
                        done ? "line-through text-slate-400" : "text-slate-800"
                      }`}
                    >
                      {index + 1}. {lesson}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Блок оценки и отзыва */}
      {course.type === "course" && (
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 sm:p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-slate-900">
              Оценка курса
            </h2>
            {saved && (
              <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">
                Отзыв сохранён
              </span>
            )}
          </div>
          <form
            className="flex flex-col gap-3 max-w-xl"
            onSubmit={handleRatingSubmit}
          >
            <div className="flex flex-col gap-1">
              <span className="text-xs text-slate-600">
                Поставьте оценку (1–5):
              </span>
              <div className="flex gap-1">
                {stars.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setScore(value)}
                    className={`w-8 h-8 flex items-center justify-center rounded-full border text-sm ${
                      value <= score
                        ? "bg-amber-400 border-amber-400 text-white"
                        : "bg-white border-slate-200 text-slate-500"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-600">
                Краткий комментарий (по желанию)
              </label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                placeholder="Например: полезный курс, понравился разбор рекомендательных алгоритмов."
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition disabled:opacity-60"
              disabled={!score}
            >
              Сохранить оценку
            </button>
          </form>

          {existingRating && existingRating.comment && (
            <div className="mt-2 text-xs text-slate-600 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2">
              <span className="font-semibold">Ваш текущий отзыв:</span>{" "}
              {existingRating.comment}
            </div>
          )}
        </section>
      )}

      {course.type === "article" && (
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 sm:p-6">
          <p className="text-sm text-slate-600">
            Это статья. В рамках демо вместо полного текста отображается
            краткое описание и метаданные. Для разработки полнофункциональной
            системы здесь можно подключить просмотр оригинального материала.
          </p>
        </section>
      )}

      <section className="flex justify-between items-center text-xs text-slate-500">
        <button
          onClick={() => navigate(-1)}
          className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700"
        >
          ← Назад
        </button>
        <Link
          to="/my-courses"
          className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700"
        >
          Перейти к «Моим курсам»
        </Link>
      </section>
    </div>
  );
}

export default CoursePage;