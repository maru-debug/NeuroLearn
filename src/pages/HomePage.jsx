import UserProfileForm from "../components/UserProfileForm.jsx";
import { mockRecommendations } from "../api/recommendations.js";
import RecommendationList from "../components/RecommendationList.jsx";

function HomePage() {
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
            Цель проекта — создать прототип веб-интерфейса, который собирает
            данные об обучающемся и демонстрирует работу рекомендательной
            системы на примере учебных материалов (курсов и статей).
          </p>
          <div className="grid sm:grid-cols-3 gap-3 text-xs sm:text-sm">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-3">
              <p className="font-semibold text-slate-900">Сбор данных</p>
              <p className="text-slate-500 mt-1">
                Профиль обучающегося и его учебные цели.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-3">
              <p className="font-semibold text-slate-900">Аналитика</p>
              <p className="text-slate-500 mt-1">
                Обработка данных и формирование рекомендаций.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-3">
              <p className="font-semibold text-slate-900">Рекомендации</p>
              <p className="text-slate-500 mt-1">
                Персональный каталог курсов и материалов.
              </p>
            </div>
          </div>
        </div>

        <UserProfileForm />
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
            Демонстрационный список рекомендаций
          </h2>
          <p className="text-xs text-slate-500">
            Формируется на основе тестовых данных.
          </p>
        </div>
        <RecommendationList items={mockRecommendations.slice(0, 3)} />
      </section>
    </div>
  );
}

export default HomePage;