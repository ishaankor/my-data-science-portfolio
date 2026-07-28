export interface Project {
  id: string;
  title: string;
  year: string;
  category: 'Machine Learning' | 'Automation' | 'Data Visualization' | 'AI & Web';
  image?: string;
  description: string;
  detailedDescription?: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  metrics?: string;
}

export interface SkillCategory {
  title: string;
  iconName: string;
  description: string;
  skills: {
    name: string;
    level: number; // 0 to 100
    tag: string;
  }[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  period: string;
  location: string;
  description: string[];
  skills: string[];
  type: 'education' | 'work' | 'project';
}

export interface PortfolioData {
  name: string;
  title: string;
  location: string;
  bio: string;
  avatarUrl: string;
  githubUsername: string;
  email: string;
  linkedin: string;
  twitter: string;
  typingStrings: string[];
  stats: {
    label: string;
    value: number;
    prefix?: string;
    suffix?: string;
    description: string;
  }[];
  learningNow: string[];
  projects: Project[];
  skillCategories: SkillCategory[];
  experience: ExperienceItem[];
}

export const portfolioData: PortfolioData = {
  name: "Ishaan Koradia",
  title: "AI Engineer & Data Science Developer",
  location: "California / Remote",
  bio: "Hi, I'm Ishaan Koradia — an AI Engineer and self-taught developer fascinated by the intersection of Artificial Intelligence, Machine Learning, and web automation. Recent UCSD Cognitive Science (Specialization in Machine Learning & Neural Computation) graduate with Data Science experience.",
  avatarUrl: "./images/personal-picture.avif",
  githubUsername: "ishaankor",
  email: "ishaankoradia@gmail.com",
  linkedin: "https://linkedin.com/in/ishaankoradia",
  twitter: "https://twitter.com/ishaankoradia",

  typingStrings: [
    "an AI Engineer.",
    "a Data Science learner.",
    "a problem solver.",
    "a meaningful automater.",
    "a passionate developer."
  ],

  stats: [
    {
      label: "AI & ML Projects",
      value: 14,
      suffix: "+",
      description: "Bots, recommenders & ML models"
    },
    {
      label: "GitHub Repositories",
      value: 28,
      suffix: "+",
      description: "Open-source data & web scripts"
    },
    {
      label: "Automated Pipeline Records",
      value: 50,
      suffix: "k+",
      description: "Scraped, processed & analyzed"
    },
    {
      label: "Models Deployed",
      value: 8,
      suffix: "",
      description: "Regression, OpenCV vision & NLP"
    }
  ],

  learningNow: [
    "Deep Learning & PyTorch Models",
    "WebGL & Three.js 3D Visualizations",
    "Prompt Engineering & Agent Pipelines",
    "High-Velocity Python Web Scraping",
    "Interactive D3 & Chart.js Dashboards"
  ],

  projects: [
    {
      id: "transformi",
      title: "Transformi! ML Discord Bot",
      year: "2024",
      category: "Machine Learning",
      description: "A Discord bot capable of parsing unstructured user datasets and dynamically fitting Linear Regression models with plots.",
      detailedDescription: "Integrates Discord API with Python Scikit-Learn and Matplotlib. Users upload CSVs or data snippets via Discord, and Transformi fits regression models, outputs scatter plots with best-fit lines, and returns statistical metrics.",
      tags: ["Python", "Scikit-Learn", "Discord API", "Linear Regression", "Matplotlib"],
      githubUrl: "https://github.com/ishaankor/transformi",
      featured: true,
      metrics: "Instant ML model fitting & visualization"
    },
    {
      id: "daily-motivation",
      title: "Daily Motivation Twitter/X Bot",
      year: "2023",
      category: "Automation",
      description: "Automated Twitter/X bot delivering motivating quotes daily and collecting poll statistics in PostgreSQL to analyze engagement trends.",
      detailedDescription: "Built with Python, Tweepy, and PostgreSQL. It polls user interactions daily, aggregates sentiment and poll responses, and generates end-of-week data graphics automatically tweeted to followers.",
      tags: ["Python", "PostgreSQL", "Twitter API", "Automation", "NLP"],
      githubUrl: "https://github.com/ishaankor/daily-motivation",
      featured: true,
      metrics: "Daily polls across 5,000+ impressions"
    },
    {
      id: "notestaker-ai",
      title: "NotesTaker AI",
      year: "2023",
      category: "AI & Web",
      description: "An AI-powered audio pipeline that converts lecture audio directly into structured freeform notes in Google Drive.",
      detailedDescription: "Aims to streamline student note-taking by parsing lecture recordings with speech-to-text models, summarizing key concepts with AI, and exporting structured docs straight into Google Drive.",
      tags: ["Python", "AI", "Whisper", "Google Drive API", "NLP"],
      githubUrl: "https://github.com/ishaankor",
      featured: true,
      metrics: "Automated audio-to-notes transcription"
    },
    {
      id: "twitter-scraping-ai",
      title: "Data Scraping & Vision AI Pipeline",
      year: "2023",
      category: "Machine Learning",
      description: "Automation script utilizing OpenCV and AI to filter high-velocity tweets based on custom visual conditions.",
      detailedDescription: "Uses OpenCV computer vision and NLP filtering to scan stream data, extract key visual parameters, and automate multi-condition engagement tasks for data collection.",
      tags: ["Python", "OpenCV", "Machine Learning", "Web Scraping", "AI"],
      githubUrl: "https://github.com/ishaankor/twitter-scraping-ai",
      featured: true,
      metrics: "Processes 1,000+ tweets/min"
    },
    {
      id: "data-science-portfolio",
      title: "Interactive Data Science Showcase",
      year: "2024",
      category: "Data Visualization",
      description: "A dynamic web data product featuring real-time GitHub API analytics and dynamic project recommendation engine.",
      detailedDescription: "Designed to demonstrate data storytelling by pulling live GitHub metrics, computing repository language distributions, and running client-side tf-idf-like project search.",
      tags: ["Next.js", "React", "TypeScript", "Three.js", "Tailwind CSS"],
      githubUrl: "https://github.com/ishaankor/my-data-science-portfolio",
      liveUrl: "https://ishaankor.github.io/my-data-science-portfolio/",
      featured: true,
      metrics: "Real-time API & 3D WebGL hero"
    }
  ],

  skillCategories: [
    {
      title: "Machine Learning & AI",
      iconName: "BrainCircuit",
      description: "Predictive modeling, regression analysis, computer vision, and NLP pipelines.",
      skills: [
        { name: "Python", level: 95, tag: "Core Language" },
        { name: "Scikit-Learn", level: 90, tag: "ML Framework" },
        { name: "OpenCV", level: 85, tag: "Computer Vision" },
        { name: "Pandas / NumPy", level: 95, tag: "Data Wrangling" },
        { name: "PyTorch", level: 78, tag: "Deep Learning" }
      ]
    },
    {
      title: "Data Engineering & Automation",
      iconName: "Database",
      description: "Web scraping, API integration, database design, and workflow automation.",
      skills: [
        { name: "PostgreSQL / SQL", level: 90, tag: "Relational DB" },
        { name: "Web Scraping & APIs", level: 95, tag: "Data Extraction" },
        { name: "Git / GitHub Actions", level: 88, tag: "CI/CD" },
        { name: "Docker", level: 75, tag: "Containerization" },
        { name: "FastAPI / Node.js", level: 85, tag: "Backend APIs" }
      ]
    },
    {
      title: "Web Engineering & 3D Viz",
      iconName: "Layout",
      description: "Modern full-stack web engineering with interactive 3D WebGL graphics.",
      skills: [
        { name: "TypeScript / React", level: 92, tag: "Frontend" },
        { name: "Next.js (App Router)", level: 90, tag: "Framework" },
        { name: "Three.js / WebGL", level: 82, tag: "3D Visuals" },
        { name: "Tailwind CSS", level: 95, tag: "Styling" },
        { name: "D3.js / Chart.js", level: 85, tag: "Dataviz" }
      ]
    }
  ],

  experience: [
    {
      id: "edu-ucsd",
      role: "B.S. in Cognitive Science (Specialization in Machine Learning & Neural Computation)",
      organization: "University of California, San Diego (UCSD)",
      period: "Graduated",
      location: "La Jolla, CA",
      description: [
        "Specialized in Machine Learning Algorithms, Neural Computation, Data Structures & Algorithms, and Data Science.",
        "Active member in Data Science Student Society (DS3), Cognitive Science Student Association (CSSA Web Team), and Computer Science and Engineering Society (CSES Front-End Developer)."
      ],
      skills: ["Machine Learning", "Neural Computation", "Data Science", "Python", "C++", "Statistics"],
      type: "education"
    },
    {
      id: "project-transformi",
      role: "Lead Developer — Transformi! ML Discord Bot",
      organization: "Independent ML Development",
      period: "2024",
      location: "Remote",
      description: [
        "Engineered an interactive Discord bot enabling users to generate linear regression models from custom data uploads.",
        "Implemented real-time plot generation, correlation evaluation, and statistical reporting directly within Discord channels."
      ],
      skills: ["Python", "Scikit-Learn", "Matplotlib", "Discord API"],
      type: "project"
    },
    {
      id: "project-daily-motivation",
      role: "Creator & Automation Engineer — Daily Motivation Bot",
      organization: "Independent Product",
      period: "2023",
      location: "Remote",
      description: [
        "Developed automated Python scripts that published daily content and weekly interactive polls to Twitter/X.",
        "Stored response telemetry in PostgreSQL to analyze engagement trends over time."
      ],
      skills: ["Python", "PostgreSQL", "Twitter API", "Cron Automation"],
      type: "project"
    }
  ]
};
