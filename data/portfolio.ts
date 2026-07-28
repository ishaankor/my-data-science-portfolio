export interface Project {
  id: string;
  title: string;
  year: string;
  category: 'Machine Learning' | 'Automation' | 'Data Visualization' | 'Web Apps';
  image: string;
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
    icon?: string;
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
  title: "Data Science & Analytics Engineer",
  location: "Greater Toronto Area, Canada",
  bio: "I build playful analytics experiences and full-stack data products that turn code, machine learning, and web automation into interactive dashboards, real-time recommenders, and live insights.",
  avatarUrl: "./images/personal-picture.avif",
  githubUsername: "ishaankor",
  email: "ishaankoradia@gmail.com",
  linkedin: "https://www.linkedin.com/in/ishaankoradia",
  twitter: "https://twitter.com/ishaankoradia",
  
  stats: [
    {
      label: "Interactive Projects",
      value: 12,
      suffix: "+",
      description: "Data products, AI bots & dashboards"
    },
    {
      label: "GitHub Repositories",
      value: 28,
      suffix: "+",
      description: "Open-source data & web tools"
    },
    {
      label: "Automated Data Pipelines",
      value: 50,
      suffix: "k+",
      description: "Records scraped & processed"
    },
    {
      label: "Models Deployed",
      value: 8,
      suffix: "",
      description: "Linear regression, OpenCV & ML tools"
    }
  ],

  learningNow: [
    "Three.js & WebGL 3D Visualization",
    "Prompt Engineering for AI Demos",
    "Python Automation & Cloud Scraping",
    "Real-time ML Model Pipelines",
    "Interactive D3 / Chart.js Dashboards"
  ],

  projects: [
    {
      id: "daily-motivation",
      title: "Daily Motivation Bot & Analytics",
      year: "2022",
      category: "Automation",
      image: "https://pbs.twimg.com/profile_images/1562894482483269632/y_dQWMLb_400x400.jpg",
      description: "An automated Twitter/X bot delivering daily quotes and weekly user statistics collected in PostgreSQL.",
      detailedDescription: "Built with Python, Tweepy, and PostgreSQL. It polls user interactions daily, aggregates sentiment and poll responses, and generates end-of-week data graphics automatically tweeted to thousands of followers.",
      tags: ["Python", "PostgreSQL", "Twitter API", "Automation", "NLP"],
      githubUrl: "https://github.com/ishaankor/daily-motivation",
      featured: true,
      metrics: "Daily polls across 5,000+ impressions"
    },
    {
      id: "twitter-scraping-ai",
      title: "Data Scraping & Vision AI Pipeline",
      year: "2023",
      category: "Machine Learning",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Logo_of_Twitter.svg/2491px-Logo_of_Twitter.svg.png",
      description: "Automation script utilizing OpenCV and AI to filter high-velocity tweets based on custom visual conditions.",
      detailedDescription: "Uses OpenCV computer vision and NLP filtering to scan stream data, extract key visual parameters, and automate multi-condition engagement tasks for data collection.",
      tags: ["Python", "OpenCV", "Machine Learning", "Web Scraping", "AI"],
      githubUrl: "https://github.com/ishaankor/twitter-scraping-ai",
      featured: true,
      metrics: "Processes 1,000+ tweets/min"
    },
    {
      id: "transformi-discord-ml",
      title: "Transformi! Discord ML Bot",
      year: "2024",
      category: "Machine Learning",
      image: "https://www.svgrepo.com/show/353655/discord-icon.svg",
      description: "A Discord bot capable of parsing unstructured user datasets and dynamically training Linear Regression models.",
      detailedDescription: "Integrates Discord API with Python Scikit-Learn and Matplotlib. Users upload CSVs or data snippets via Discord, and the bot fits regression models, outputs scatter plots with best-fit lines, and returns metrics.",
      tags: ["Python", "Scikit-Learn", "Discord.js", "Linear Regression", "Data Viz"],
      githubUrl: "https://github.com/ishaankor/transformi",
      featured: true,
      metrics: "Instant model fitting & plot rendering"
    },
    {
      id: "data-science-portfolio-v1",
      title: "Interactive Data Science Showcase",
      year: "2024",
      category: "Data Visualization",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60",
      description: "A web data product featuring real-time GitHub API analytics and dynamic project recommendation engine.",
      detailedDescription: "Designed to demonstrate data storytelling by pulling live GitHub metrics, computing repository language distributions, and running client-side tf-idf-like project search.",
      tags: ["Next.js", "React", "TypeScript", "Three.js", "Tailwind CSS"],
      githubUrl: "https://github.com/ishaankor/my-data-science-portfolio",
      liveUrl: "https://ishaankor.github.io/my-data-science-portfolio/",
      featured: true,
      metrics: "Real-time API & 3D WebGL hero"
    },
    {
      id: "customer-churn-analytics",
      title: "Customer Churn Predictive Model",
      year: "2023",
      category: "Machine Learning",
      image: "https://images.unsplash.com/photo-1543286386-713bdd548da4?w=800&auto=format&fit=crop&q=60",
      description: "Predictive pipeline modeling customer churn using XGBoost and SHAP explainability analysis.",
      detailedDescription: "Performed EDA, feature engineering, and hyperparameter tuning on telecom data to predict user churn with 91% ROC-AUC, providing actionable recommendations for retention campaigns.",
      tags: ["Python", "XGBoost", "Pandas", "SHAP", "Analytics"],
      githubUrl: "https://github.com/ishaankor",
      featured: false,
      metrics: "91% ROC-AUC accuracy"
    },
    {
      id: "realtime-crypto-dashboard",
      title: "Real-time Financial Stream Dashboard",
      year: "2023",
      category: "Data Visualization",
      image: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800&auto=format&fit=crop&q=60",
      description: "High-frequency streaming dashboard visualizing real-time market orderbooks via WebSocket.",
      detailedDescription: "Built with React and Plotly.js to stream live trade flow, calculate moving averages on the fly, and display volumetric depth charts with zero dropped frames.",
      tags: ["React", "JavaScript", "WebSocket", "Chart.js", "Streaming"],
      githubUrl: "https://github.com/ishaankor",
      featured: false,
      metrics: "Sub-100ms latency updates"
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
        { name: "PyTorch", level: 75, tag: "Deep Learning" }
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
      title: "Web Development & 3D Viz",
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
      role: "B.S. in Data Science",
      organization: "University / Academic Background",
      period: "2021 — Present",
      location: "California / Remote",
      description: [
        "Specialized in Statistical Learning, Machine Learning Algorithms, Data Structures & Algorithms, and Interactive Data Visualization.",
        "Engineered end-to-end data analysis pipelines, interactive web applications, and automated recommendation engines."
      ],
      skills: ["Data Science", "Machine Learning", "Python", "SQL", "Statistics"],
      type: "education"
    },
    {
      id: "project-transformi",
      role: "Lead Developer — Transformi! ML Discord Bot",
      organization: "Open Source / Independent Project",
      period: "2024",
      location: "Remote",
      description: [
        "Created an interactive Discord bot enabling users to generate linear regression models from custom data.",
        "Implemented real-time plot generation, correlation evaluation, and statistical reporting directly within Discord channels."
      ],
      skills: ["Python", "Scikit-Learn", "Matplotlib", "Discord API"],
      type: "project"
    },
    {
      id: "project-daily-motivation",
      role: "Creator & Engineer — Daily Motivation Bot",
      organization: "Independent Automation Product",
      period: "2022 — 2023",
      location: "Remote",
      description: [
        "Developed automated Python scripts that published daily content and weekly interactive polls to Twitter/X.",
        "Stored response telemetry in PostgreSQL to analyze engagement trends over time."
      ],
      skills: ["Python", "PostgreSQL", "Twitter API", "Cron / Automation"],
      type: "project"
    }
  ]
};
