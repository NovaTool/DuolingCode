import React, { createContext, useContext, useState } from 'react';
import { COURSE } from '../data/pythonCourse';

const AppContext = createContext();

const DEFAULT_USER = {
  name: '',
  username: '',
  avatar: '🦉',
  xp: 0,
  streak: 0,
  gems: 500,
  hearts: 5,
  maxHearts: 5,
  level: 1,
  completedLessons: [],
};

const DEFAULT_SETTINGS = {
  theme: 'dark',           // 'dark' | 'light'
  appLanguage: 'fr',       // 'fr' | 'en'
  codingLanguage: 'python',// 'python' | more coming
  timeGoal: 10,            // 3 | 5 | 10 | 20  (minutes/day)
};

// How many exercises to show per timeGoal (minutes)
export const EXERCISES_FOR_GOAL = {
  3:  3,
  5:  5,
  10: 8,
  20: 99, // all
};

export function AppProvider({ children }) {
  const [user, setUser] = useState(DEFAULT_USER);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [course, setCourse] = useState(COURSE);
  const [isOnboarded, setIsOnboarded] = useState(false);

  const updateSettings = (patch) =>
    setSettings(prev => ({ ...prev, ...patch }));

  const finishOnboarding = ({ name, avatar, theme, appLanguage, codingLanguage, timeGoal }) => {
    setUser(prev => ({ ...prev, name, username: '@' + name.toLowerCase().replace(/\s/g, ''), avatar }));
    setSettings({ theme, appLanguage, codingLanguage, timeGoal });
    setIsOnboarded(true);
  };

  const completeLesson = (lessonId, xpEarned) => {
    setUser(prev => {
      const newXP = prev.xp + xpEarned;
      return {
        ...prev,
        xp: newXP,
        streak: prev.streak === 0 ? 1 : prev.streak,
        completedLessons: prev.completedLessons.includes(lessonId)
          ? prev.completedLessons
          : [...prev.completedLessons, lessonId],
        level: Math.floor(newXP / 100) + 1,
        gems: prev.gems + Math.floor(xpEarned / 2),
      };
    });

    setCourse(prev => {
      // Find which unit contains the completed lesson and if it's the last lesson
      let nextUnitFirstLessonId = null;
      for (let u = 0; u < prev.units.length; u++) {
        const unit = prev.units[u];
        const lastLesson = unit.lessons[unit.lessons.length - 1];
        if (lastLesson?.id === lessonId && u + 1 < prev.units.length) {
          nextUnitFirstLessonId = prev.units[u + 1].lessons[0]?.id;
          break;
        }
      }
      const units = prev.units.map(unit => {
        const lessons = unit.lessons.map((lesson, index) => {
          if (lesson.id === lessonId) return { ...lesson, status: 'completed' };
          const prevLesson = unit.lessons[index - 1];
          if (prevLesson?.id === lessonId && lesson.status === 'locked')
            return { ...lesson, status: 'active' };
          if (lesson.id === nextUnitFirstLessonId && lesson.status === 'locked')
            return { ...lesson, status: 'active' };
          return lesson;
        });
        return { ...unit, lessons };
      });
      return { ...prev, units };
    });
  };

  const loseHeart = () =>
    setUser(prev => ({ ...prev, hearts: Math.max(0, prev.hearts - 1) }));

  const refillHearts = () =>
    setUser(prev => ({ ...prev, hearts: prev.maxHearts }));

  return (
    <AppContext.Provider value={{
      user, settings, course, isOnboarded,
      updateSettings, finishOnboarding,
      completeLesson, loseHeart, refillHearts,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
