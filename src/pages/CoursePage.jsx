import { useMemo } from "react";
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
  } = useLearning();

  const course = useMemo(
    () => mockRecommendations.find((item) => item.id === courseId),
    [courseId]
  );

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
                  Прогресс сохраняется локально в браузере.
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