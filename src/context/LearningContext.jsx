import { createContext, useContext, useEffect, useState } from "react";

const LearningContext = createContext(null);

const PROFILE_KEY = "neurolearn_profile";
const ENROLL_KEY = "neurolearn_enrollments";
const PROGRESS_KEY = "neurolearn_progress";
const RATINGS_KEY = "neurolearn_ratings";

export function LearningProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);
  // progress: { [courseId]: number[] } — индексы завершённых уроков
  const [progress, setProgress] = useState({});
  // ratings: { [courseId]: { score: number, comment: string } }
  const [ratings, setRatings] = useState({});

  // Загрузка из localStorage
  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem(PROFILE_KEY);
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
      }
      const storedEnroll = localStorage.getItem(ENROLL_KEY);
      if (storedEnroll) {
        setEnrolledCourseIds(JSON.parse(storedEnroll));
      }
      const storedProgress = localStorage.getItem(PROGRESS_KEY);
      if (storedProgress) {
        setProgress(JSON.parse(storedProgress));
      }
      const storedRatings = localStorage.getItem(RATINGS_KEY);
      if (storedRatings) {
        setRatings(JSON.parse(storedRatings));
      }
    } catch (e) {
      console.error("Failed to load learning state", e);
    }
  }, []);

  // Сохранение профиля
  useEffect(() => {
    try {
      if (profile) {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
      } else {
        localStorage.removeItem(PROFILE_KEY);
      }
    } catch (e) {
      console.error("Failed to save profile", e);
    }
  }, [profile]);

  // Сохранение записанных курсов
  useEffect(() => {
    try {
      localStorage.setItem(ENROLL_KEY, JSON.stringify(enrolledCourseIds));
    } catch (e) {
      console.error("Failed to save enrollments", e);
    }
  }, [enrolledCourseIds]);

  // Сохранение прогресса
  useEffect(() => {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error("Failed to save progress", e);
    }
  }, [progress]);

  // Сохранение рейтингов
  useEffect(() => {
    try {
      localStorage.setItem(RATINGS_KEY, JSON.stringify(ratings));
    } catch (e) {
      console.error("Failed to save ratings", e);
    }
  }, [ratings]);

  const updateProfile = (newProfile) => {
    setProfile(newProfile);
  };

  const enrollCourse = (courseId) => {
    setEnrolledCourseIds((prev) =>
      prev.includes(courseId) ? prev : [...prev, courseId]
    );
  };

  const unenrollCourse = (courseId) => {
    setEnrolledCourseIds((prev) => prev.filter((id) => id !== courseId));
    setProgress((prev) => {
      const copy = { ...prev };
      delete copy[courseId];
      return copy;
    });
  };

  const isEnrolled = (courseId) => enrolledCourseIds.includes(courseId);

  // Прогресс: переключение состояния урока
  const toggleLessonCompletion = (courseId, lessonIndex) => {
    setProgress((prev) => {
      const current = prev[courseId] || [];
      const exists = current.includes(lessonIndex);
      const updated = exists
        ? current.filter((i) => i !== lessonIndex)
        : [...current, lessonIndex];
      return { ...prev, [courseId]: updated };
    });
  };

  // Возвращает { completedCount, totalCount, percent }
  const getCourseProgress = (courseId, totalLessons) => {
    if (!totalLessons || totalLessons <= 0) {
      return { completedCount: 0, totalCount: 0, percent: 0 };
    }
    const current = progress[courseId] || [];
    const completedCount = current.length;
    const percent = Math.round(
      Math.min(100, (completedCount / totalLessons) * 100)
    );
    return { completedCount, totalCount: totalLessons, percent };
  };

  // Простое "совпадение с профилем" в процентах
  const scoreCourseForProfile = (course) => {
    if (!profile) return 0;

    let score = 0;

    if (course.level && profile.level && course.level === profile.level) {
      score += 40;
    }

    if (profile.format === "video" && course.type === "course") score += 30;
    if (profile.format === "text" && course.type === "article") score += 30;
    if (profile.format === "mixed") score += 15;

    if (profile.goal && course.tags && course.tags.length > 0) {
      const goalText = profile.goal.toLowerCase();
      const matchedTags = course.tags.filter((tag) =>
        goalText.includes(tag.toLowerCase())
      );
      score += matchedTags.length * 10;
    }

    if (score > 100) score = 100;
    return score;
  };

  // Рейтинг и отзыв по курсу
  const setRating = (courseId, score, comment) => {
    setRatings((prev) => ({
      ...prev,
      [courseId]: { score, comment: comment || "" },
    }));
  };

  const getRating = (courseId) => ratings[courseId] || null;

  return (
    <LearningContext.Provider
      value={{
        profile,
        updateProfile,
        enrolledCourseIds,
        enrollCourse,
        unenrollCourse,
        isEnrolled,
        scoreCourseForProfile,
        progress,
        toggleLessonCompletion,
        getCourseProgress,
        ratings,
        setRating,
        getRating,
      }}
    >
      {children}
    </LearningContext.Provider>
  );
}

export function useLearning() {
  return useContext(LearningContext);
}