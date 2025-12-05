import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useLearning } from "../context/LearningContext.jsx";
import { mockRecommendations } from "../api/recommendations.js";
import RecommendationList from "../components/RecommendationList.jsx";

function MyCoursesPage() {
  const { enrolledCourseIds, profile } = useLearning();

  const enrolledCourses = useMemo(
    () =>
      mockRecommendations.filter(
        (item) => item.type === "course" && enrolledCourseIds.includes(item.id)
      ),
    [enrolledCourseIds]
  );

  return (
    <div className="container py-6 sm:py-10 flex flex-col gap-6">
      <section className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Мои курсы
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
          Здесь отображаются курсы, на которые вы записались. Рекомендации
          формируются с учётом вашего учебного профиля
          {profile && profile.level ? (
            <>
              {" "}
              (уровень:{" "}
              <span className="font-semibold">
                {profile.level === "beginner"
                  ? "начальный"
                  : profile.level === "intermediate"
                  ? "средний"
                  : "продвинутый"}
              </span>
              ).
            </>
          ) : (
            "."
          )}
        </p>
      </section>

      {enrolledCourses.length === 0 ? (
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-5 flex flex-col gap-3">
          <p className="text-sm text-slate-600">
            Вы ещё не записались ни на один курс.
          </p>
          <p className="text-xs text-slate-500">
            Перейдите в{" "}
            <Link
              to="/catalog"
              className="text-indigo-600 hover:underline font-medium"
            >
              каталог рекомендаций
            </Link>
            , выберите интересующие курсы и нажмите кнопку{" "}
            <span className="font-semibold">«Записаться»</span>.
          </p>
        </section>
      ) : (
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-slate-900">
              Текущие курсы
            </h2>
            <span className="text-xs text-slate-500">
              Всего: {enrolledCourses.length}
            </span>
          </div>
          <RecommendationList
            items={enrolledCourses}
            showMatch={true}
            showEnrollButton={true}
          />
        </section>
      )}
    </div>
  );
}

export default MyCoursesPage;