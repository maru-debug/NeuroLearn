import RecommendationCard from "./RecommendationCard.jsx";

function RecommendationList({ items }) {
  if (!items.length) {
    return (
      <div className="text-sm text-slate-500">
        По выбранным фильтрам пока нет рекомендаций.
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <RecommendationCard key={item.id} item={item} />
      ))}
    </div>
  );
}

export default RecommendationList;