import { createContext, useContext, useEffect, useState } from "react";

const LearningContext = createContext(null);

const PROFILE_KEY = "neurolearn_profile";
const ENROLL_KEY = "neurolearn_enrollments";

export function LearningProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);

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
  };

  const isEnrolled = (courseId) => enrolledCourseIds.includes(courseId);

  // Простое "совпадение с профилем" в процентах
  const scoreCourseForProfile = (course) => {
    if (!profile) return 0;

    let score = 0;

    // Совпадение уровня
    if (course.level && profile.level && course.level === profile.level) {
      score += 40;
    }

    // Предпочитаемый формат
    if (profile.format === "video" && course.type === "course") score += 30;
    if (profile.format === "text" && course.type === "article") score += 30;
    if (profile.format === "mixed") score += 15;

    // Совпадение по ключевым словам из цели и тегам
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
      }}
    >
      {children}
    </LearningContext.Provider>
  );
}

export function useLearning() {
  return useContext(LearningContext);
}
