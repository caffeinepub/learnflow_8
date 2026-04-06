import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Loader2,
  Trophy,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetCourse, useSubmitQuiz } from "../hooks/useQueries";

type QuizQuestion = {
  questionText: string;
  answerOptions: string[];
  correctAnswerIndex: number;
};

const QUIZ_BANK: Record<string, QuizQuestion[]> = {
  "Web Development": [
    {
      questionText: "What is React?",
      answerOptions: [
        "A relational database system",
        "A JavaScript library for building user interfaces",
        "A CSS pre-processor",
        "A Node.js web framework",
      ],
      correctAnswerIndex: 1,
    },
    {
      questionText: "Which hook is used for side effects in React?",
      answerOptions: ["useState", "useRef", "useEffect", "useMemo"],
      correctAnswerIndex: 2,
    },
    {
      questionText: "How does data flow in React?",
      answerOptions: [
        "Bidirectionally between any components",
        "Only from child to parent via props",
        "Unidirectionally from parent to child via props",
        "Through a global event bus",
      ],
      correctAnswerIndex: 2,
    },
    {
      questionText: "What does JSX stand for?",
      answerOptions: [
        "JavaScript XML",
        "Java Syntax Extension",
        "JSON eXtension",
        "None of these",
      ],
      correctAnswerIndex: 0,
    },
  ],
  "Data Science": [
    {
      questionText: "What is a Pandas DataFrame?",
      answerOptions: [
        "A 1D labeled array",
        "A 2D labeled data structure with columns of potentially different types",
        "A Python dictionary",
        "A NumPy matrix",
      ],
      correctAnswerIndex: 1,
    },
    {
      questionText: "Which function reads a CSV file in Pandas?",
      answerOptions: [
        "pd.load_csv()",
        "pd.open_csv()",
        "pd.read_csv()",
        "pd.import_csv()",
      ],
      correctAnswerIndex: 2,
    },
    {
      questionText: "What does NumPy stand for?",
      answerOptions: [
        "Numerical Python",
        "New Python",
        "Number Processing",
        "None of these",
      ],
      correctAnswerIndex: 0,
    },
    {
      questionText:
        "Which Python library is most commonly used for data visualization?",
      answerOptions: ["NumPy", "Pandas", "Matplotlib", "SciPy"],
      correctAnswerIndex: 2,
    },
  ],
  Design: [
    {
      questionText: "What does UX stand for?",
      answerOptions: [
        "Universal Experience",
        "User Experience",
        "Unique Extension",
        "User Exploration",
      ],
      correctAnswerIndex: 1,
    },
    {
      questionText: "Which design principle groups related elements together?",
      answerOptions: ["Contrast", "Alignment", "Proximity", "Repetition"],
      correctAnswerIndex: 2,
    },
    {
      questionText: "What is a wireframe?",
      answerOptions: [
        "A finished visual design with colors and images",
        "A low-fidelity skeleton layout showing structure without styling",
        "A type of CSS framework",
        "A prototype with full interactions",
      ],
      correctAnswerIndex: 1,
    },
    {
      questionText: "What tool is most popular for UI/UX design collaboration?",
      answerOptions: ["Photoshop", "Sketch", "Figma", "Canva"],
      correctAnswerIndex: 2,
    },
  ],
  Business: [
    {
      questionText: "What does SEO stand for?",
      answerOptions: [
        "Social Engagement Optimization",
        "Search Engine Optimization",
        "Site Enhancement Operations",
        "Structured Email Outreach",
      ],
      correctAnswerIndex: 1,
    },
    {
      questionText: "What is a good email open rate for most industries?",
      answerOptions: ["1-5%", "20-30%", "50-60%", "75-90%"],
      correctAnswerIndex: 1,
    },
    {
      questionText: "What metric measures organic search visibility?",
      answerOptions: [
        "Click-through rate",
        "Bounce rate",
        "Domain authority / search ranking",
        "Cost per click",
      ],
      correctAnswerIndex: 2,
    },
    {
      questionText: "Which of these is a key social media marketing metric?",
      answerOptions: [
        "Bounce rate",
        "Engagement rate",
        "Page load time",
        "Server uptime",
      ],
      correctAnswerIndex: 1,
    },
  ],
  Mobile: [
    {
      questionText: "What is an optional in Swift?",
      answerOptions: [
        "A variable that must always have a value",
        "A type that can hold a value or nil",
        "A keyword for async functions",
        "A Swift protocol",
      ],
      correctAnswerIndex: 1,
    },
    {
      questionText: "What IDE is used for iOS development?",
      answerOptions: ["Android Studio", "VS Code", "Xcode", "Eclipse"],
      correctAnswerIndex: 2,
    },
    {
      questionText: "What does UIKit provide?",
      answerOptions: [
        "Machine learning models",
        "Network request utilities",
        "Core UI components and event handling for iOS apps",
        "Database management",
      ],
      correctAnswerIndex: 2,
    },
    {
      questionText: "Which Swift keyword unwraps an optional safely?",
      answerOptions: ["guard", "if let", "Both guard and if let", "force!"],
      correctAnswerIndex: 2,
    },
  ],
  "Cloud & DevOps": [
    {
      questionText: "What is Amazon S3 primarily used for?",
      answerOptions: [
        "Virtual machine hosting",
        "Object storage for files and backups",
        "Managed relational databases",
        "Container orchestration",
      ],
      correctAnswerIndex: 1,
    },
    {
      questionText: "What does IAM stand for in AWS?",
      answerOptions: [
        "Internet Access Manager",
        "Infrastructure Automation Module",
        "Identity and Access Management",
        "Integrated Application Monitor",
      ],
      correctAnswerIndex: 2,
    },
    {
      questionText:
        "Under the Shared Responsibility Model, what is AWS responsible for?",
      answerOptions: [
        "Customer data encryption choices",
        "Application-level security",
        "Security OF the cloud (hardware, software, networking)",
        "User account management",
      ],
      correctAnswerIndex: 2,
    },
    {
      questionText: "Which AWS service runs code without provisioning servers?",
      answerOptions: ["EC2", "ECS", "Lambda", "Lightsail"],
      correctAnswerIndex: 2,
    },
  ],
};

export default function Quiz() {
  const { courseId } = useParams({ from: "/courses/$courseId/quiz" });
  const { data: course } = useGetCourse(BigInt(courseId));
  const { identity } = useInternetIdentity();
  const submitQuiz = useSubmitQuiz();

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const questions = course
    ? (QUIZ_BANK[course.category] ?? QUIZ_BANK["Web Development"])
    : [];
  const totalQ = questions.length;
  const progress = totalQ > 0 ? (currentQ / totalQ) * 100 : 0;

  const handleSelectAnswer = (idx: number) => {
    if (!submitted) setSelectedAnswer(idx);
  };

  const handleNext = () => {
    if (selectedAnswer === null) {
      toast.error("Please select an answer");
      return;
    }
    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);
    setSelectedAnswer(null);
    if (currentQ < totalQ - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      handleSubmit(newAnswers);
    }
  };

  const handleSubmit = async (finalAnswers: number[]) => {
    if (!identity) {
      toast.error("Please sign in");
      return;
    }
    try {
      const result = await submitQuiz.mutateAsync({
        courseId: BigInt(courseId),
        answers: finalAnswers.map((a) => BigInt(a)),
      });
      setScore(Number(result));
      setSubmitted(true);
    } catch {
      // Calculate locally as fallback
      const correct = finalAnswers.filter(
        (a, i) => a === questions[i]?.correctAnswerIndex,
      ).length;
      setScore(Math.round((correct / totalQ) * 100));
      setSubmitted(true);
    }
  };

  if (submitted && score !== null)
    return (
      <div
        className="container mx-auto px-4 py-20 max-w-lg text-center"
        data-ocid="quiz.success_state"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <Trophy
            className={`w-20 h-20 mx-auto mb-4 ${
              score >= 70 ? "text-amber-400" : "text-muted-foreground"
            }`}
          />
          <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
          <div
            className={`text-6xl font-extrabold mb-4 ${
              score >= 70 ? "text-primary" : "text-destructive"
            }`}
          >
            {score}%
          </div>
          <p className="text-muted-foreground mb-2">
            {score >= 70
              ? "Excellent work! You passed the quiz."
              : "Keep studying and try again."}
          </p>
          <Badge
            className={
              score >= 70
                ? "bg-accent/20 text-accent border-accent/30"
                : "bg-destructive/10 text-destructive"
            }
          >
            {score >= 70 ? "PASSED" : "NEEDS IMPROVEMENT"}
          </Badge>
          <div className="flex gap-3 justify-center mt-8">
            <Button asChild variant="outline" data-ocid="quiz.back.button">
              <Link to="/courses/$courseId" params={{ courseId }}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Course
              </Link>
            </Button>
            <Button asChild data-ocid="quiz.dashboard.button">
              <Link to="/dashboard">My Dashboard</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    );

  // Show loading state while course is loading
  if (!course || questions.length === 0)
    return (
      <div
        className="container mx-auto px-4 py-20 text-center"
        data-ocid="quiz.loading_state"
      >
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
      </div>
    );

  const question = questions[currentQ];

  return (
    <div
      className="container mx-auto px-4 py-10 max-w-2xl"
      data-ocid="quiz.page"
    >
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold">{course?.title ?? "Quiz"}</h1>
          <span className="text-sm text-muted-foreground">
            {currentQ + 1} / {totalQ}
          </span>
        </div>
        <Progress value={progress} className="progress-teal h-2" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{question.questionText}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {question.answerOptions.map((option, i) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleSelectAnswer(i)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    selectedAnswer === i
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  }`}
                  data-ocid={`quiz.option.item.${i + 1}`}
                >
                  <span className="font-medium mr-3">
                    {String.fromCharCode(65 + i)}.
                  </span>
                  {option}
                </button>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between mt-6">
        <Button asChild variant="outline" data-ocid="quiz.cancel.button">
          <Link to="/courses/$courseId" params={{ courseId }}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Exit
          </Link>
        </Button>
        <Button
          onClick={handleNext}
          disabled={selectedAnswer === null || submitQuiz.isPending}
          data-ocid="quiz.next.button"
        >
          {submitQuiz.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : null}
          {currentQ < totalQ - 1 ? (
            <>
              Next <ArrowRight className="w-4 h-4 ml-2" />
            </>
          ) : (
            "Submit Quiz"
          )}
        </Button>
      </div>
    </div>
  );
}
