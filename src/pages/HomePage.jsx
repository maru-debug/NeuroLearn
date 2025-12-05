import { useMemo } from "react";
import UserProfileForm from "../components/UserProfileForm.jsx";
import RecommendationList from "../components/RecommendationList.jsx";
import { mockRecommendations } from "../api/recommendations.js";
import { useLearning } from "../context/LearningContext.jsx";

function HomePage() {
  const {
    profile,
    updateProfile,
    scoreCourseForProfile,
    enrolledCourseIds,
    progress,
  } = useLearning();

  const handleProfileSubmit = (values) => {
    updateProfile(values);
  };

  // Подбор рекомендаций по профилю
  const demoRecommendations = useMemo(() => {
    if (!profile) {
      return mockRecommendations.slice(0, 3);
    }
    return [...mockRecommendations]
      .map((item) => ({
        ...item,
        _match: scoreCourseForProfile(item),
      }))
      .sort((a, b) => b._match - a._match)
      .slice(0, 3);
  }, [profile, scoreCourseForProfile]);

  // Простая статистика обучения
  const stats = useMemo(() => {
    const enrolledCourses = mockRecommendations.filter(
      (item) => item.type === "course" && enrolledCourseIds.includes(item.id)
    );

    let totalLessons = 0;
    let completedLessons = 0;

    enrolledCourses.forEach((course) => {
      const lessonsCount = course.lessons ? course.lessons.length : 0;
      totalLessons += lessonsCount;
      const done = progress[course.id] || [];
      completedLessons += done.length;
    });

    const avgCompletion =
      totalLessons > 0
        ? Math.round(Math.min(100, (completedLessons / totalLessons) * 100))
        : 0;

    return {
      enrolledCount: enrolledCourses.length,
      completedLessons,
      totalLessons,
      avgCompletion,
    };
  }, [enrolledCourseIds, progress]);

  return (
    <div className="container py-6 sm:py-10 flex flex-col gap-6">
      {/* Верхний блок: заголовок + краткий дашборд */}
      <section className="flex flex-col gap-4">
        <div className="grid lg:grid-cols-[minmax(0,2fr),minmax(0,1.4fr)] gap-6 items-start">
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">
              Разработка интеллектуальной рекомендательной системы
              <span className="block text-indigo-600">
                для персонализированного обучения
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-600">
              Веб-интерфейс собирает данные об обучающемся, формирует профиль и
              демонстрирует принцип работы рекомендательной системы на примере
              учебных курсов и статей.
            </p>
            <div className="grid sm:grid-cols-3 gap-3 text-xs sm:text-sm">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-3">
                <p className="font-semibold text-slate-900">Сбор данных</p>
                <p className="text-slate-500 mt-1">
                  Учебные цели, уровень подготовки, предпочтительный формат.
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-3">
                <p className="font-semibold text-slate-900">Аналитика</p>
                <p className="text-slate-500 mt-1">
                  Правила сопоставления профиля и характеристик курса.
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-3">
                <p className="font-semibold text-slate-900">Рекомендации</p>
                <p className="text-slate-500 mt-1">
                  Каталог курсов с возможностью записаться и отслеживать
                  прогресс.
                </p>
              </div>
            </div>
          </div>

          {/* Небольшой дашборд */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-5 flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Состояние обучения
            </h2>
            <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="flex flex-col gap-1">
                <span className="text-slate-500">Записано курсов</span>
                <span className="text-lg font-semibold text-slate-900">
                  {stats.enrolledCount}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-slate-500">Завершено уроков</span>
                <span className="text-lg font-semibold text-slate-900">
                  {stats.completedLessons}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-slate-500">Всего уроков</span>
                <span className="text-lg font-semibold text-slate-900">
                  {stats.totalLessons}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-slate-500">Средний прогресс</span>
                <span className="text-lg font-semibold text-slate-900">
                  {stats.avgCompletion}%
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500">
              Все данные (профиль, записанные курсы, прогресс и оценки)
              сохраняются локально в браузере и используются исключительно для
              демонстрации работы интерфейса рекомендательной системы.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 items-start">
          <UserProfileForm onSubmitProfile={handleProfileSubmit} />
        </div>
      </section>

      {/* Блок рекомендаций */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
            Демонстрационный список рекомендаций
          </h2>
          <p className="text-xs text-slate-500">
            {profile
              ? "Отсортировано по степени совпадения с вашим профилем."
              : "Используются тестовые данные без учёта профиля."}
          </p>
        </div>
        <RecommendationList
          items={demoRecommendations}
          showMatch={Boolean(profile)}
          showEnrollButton={true}
        />
      </section>
    </div>
  );
}

export default HomePage;