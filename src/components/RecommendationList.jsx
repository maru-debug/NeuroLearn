import RecommendationCard from "./RecommendationCard.jsx";

function RecommendationList({
  items,
  showMatch = false,
  showEnrollButton = true,
}) {
  if (!items.length) {
    return (
      <div className="text-sm text-slate-500">
        По выбранным условиям пока нет рекомендаций.
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <RecommendationCard
          key={item.id}
          item={item}
          showMatch={showMatch}
          showEnrollButton={showEnrollButton}
        />
      ))}
    </div>
  );
}

export default RecommendationList;
