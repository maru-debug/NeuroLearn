import { useState, useMemo } from "react";
import { mockRecommendations } from "../api/recommendations.js";
import RecommendationFilters from "../components/RecommendationFilters.jsx";
import RecommendationList from "../components/RecommendationList.jsx";

function CatalogPage() {
  const [filters, setFilters] = useState({
    query: "",
    type: "all",
    level: "all",
  });

  const filtered = useMemo(() => {
    return mockRecommendations.filter((item) => {
      if (
        filters.query &&
        !item.title.toLowerCase().includes(filters.query.toLowerCase())
      ) {
        return false;
      }
      if (filters.type !== "all" && item.type !== filters.type) {
        return false;
      }
      if (filters.level !== "all" && item.level !== filters.level) {
        return false;
      }
      return true;
    });
  }, [filters]);

  return (
    <div className="bg-slate-100/70 min-h-full">
      <div className="container py-6 sm:py-10 flex flex-col gap-6">
        <section className="flex flex-col gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Каталог рекомендаций
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
            Демонстрационный каталог учебных рекомендаций (курсы и статьи),
            сформированный интеллектуальной системой. Используйте фильтры, чтобы
            отобрать материалы под ваши задачи и уровень, а затем записаться на
            интересующие курсы.
          </p>
        </section>

        <section className="grid lg:grid-cols-[320px,1fr] gap-4 lg:gap-6 items-start">
          <div className="lg:sticky lg:top-[4.5rem]">
            <RecommendationFilters filters={filters} onChange={setFilters} />
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg font-semibold text-slate-900">
                Подходящие материалы
              </h2>
              <span className="text-xs text-slate-500">
                Найдено: {filtered.length}
              </span>
            </div>
            <RecommendationList
              items={filtered}
              showMatch={true}
              showEnrollButton={true}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

export default CatalogPage;