import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@tanstack/react-router";
import {
  BookOpen,
  ExternalLink,
  GraduationCap,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddQuizQuestions,
  useCreateCourse,
  useCreateLesson,
  useGetAllCourses,
} from "../hooks/useQueries";

const CATEGORIES = [
  "Web Development",
  "Data Science",
  "Design",
  "Business",
  "Mobile",
  "Cloud & DevOps",
];
const DIFFICULTIES = ["beginner", "intermediate", "advanced"];

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "bg-green-100 text-green-700 border-green-200",
  intermediate: "bg-amber-100 text-amber-700 border-amber-200",
  advanced: "bg-red-100 text-red-700 border-red-200",
};

interface QuizQInput {
  id: string;
  questionText: string;
  answerOptions: string[];
  correctAnswerIndex: number;
}

export default function Instructor() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: courses = [] } = useGetAllCourses();
  const createCourse = useCreateCourse();
  const createLesson = useCreateLesson();
  const addQuiz = useAddQuizQuestions();

  // Course form
  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
    instructorName: "",
    category: "",
    difficultyLevel: "",
    price: "0",
    durationMinutes: "60",
    thumbnailUrl: "",
    tags: "",
  });

  // Lesson form
  const [lessonForm, setLessonForm] = useState({
    courseId: "",
    title: "",
    description: "",
    videoUrl: "",
    durationMinutes: "10",
    orderIndex: "1",
  });

  // Quiz form
  const [quizCourseId, setQuizCourseId] = useState("");
  const [questions, setQuestions] = useState<QuizQInput[]>([
    {
      id: "q-1",
      questionText: "",
      answerOptions: ["", "", "", ""],
      correctAnswerIndex: 0,
    },
  ]);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCourse.mutateAsync({
        title: courseForm.title,
        description: courseForm.description,
        instructorName: courseForm.instructorName,
        category: courseForm.category,
        difficultyLevel: courseForm.difficultyLevel,
        price: BigInt(courseForm.price || "0"),
        durationMinutes: BigInt(courseForm.durationMinutes || "60"),
        thumbnailUrl: courseForm.thumbnailUrl,
        tags: courseForm.tags
          ? courseForm.tags.split(",").map((t) => t.trim())
          : [],
      });
      toast.success("Course created successfully!");
      setCourseForm({
        title: "",
        description: "",
        instructorName: "",
        category: "",
        difficultyLevel: "",
        price: "0",
        durationMinutes: "60",
        thumbnailUrl: "",
        tags: "",
      });
    } catch {
      toast.error("Failed to create course");
    }
  };

  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createLesson.mutateAsync({
        courseId: BigInt(lessonForm.courseId),
        title: lessonForm.title,
        description: lessonForm.description,
        videoUrl: lessonForm.videoUrl,
        durationMinutes: BigInt(lessonForm.durationMinutes || "10"),
        orderIndex: BigInt(lessonForm.orderIndex || "1"),
      });
      toast.success("Lesson created!");
      setLessonForm({
        courseId: lessonForm.courseId,
        title: "",
        description: "",
        videoUrl: "",
        durationMinutes: "10",
        orderIndex: "1",
      });
    } catch {
      toast.error("Failed to create lesson");
    }
  };

  const handleAddQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addQuiz.mutateAsync({
        courseId: BigInt(quizCourseId),
        questions: questions.map((q) => ({
          questionText: q.questionText,
          answerOptions: q.answerOptions,
          correctAnswerIndex: BigInt(q.correctAnswerIndex),
        })),
      });
      toast.success("Quiz questions added!");
    } catch {
      toast.error("Failed to add quiz");
    }
  };

  if (!isAuthenticated)
    return (
      <div
        className="container mx-auto px-4 py-24 text-center"
        data-ocid="instructor.page"
      >
        <GraduationCap className="w-16 h-16 mx-auto text-primary mb-4" />
        <h2 className="text-2xl font-bold mb-3">Instructor Panel</h2>
        <p className="text-muted-foreground mb-6">
          Sign in to create and manage courses
        </p>
        <Button
          onClick={login}
          disabled={loginStatus === "logging-in"}
          data-ocid="instructor.login.button"
        >
          {loginStatus === "logging-in" ? "Signing in..." : "Sign In"}
        </Button>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-10" data-ocid="instructor.page">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Instructor Panel</h1>
        <p className="text-muted-foreground">Create and manage your courses</p>
      </div>

      <Tabs defaultValue="course" data-ocid="instructor.tab">
        <TabsList className="mb-6">
          <TabsTrigger value="course" data-ocid="instructor.course.tab">
            Create Course
          </TabsTrigger>
          <TabsTrigger value="lesson" data-ocid="instructor.lesson.tab">
            Add Lesson
          </TabsTrigger>
          <TabsTrigger value="quiz" data-ocid="instructor.quiz.tab">
            Add Quiz
          </TabsTrigger>
          <TabsTrigger value="manage" data-ocid="instructor.manage.tab">
            Manage Courses
          </TabsTrigger>
        </TabsList>

        {/* Course Tab */}
        <TabsContent value="course">
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" /> New Course
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateCourse} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Title *</Label>
                    <Input
                      required
                      placeholder="e.g. Complete React Course"
                      value={courseForm.title}
                      onChange={(e) =>
                        setCourseForm((p) => ({ ...p, title: e.target.value }))
                      }
                      data-ocid="instructor.course_title.input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Instructor Name *</Label>
                    <Input
                      required
                      placeholder="Your name"
                      value={courseForm.instructorName}
                      onChange={(e) =>
                        setCourseForm((p) => ({
                          ...p,
                          instructorName: e.target.value,
                        }))
                      }
                      data-ocid="instructor.instructor_name.input"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Description *</Label>
                  <Textarea
                    required
                    placeholder="Course description..."
                    value={courseForm.description}
                    onChange={(e) =>
                      setCourseForm((p) => ({
                        ...p,
                        description: e.target.value,
                      }))
                    }
                    data-ocid="instructor.course_desc.textarea"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Category</Label>
                    <Select
                      value={courseForm.category}
                      onValueChange={(v) =>
                        setCourseForm((p) => ({ ...p, category: v }))
                      }
                    >
                      <SelectTrigger data-ocid="instructor.course_category.select">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((c) => (
                          // biome-ignore lint/suspicious/noArrayIndexKey: static list
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Difficulty</Label>
                    <Select
                      value={courseForm.difficultyLevel}
                      onValueChange={(v) =>
                        setCourseForm((p) => ({ ...p, difficultyLevel: v }))
                      }
                    >
                      <SelectTrigger data-ocid="instructor.course_difficulty.select">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        {DIFFICULTIES.map((d) => (
                          // biome-ignore lint/suspicious/noArrayIndexKey: static list
                          <SelectItem key={d} value={d}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Price ($)</Label>
                    <Input
                      type="number"
                      min="0"
                      value={courseForm.price}
                      onChange={(e) =>
                        setCourseForm((p) => ({ ...p, price: e.target.value }))
                      }
                      data-ocid="instructor.course_price.input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Duration (minutes)</Label>
                    <Input
                      type="number"
                      min="1"
                      value={courseForm.durationMinutes}
                      onChange={(e) =>
                        setCourseForm((p) => ({
                          ...p,
                          durationMinutes: e.target.value,
                        }))
                      }
                      data-ocid="instructor.course_duration.input"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Thumbnail URL</Label>
                  <Input
                    placeholder="https://..."
                    value={courseForm.thumbnailUrl}
                    onChange={(e) =>
                      setCourseForm((p) => ({
                        ...p,
                        thumbnailUrl: e.target.value,
                      }))
                    }
                    data-ocid="instructor.course_thumbnail.input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Tags (comma separated)</Label>
                  <Input
                    placeholder="React, JavaScript, Frontend"
                    value={courseForm.tags}
                    onChange={(e) =>
                      setCourseForm((p) => ({ ...p, tags: e.target.value }))
                    }
                    data-ocid="instructor.course_tags.input"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={createCourse.isPending}
                  className="w-full"
                  data-ocid="instructor.create_course.submit_button"
                >
                  {createCourse.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  Create Course
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Lesson Tab */}
        <TabsContent value="lesson">
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle>Add Lesson to Course</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateLesson} className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Course *</Label>
                  <Select
                    required
                    value={lessonForm.courseId}
                    onValueChange={(v) =>
                      setLessonForm((p) => ({ ...p, courseId: v }))
                    }
                  >
                    <SelectTrigger data-ocid="instructor.lesson_course.select">
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((c) => (
                        <SelectItem
                          key={c.id.toString()}
                          value={c.id.toString()}
                        >
                          {c.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Lesson Title *</Label>
                  <Input
                    required
                    placeholder="e.g. Introduction to React Hooks"
                    value={lessonForm.title}
                    onChange={(e) =>
                      setLessonForm((p) => ({ ...p, title: e.target.value }))
                    }
                    data-ocid="instructor.lesson_title.input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="What will students learn?"
                    value={lessonForm.description}
                    onChange={(e) =>
                      setLessonForm((p) => ({
                        ...p,
                        description: e.target.value,
                      }))
                    }
                    data-ocid="instructor.lesson_desc.textarea"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Video URL</Label>
                  <Input
                    placeholder="YouTube URL or direct video link"
                    value={lessonForm.videoUrl}
                    onChange={(e) =>
                      setLessonForm((p) => ({
                        ...p,
                        videoUrl: e.target.value,
                      }))
                    }
                    data-ocid="instructor.lesson_video.input"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Duration (minutes)</Label>
                    <Input
                      type="number"
                      min="1"
                      value={lessonForm.durationMinutes}
                      onChange={(e) =>
                        setLessonForm((p) => ({
                          ...p,
                          durationMinutes: e.target.value,
                        }))
                      }
                      data-ocid="instructor.lesson_duration.input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Order Index</Label>
                    <Input
                      type="number"
                      min="1"
                      value={lessonForm.orderIndex}
                      onChange={(e) =>
                        setLessonForm((p) => ({
                          ...p,
                          orderIndex: e.target.value,
                        }))
                      }
                      data-ocid="instructor.lesson_order.input"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={createLesson.isPending}
                  className="w-full"
                  data-ocid="instructor.create_lesson.submit_button"
                >
                  {createLesson.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  Add Lesson
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quiz Tab */}
        <TabsContent value="quiz">
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle>Add Quiz Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddQuiz} className="space-y-6">
                <div className="space-y-1.5">
                  <Label>Course *</Label>
                  <Select
                    required
                    value={quizCourseId}
                    onValueChange={setQuizCourseId}
                  >
                    <SelectTrigger data-ocid="instructor.quiz_course.select">
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((c) => (
                        <SelectItem
                          key={c.id.toString()}
                          value={c.id.toString()}
                        >
                          {c.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {questions.map((q, qi) => (
                  <Card
                    key={q.id}
                    className="border-primary/20"
                    data-ocid={`instructor.quiz.item.${qi + 1}`}
                  >
                    <CardContent className="p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <Label>Question {qi + 1}</Label>
                        {questions.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              setQuestions(questions.filter((_, i) => i !== qi))
                            }
                            data-ocid={`instructor.quiz.delete_button.${qi + 1}`}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                      <Input
                        required
                        placeholder="Question text"
                        value={q.questionText}
                        onChange={(e) =>
                          setQuestions((qs) =>
                            qs.map((item, i) =>
                              i === qi
                                ? { ...item, questionText: e.target.value }
                                : item,
                            ),
                          )
                        }
                        data-ocid={`instructor.quiz_question.input.${qi + 1}`}
                      />
                      <div className="space-y-2">
                        {q.answerOptions.map((opt, oi) => (
                          <div
                            // biome-ignore lint/suspicious/noArrayIndexKey: static list
                            key={`opt-${qi}-${oi}`}
                            className="flex items-center gap-2"
                          >
                            <input
                              type="radio"
                              name={`correct-${qi}`}
                              checked={q.correctAnswerIndex === oi}
                              onChange={() =>
                                setQuestions((qs) =>
                                  qs.map((item, i) =>
                                    i === qi
                                      ? { ...item, correctAnswerIndex: oi }
                                      : item,
                                  ),
                                )
                              }
                              className="w-4 h-4 accent-primary"
                            />
                            <Input
                              placeholder={`Option ${oi + 1}`}
                              value={opt}
                              onChange={(e) =>
                                setQuestions((qs) =>
                                  qs.map((item, i) =>
                                    i === qi
                                      ? {
                                          ...item,
                                          answerOptions: item.answerOptions.map(
                                            (a, ai) =>
                                              ai === oi ? e.target.value : a,
                                          ),
                                        }
                                      : item,
                                  ),
                                )
                              }
                            />
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Select the radio button next to the correct answer
                      </p>
                    </CardContent>
                  </Card>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setQuestions((qs) => [
                      ...qs,
                      {
                        id: `q-${Date.now()}`,
                        questionText: "",
                        answerOptions: ["", "", "", ""],
                        correctAnswerIndex: 0,
                      },
                    ])
                  }
                  data-ocid="instructor.add_question.button"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Question
                </Button>

                <Button
                  type="submit"
                  disabled={addQuiz.isPending}
                  className="w-full"
                  data-ocid="instructor.submit_quiz.submit_button"
                >
                  {addQuiz.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  Save Quiz Questions
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Manage Courses Tab */}
        <TabsContent value="manage">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">All Courses</h2>
                <p className="text-muted-foreground text-sm">
                  {courses.length} course{courses.length !== 1 ? "s" : ""} total
                </p>
              </div>
            </div>

            {courses.length === 0 ? (
              <div
                className="text-center py-20 bg-white rounded-2xl border border-border"
                data-ocid="instructor.courses.empty_state"
              >
                <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No courses yet</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Create your first course in the "Create Course" tab
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {courses.map((course, i) => (
                  <motion.div
                    key={course.id.toString()}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.05, 0.3) }}
                    data-ocid={`instructor.courses.item.${i + 1}`}
                  >
                    <Card className="h-full hover:shadow-md transition-shadow">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <h3 className="font-semibold text-sm leading-snug flex-1">
                            {course.title}
                          </h3>
                          <Badge
                            variant="outline"
                            className={`text-xs shrink-0 ${
                              DIFFICULTY_COLORS[
                                course.difficultyLevel?.toLowerCase()
                              ] ?? ""
                            }`}
                          >
                            {course.difficultyLevel}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mb-4">
                          <Badge variant="secondary" className="text-xs">
                            {course.category}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {course.lessonIds.length} lesson
                            {course.lessonIds.length !== 1 ? "s" : ""}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {Number(course.price) === 0
                              ? "Free"
                              : `$${Number(course.price)}`}
                          </Badge>
                        </div>

                        <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
                          By {course.instructorName}
                        </p>

                        <Separator className="mb-4" />

                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="w-full"
                          data-ocid={`instructor.courses.view.button.${i + 1}`}
                        >
                          <Link
                            to="/courses/$courseId"
                            params={{ courseId: course.id.toString() }}
                          >
                            <ExternalLink className="w-3 h-3 mr-2" />
                            View Course
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
