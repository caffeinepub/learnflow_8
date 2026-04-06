import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type {
  CourseInput,
  Lesson,
  LessonInput,
  QuizQuestion,
} from "../backend";
import { MOCK_COURSES } from "../data/mockCourses";
import { useActor } from "./useActor";

export function useGetAllCourses() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      if (!actor) return MOCK_COURSES;
      const result = await actor.getAllCourses();
      return result.length > 0 ? result : MOCK_COURSES;
    },
    enabled: !isFetching,
    placeholderData: MOCK_COURSES,
  });
}

export function useGetCourse(courseId: bigint) {
  const { actor, isFetching } = useActor();
  const mockCourse = MOCK_COURSES.find((c) => c.id === courseId) ?? null;
  return useQuery({
    queryKey: ["course", courseId.toString()],
    queryFn: async () => {
      if (!actor) return mockCourse;
      try {
        return await actor.getCourse(courseId);
      } catch {
        return mockCourse;
      }
    },
    enabled: !isFetching,
    placeholderData: mockCourse,
  });
}

export function useGetLesson(lessonId: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["lesson", lessonId.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getLesson(lessonId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetLessonsForCourse(lessonIds: bigint[]): Lesson[] {
  const { actor, isFetching } = useActor();
  const results = useQueries({
    queries: lessonIds.map((lid) => ({
      queryKey: ["lesson", lid.toString()],
      queryFn: async () => {
        if (!actor) return null;
        return actor.getLesson(lid);
      },
      enabled: !!actor && !isFetching,
    })),
  });
  return results.map((r) => r.data).filter((d): d is Lesson => d != null);
}

export function useGetCourseReviews(courseId: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["reviews", courseId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCourseReviews(courseId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMyEnrollments() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["enrollments"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyEnrollments();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMyQuizResults() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["quizResults"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyQuizResults();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCallerRole() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["callerRole"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useEnrollInCourse() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (courseId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.enrollInCourse({ courseId });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["enrollments"] }),
  });
}

export function useMarkLessonComplete() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      courseId,
      lessonId,
    }: { courseId: bigint; lessonId: bigint }) => {
      if (!actor) throw new Error("Not connected");
      return actor.markLessonComplete(courseId, lessonId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["enrollments"] }),
  });
}

export function useAddReview() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      courseId,
      rating,
      reviewText,
    }: { courseId: bigint; rating: bigint; reviewText: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addReview(courseId, rating, reviewText);
    },
    onSuccess: (_d, v) =>
      qc.invalidateQueries({ queryKey: ["reviews", v.courseId.toString()] }),
  });
}

export function useCreateCourse() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CourseInput) => {
      if (!actor) throw new Error("Not connected");
      return actor.createCourse(input);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["courses"] }),
  });
}

export function useCreateLesson() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: LessonInput) => {
      if (!actor) throw new Error("Not connected");
      return actor.createLesson(input);
    },
    onSuccess: (_d, v) =>
      qc.invalidateQueries({ queryKey: ["course", v.courseId.toString()] }),
  });
}

export function useAddQuizQuestions() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      courseId,
      questions,
    }: { courseId: bigint; questions: QuizQuestion[] }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addQuizQuestions(courseId, questions);
    },
  });
}

export function useSubmitQuiz() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      courseId,
      answers,
    }: { courseId: bigint; answers: bigint[] }) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitQuiz({ courseId, answers });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["quizResults"] }),
  });
}
