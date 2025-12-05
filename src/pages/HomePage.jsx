import { useMemo } from "react";
import UserProfileForm from "../components/UserProfileForm.jsx";
import RecommendationList from "../components/RecommendationList.jsx";
import { mockRecommendations } from "../api/recommendations.js";
import { useLearning } from "../context/LearningContext.jsx";

function HomePage() {
  const { profile, updateProfile, scoreCourseForProfile } = useLearning();

  const handleProfileSubmit = (values) => {
    updateProfile(values);
  };

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

  return (
    <div className="container py-6 sm:py-10 flex flex-col gap-6">
      <section className="grid lg:grid-cols-2 gap-6 items-start">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">
            Разработка интеллектуальной рекомендательной системы
            <span className="block text-indigo-600">
              для персонализированного обучения
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            Веб-интерфейс собирает данные об обучающемся, формирует профиль и
            показывает персонализированные рекомендации курсов и материалов.
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
                Простые правила сопоставления профиля и характеристик курса.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-3">
              <p className="font-semibold text-slate-900">Рекомендации</p>
              <p className="text-slate-500 mt-1">
                Каталог курсов с возможностью записаться и отслеживать обучение.
              </p>
            </div>
          </div>
        </div>

        <UserProfileForm onSubmitProfile={handleProfileSubmit} />
      </section>

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