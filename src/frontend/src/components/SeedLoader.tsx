import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { SEED_COURSES } from "../data/seedData";
import {
  useAddQuizQuestions,
  useCreateCourse,
  useCreateLesson,
  useGetAllCourses,
} from "../hooks/useQueries";

const SEED_KEY = "learnflow_seeded_v1";

export default function SeedLoader() {
  const qc = useQueryClient();
  const { data: courses, isLoading } = useGetAllCourses();
  const createCourse = useCreateCourse();
  const createLesson = useCreateLesson();
  const addQuizQuestions = useAddQuizQuestions();
  const seedingRef = useRef(false);

  useEffect(() => {
    // Already flagged as seeded in storage
    if (localStorage.getItem(SEED_KEY)) return;
    // Wait until courses query resolves
    if (isLoading || courses === undefined) return;
    // If courses already exist, mark as seeded and bail
    if (courses.length > 0) {
      localStorage.setItem(SEED_KEY, "true");
      return;
    }
    // Prevent double-run in StrictMode
    if (seedingRef.current) return;
    seedingRef.current = true;

    const seed = async () => {
      try {
        for (const seedCourse of SEED_COURSES) {
          // Create course
          const courseId = await createCourse.mutateAsync({
            title: seedCourse.title,
            description: seedCourse.description,
            category: seedCourse.category,
            instructorName: seedCourse.instructorName,
            thumbnailUrl: seedCourse.thumbnailUrl,
            price: BigInt(seedCourse.price),
            difficultyLevel: seedCourse.difficultyLevel,
            durationMinutes: BigInt(seedCourse.durationMinutes),
            tags: seedCourse.tags,
          });

          // Create lessons sequentially
          for (let i = 0; i < seedCourse.lessons.length; i++) {
            const lesson = seedCourse.lessons[i];
            await createLesson.mutateAsync({
              courseId,
              title: lesson.title,
              description: lesson.description,
              videoUrl: lesson.videoUrl,
              durationMinutes: BigInt(lesson.durationMinutes),
              orderIndex: BigInt(i + 1),
            });
          }

          // Add quiz questions
          if (seedCourse.questions.length > 0) {
            await addQuizQuestions.mutateAsync({
              courseId,
              questions: seedCourse.questions.map((q) => ({
                questionText: q.questionText,
                answerOptions: q.answerOptions,
                correctAnswerIndex: BigInt(q.correctAnswerIndex),
              })),
            });
          }
        }

        // Invalidate all course-related queries so UI updates
        await qc.invalidateQueries({ queryKey: ["courses"] });
        localStorage.setItem(SEED_KEY, "true");
      } catch (err) {
        // If seeding fails (e.g. not authenticated), don't block the app.
        // Reset flag so it can retry on next load.
        seedingRef.current = false;
        console.warn("SeedLoader: seeding failed", err);
      }
    };

    seed();
  }, [courses, isLoading, createCourse, createLesson, addQuizQuestions, qc]);

  return null;
}
