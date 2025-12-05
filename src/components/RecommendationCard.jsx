import { useLearning } from "../context/LearningContext.jsx";

function RecommendationCard({ item, showMatch = false, showEnrollButton = true }) {
  const {
    isEnrolled,
    enrollCourse,
    unenrollCourse,
    scoreCourseForProfile,
  } = useLearning();

  const enrolled = isEnrolled(item.id);
  const matchScore = showMatch ? scoreCourseForProfile(item) : null;

  const handleClick = () => {
    if (!showEnrollButton || item.type !== "course") return;
    if (enrolled) {
      unenrollCourse(item.id);
    } else {
      enrollCourse(item.id);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs uppercase tracking-wide font-semibold text-indigo-600">
          {item.type === "course" ? "Курс" : "Статья"}
        </span>
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full">
            Уровень:{" "}
            {item.level === "beginner"
              ? "начальный"
              : item.level === "intermediate"
              ? "средний"
              : "продвинутый"}
          </span>
          {matchScore !== null && (
            <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">
              Совпадение с профилем: {matchScore}%
            </span>
          )}
        </div>
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

      {showEnrollButton && item.type === "course" && (
        <button
          onClick={handleClick}
          className={`mt-3 inline-flex items-center justify-center px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
            enrolled
              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
              : "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {enrolled ? "В моих курсах" : "Записаться"}
        </button>
      )}
    </div>
  );
}

export default RecommendationCard;
