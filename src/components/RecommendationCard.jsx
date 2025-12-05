function RecommendationCard({ item }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wide font-semibold text-indigo-600">
          {item.type === "course" ? "Курс" : "Статья"}
        </span>
        <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full">
          Уровень:{" "}
          {item.level === "beginner"
            ? "начальный"
            : item.level === "intermediate"
            ? "средний"
            : "продвинутый"}
        </span>
      </div>
      <h3 className="font-semibold text-slate-900 text-sm sm:text-base">
        {item.title}
      </h3>
      {item.duration && (
        <p className="text-xs text-slate-500">
          Примерная длительность: {item.duration}
        </p>
      )}
      {item.tags && (
        <div className="flex flex-wrap gap-1 mt-1">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecommendationCard;