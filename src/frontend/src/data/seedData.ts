export interface SeedLesson {
  title: string;
  description: string;
  videoUrl: string;
  durationMinutes: number;
}

export interface SeedQuestion {
  questionText: string;
  answerOptions: string[];
  correctAnswerIndex: number;
}

export interface SeedCourse {
  title: string;
  description: string;
  category: string;
  instructorName: string;
  thumbnailUrl: string;
  price: number;
  difficultyLevel: string;
  durationMinutes: number;
  tags: string[];
  lessons: SeedLesson[];
  questions: SeedQuestion[];
}

export const SEED_COURSES: SeedCourse[] = [
  {
    title: "Complete React Developer in 2024",
    description:
      "Master React from fundamentals to advanced patterns. Build real-world apps using hooks, context, Redux, and modern tooling. Includes TypeScript, testing, and deployment.",
    category: "Web Development",
    instructorName: "John Smith",
    thumbnailUrl: "",
    price: 49,
    difficultyLevel: "intermediate",
    durationMinutes: 480,
    tags: ["React", "JavaScript", "Frontend"],
    lessons: [
      {
        title: "Introduction to React",
        description:
          "Understand what React is, why it was created, and how it differs from vanilla JavaScript. Set up your first React project.",
        videoUrl: "https://www.youtube.com/watch?v=Tn6-PIqc4UM",
        durationMinutes: 45,
      },
      {
        title: "State and Props",
        description:
          "Learn how data flows through React components using props and how local state is managed with useState.",
        videoUrl: "https://www.youtube.com/watch?v=Tn6-PIqc4UM",
        durationMinutes: 60,
      },
      {
        title: "React Hooks Deep Dive",
        description:
          "Explore useEffect, useContext, useReducer, useRef, and custom hooks to build powerful components.",
        videoUrl: "https://www.youtube.com/watch?v=Tn6-PIqc4UM",
        durationMinutes: 75,
      },
    ],
    questions: [
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
    ],
  },
  {
    title: "Python for Data Science",
    description:
      "Go from Python beginner to data science practitioner. Learn NumPy, Pandas, Matplotlib, and Scikit-learn with hands-on projects using real datasets.",
    category: "Data Science",
    instructorName: "Sarah Johnson",
    thumbnailUrl: "",
    price: 59,
    difficultyLevel: "beginner",
    durationMinutes: 360,
    tags: ["Python", "Pandas", "NumPy"],
    lessons: [
      {
        title: "Python Basics for Data Science",
        description:
          "Variables, data types, loops, functions, and list comprehensions — the Python building blocks every data scientist needs.",
        videoUrl: "https://www.youtube.com/watch?v=rfscVS0vtbw",
        durationMinutes: 55,
      },
      {
        title: "Data Manipulation with Pandas",
        description:
          "Load, clean, filter, and transform data using DataFrames. Handle missing values and merge datasets like a pro.",
        videoUrl: "https://www.youtube.com/watch?v=rfscVS0vtbw",
        durationMinutes: 70,
      },
      {
        title: "Data Visualization",
        description:
          "Create insightful charts and graphs using Matplotlib and Seaborn to communicate findings effectively.",
        videoUrl: "https://www.youtube.com/watch?v=rfscVS0vtbw",
        durationMinutes: 65,
      },
    ],
    questions: [
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
    ],
  },
  {
    title: "UI/UX Design Fundamentals",
    description:
      "Learn the principles of great design. Master Figma, wireframing, prototyping, and user research to build products people love.",
    category: "Design",
    instructorName: "Emily Chen",
    thumbnailUrl: "",
    price: 39,
    difficultyLevel: "beginner",
    durationMinutes: 300,
    tags: ["Figma", "UI Design", "UX"],
    lessons: [
      {
        title: "Core Design Principles",
        description:
          "Contrast, hierarchy, alignment, proximity, and whitespace — the visual grammar behind every great interface.",
        videoUrl: "https://www.youtube.com/watch?v=c9Wg6Cb_YlU",
        durationMinutes: 50,
      },
      {
        title: "Figma Basics",
        description:
          "Get productive in Figma fast. Components, auto-layout, styles, and prototyping to bring your designs to life.",
        videoUrl: "https://www.youtube.com/watch?v=c9Wg6Cb_YlU",
        durationMinutes: 60,
      },
      {
        title: "User Research Methods",
        description:
          "Conduct user interviews, usability tests, and analyze feedback to make data-driven design decisions.",
        videoUrl: "https://www.youtube.com/watch?v=c9Wg6Cb_YlU",
        durationMinutes: 55,
      },
    ],
    questions: [
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
        questionText:
          "Which design principle groups related elements together?",
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
    ],
  },
  {
    title: "Digital Marketing Mastery",
    description:
      "Build a full digital marketing skill set. SEO, social media, email campaigns, Google Ads, and analytics to grow any business online.",
    category: "Business",
    instructorName: "Mike Brown",
    thumbnailUrl: "",
    price: 44,
    difficultyLevel: "beginner",
    durationMinutes: 240,
    tags: ["SEO", "Social Media", "Marketing"],
    lessons: [
      {
        title: "SEO Basics & Keyword Strategy",
        description:
          "Understand how search engines work, do keyword research, and optimize on-page elements to rank higher organically.",
        videoUrl: "https://www.youtube.com/watch?v=nU-IIXBWlS4",
        durationMinutes: 50,
      },
      {
        title: "Social Media Marketing",
        description:
          "Build engaged communities on Instagram, LinkedIn, and TikTok. Learn content strategy, posting cadence, and paid boosts.",
        videoUrl: "https://www.youtube.com/watch?v=nU-IIXBWlS4",
        durationMinutes: 45,
      },
      {
        title: "Email Campaigns That Convert",
        description:
          "Design compelling email sequences, segment your list, A/B test subject lines, and measure open and click rates.",
        videoUrl: "https://www.youtube.com/watch?v=nU-IIXBWlS4",
        durationMinutes: 40,
      },
    ],
    questions: [
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
    ],
  },
  {
    title: "iOS App Development with Swift",
    description:
      "Build real iPhone apps from scratch using Swift and UIKit. Learn Auto Layout, navigation, networking, and publish to the App Store.",
    category: "Mobile",
    instructorName: "Alex Wong",
    thumbnailUrl: "",
    price: 69,
    difficultyLevel: "intermediate",
    durationMinutes: 540,
    tags: ["Swift", "iOS", "Xcode"],
    lessons: [
      {
        title: "Swift Fundamentals",
        description:
          "Variables, optionals, closures, protocols, and structs vs classes — core Swift you need before writing any app.",
        videoUrl: "https://www.youtube.com/watch?v=comQ1-x2a1Q",
        durationMinutes: 80,
      },
      {
        title: "UIKit Basics",
        description:
          "Build interfaces in Interface Builder, connect outlets and actions, and navigate between screens with segues.",
        videoUrl: "https://www.youtube.com/watch?v=comQ1-x2a1Q",
        durationMinutes: 90,
      },
      {
        title: "Building Your First iOS App",
        description:
          "Put it all together — create a feature-complete app with a table view, detail screen, and local data persistence.",
        videoUrl: "https://www.youtube.com/watch?v=comQ1-x2a1Q",
        durationMinutes: 100,
      },
    ],
    questions: [
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
    ],
  },
  {
    title: "AWS Cloud Practitioner Prep",
    description:
      "Prepare for the AWS Certified Cloud Practitioner exam. Master cloud concepts, AWS core services, security, pricing models, and support plans.",
    category: "Cloud & DevOps",
    instructorName: "Lisa Park",
    thumbnailUrl: "",
    price: 54,
    difficultyLevel: "beginner",
    durationMinutes: 420,
    tags: ["AWS", "Cloud", "DevOps"],
    lessons: [
      {
        title: "Cloud Computing Introduction",
        description:
          "What is cloud computing, its deployment models (public, private, hybrid), and the key benefits that drive cloud adoption.",
        videoUrl: "https://www.youtube.com/watch?v=3hLmDS179YE",
        durationMinutes: 55,
      },
      {
        title: "AWS Core Services",
        description:
          "Tour EC2, S3, RDS, Lambda, VPC, and IAM — the foundational AWS services that power modern cloud architectures.",
        videoUrl: "https://www.youtube.com/watch?v=3hLmDS179YE",
        durationMinutes: 75,
      },
      {
        title: "Security, Pricing & Support",
        description:
          "Understand the Shared Responsibility Model, AWS pricing calculators, Free Tier, and support plans for the exam.",
        videoUrl: "https://www.youtube.com/watch?v=3hLmDS179YE",
        durationMinutes: 60,
      },
    ],
    questions: [
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
    ],
  },
];
