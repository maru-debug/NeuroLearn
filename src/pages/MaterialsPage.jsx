import { useEffect, useState } from "react";
import RecommendationList from "../components/RecommendationList.jsx";
import { mockRecommendations } from "../api/recommendations.js";

function MaterialsPage() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(
          "https://jsonplaceholder.typicode.com/posts?_limit=6",
          { signal: controller.signal }
        );
        if (!res.ok) {
          throw new Error("Не удалось загрузить материалы");
        }
        const data = await res.json();
        const normalized = data.map((item, index) => ({
          id: item.id,
          title: item.title,
          type: index % 2 === 0 ? "course" : "article",
          level:
            index % 3 === 0
              ? "beginner"
              : index % 3 === 1
              ? "intermediate"
              : "advanced",
          duration: `${15 + index * 5} мин`,
          tags: ["demo", "JSONPlaceholder"],
        }));
        setMaterials(normalized);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Ошибка загрузки");
        }
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, []);

  return (
    <div className="container py-6 sm:py-10 flex flex-col gap-6">
      <section className="flex flex-col gap-2">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
          Учебные материалы и рекомендации
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl">
          Ниже показаны учебные материалы, загруженные через публичный тестовый
          API JSONPlaceholder. На их основе демонстрируется работа интерфейса
          рекомендательной системы.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-slate-900">
            Материалы из API
          </h2>
          {loading && (
            <span className="text-xs text-slate-500">
              Загрузка материалов...
            </span>
          )}
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
            {error}
          </div>
        )}

        {!loading && !error && (
          <RecommendationList
            items={materials}
            showMatch={false}
            showEnrollButton={false}
          />
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-slate-900">
          Дополнительные рекомендации системы
        </h2>
        <p className="text-sm text-slate-600 max-w-2xl">
          Эти рекомендации могут формироваться на основе профиля обучающегося,
          его активности и истории обучения. В данном демо используются
          статические тестовые данные.
        </p>
        <RecommendationList
          items={mockRecommendations.slice(2)}
          showMatch={true}
          showEnrollButton={true}
        />
      </section>
    </div>
  );
}

export default MaterialsPage;