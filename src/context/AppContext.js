import React, { createContext, useContext, useState, useEffect } from 'react';
import { COURSE, USER_DATA } from '../data/pythonCourse';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(USER_DATA);
  const [course, setCourse] = useState(COURSE);
  const [currentLesson, setCurrentLesson] = useState(null);

  const completeLesson = (lessonId, xpEarned) => {
    setUser(prev => {
      const newXP = prev.xp + xpEarned;
      const newCompleted = [...prev.completedLessons, lessonId];
      return {
        ...prev,
        xp: newXP,
        streak: prev.streak === 0 ? 1 : prev.streak,
        completedLessons: newCompleted,
        level: Math.floor(newXP / 100) + 1,
      };
    });

    // Unlock next lesson
    setCourse(prev => {
      const units = prev.units.map(unit => {
        const lessons = unit.lessons.map((lesson, index) => {
          if (lesson.id === lessonId) {
            return { ...lesson, status: 'completed' };
          }
          // Unlock next lesson in same unit
          const prevLesson = unit.lessons[index - 1];
          if (prevLesson && prevLesson.id === lessonId && lesson.status === 'locked') {
            return { ...lesson, status: 'active' };
          }
          return lesson;
        });
        return { ...unit, lessons };
      });
      return { ...prev, units };
    });
  };

  const loseHeart = () => {
    setUser(prev => ({
      ...prev,
      hearts: Math.max(0, prev.hearts - 1),
    }));
  };

  const refillHearts = () => {
    setUser(prev => ({ ...prev, hearts: prev.maxHearts }));
  };

  return (
    <AppContext.Provider value={{
      user,
      course,
      currentLesson,
      setCurrentLesson,
      completeLesson,
      loseHeart,
      refillHearts,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
