const logotext = "Srikanth";
const meta = {
    title: "Yepalagunta Srikanth | Full-Stack & Multi-Agentic Systems Engineer",
    description: "Software Engineer specializing in Multi-Agentic AI Architecture, Spring Boot Microservices, and Modern React Systems. Building high-performance, resilient distributed software.",
};

const introdata = {
    title: "I’m Yepalagunta Srikanth",
    subtitle: "Software Engineer & Multi-Agentic Systems Architect",
    animated: {
        first: "Multi-Agentic System Developer",
        second: "Spring Boot Microservices Architect",
        third: "Distributed Systems & REST APIs",
        fourth: "Autonomous AI Workflows & Tool-Use",
        fifth: "High-Performance React Architectures",
    },
    description: "Engineering scalable Spring Boot microservices, autonomous multi-agentic AI workflows, and high-performance React applications. Experienced in Warehouse Management Systems (WMS), Linux kernel sysfs telemetry, and resilient cloud architectures.",
    your_img_url: "https://images.unsplash.com/photo-1514790193030-c89d266d5a9d",
    highlights: [
        { label: "Core Focus", val: "Multi-Agentic & Microservices" },
        { label: "Backend", val: "Spring Boot 3, Java 17, MySQL" },
        { label: "Frontend", val: "React.js, Redux, Electron" },
        { label: "Domains", val: "WMS, Host Telemetry, Autonomous AI" },
    ]
};

const dataabout = {
    title: "a bit about myself",
    aboutme: "Software Engineer with deep experience in Warehouse Management Systems (WMS), Inventory & Order Management, and Autonomous Multi-Agentic AI systems. Skilled in architecting microservices and RESTful APIs with Java and Spring Boot, and responsive frontends using React.js and Redux. Passionate about distributed computing, database optimization with MySQL, and building reliable systems across the SDLC.",
};

const worktimeline = [
    {
        jobtitle: "Software Engineer",
        where: "Vyshnavi Information Technologies Pvt Ltd",
        date: "January 2024 – Present",
    },
    {
        jobtitle: "Software Engineer Trainee",
        where: "Vyshnavi Information Technologies Pvt Ltd",
        date: "July 2023 – December 2023",
    },
];

const skills = [
    { name: "Multi-Agentic AI Systems", value: 95 },
    { name: "Microservices", value: 90 },
    { name: "Java 17", value: 92 },
    { name: "Spring Boot", value: 90 },
    { name: "Spring Security & JWT", value: 88 },
    { name: "Spring Data JPA", value: 88 },
    { name: "RESTful APIs", value: 95 },
    { name: "MySQL & Database Optimization", value: 85 },
    { name: "React.js", value: 90 },
    { name: "Redux", value: 82 },
    { name: "JavaScript (ES6+)", value: 90 },
    { name: "Electron & Linux sysfs", value: 85 },
    { name: "WMS (Warehouse Management Systems)", value: 92 },
    { name: "Inventory & Order Management", value: 90 },
    { name: "Docker & Containerization", value: 80 },
    { name: "Git & CI/CD", value: 85 },
];

const skillGroups = {
    Core: ["Multi-Agentic AI", "Microservices", "Java", "Spring Boot", "React.js", "SQL", "Git"],
    Backend: ["Spring Boot 3", "Spring Security (JWT)", "Spring Data JPA", "Hibernate", "RESTful APIs", "Microservices Architecture"],
    Frontend: ["React.js", "Redux", "Bootstrap", "Material UI", "Electron IPC", "HTML5 & CSS3"],
    DatabaseAndCloud: ["MySQL", "Docker", "Clever Cloud", "TiDB Cloud", "Supabase"],
    Tools: ["Maven", "IntelliJ IDEA", "VS Code", "GitHub Actions", "Postman"],
    Domains: ["Warehouse Management Systems (WMS)", "Inventory & Order Logistics", "Host Diagnostics Telemetry", "SDLC"],
};

const services = [
    {
        title: "Multi-Agentic AI & Autonomous Workflows",
        description:
            "Design and build autonomous multi-agentic architectures with specialized agent roles, inter-agent coordination, tool execution pipelines, and automated self-healing workflows.",
    },
    {
        title: "Microservices & Distributed Architecture",
        description:
            "Architect and implement decoupled microservices using Java and Spring Boot, including stateless JWT security, inter-service communication, and independent database models.",
    },
    {
        title: "Robust Backend & REST APIs",
        description:
            "Build robust, production-ready RESTful APIs with Spring Boot, Spring Security, Spring Data JPA, and Hibernate, optimized for high throughput and security.",
    },
    {
        title: "Modern Responsive Frontends",
        description:
            "Develop single-page applications and desktop tools with React.js, Redux, and Electron, featuring responsive mobile-first layouts, accessible UI, and real-time state sync.",
    },
    {
        title: "WMS & Supply Chain Solutions",
        description:
            "Engineer end-to-end warehouse management workflows including inventory receiving, put-away, wave picking, packing, shipping, and order dispatching.",
    },
    {
        title: "Database Design & Optimization",
        description:
            "Design relational schemas, optimize indexing strategies and complex queries with MySQL, and manage automated schema evolutions across microservice databases.",
    },
];

const products = [
    {
        id: "go-seeker",
        title: "Go Seeker",
        tagline: "Deep Hardware Diagnostic & Real-Time Host Telemetry Suite for Ubuntu / Linux",
        category: "Ubuntu & System Diagnostics",
        badge: "Ubuntu / Linux Native",
        status: "Production Ready",
        img: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
        description: "An advanced desktop hardware diagnostic and real-time host inspection tool engineered specifically for Ubuntu and Linux. Directly reads authentic hardware telemetry from the host by querying Linux kernel sysfs (/sys), native OS drivers, and system interfaces—delivering per-core CPU clock speeds, memory module topologies, GPU controllers, motherboard, and BIOS specifications with zero browser-level approximations.",
        architecture: "Sandboxed Electron IPC bridge architecture (nodeIntegration: false, contextIsolation: true) exposing a secure read-only window.deviceHardware.getSnapshot() contract. Gathers authentic host metrics via systeminformation and kernel sysfs on Linux, paired with a React interface running a 1-second real-time telemetry polling loop.",
        techStack: [
            "Ubuntu",
            "Linux Kernel",
            "Electron",
            "React.js",
            "systeminformation",
            "Node.js",
            "IPC Bridge",
        ],
        features: [
            "Deep hardware inspection via Linux kernel sysfs (/sys) & native OS interfaces",
            "Real-time 1-second telemetry polling for per-core CPU clock frequencies and memory load",
            "Granular memory module layout, RAM timings, and DIMM slot topology",
            "Motherboard, BIOS version, GPU graphics controllers, and OS build telemetry",
            "Packaged for Ubuntu (DEB & AppImage) and Linux ARM64 (Raspberry Pi)",
            "Strict zero-guesswork design: reports authentic host metrics without fabricated fallbacks",
            "Exportable hardware snapshot reports for system benchmarking & audit compliance",
        ],
        link: "https://github.com/Srikanthy12866/Go-Seek",
        github: "https://github.com/Srikanthy12866/Go-Seek",
        stats: {
            targetOS: "Ubuntu (DEB / AppImage)",
            telemetry: "1s Real-Time Polling",
            architecture: "Sandboxed Electron IPC",
            accuracy: "Kernel Native (/sys)",
        },
    },
];

const dataportfolio = products.map((p) => ({
    img: p.img,
    description: p.title + " - " + p.tagline,
    link: p.link,
}));

// Backend API configuration for Contact & Tickets (Microservice on port 8082)
const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8082";

const contactConfig = {
    YOUR_EMAIL: "srikanthy12866@gmail.com",
    description: "Feel free to reach out for collaborations, architecture discussions, or enterprise projects. Powered directly by our secure Spring Boot backend microservice.",
    apiEndpoint: `${BACKEND_BASE_URL}/api/contact`,
    ticketEndpoint: `${BACKEND_BASE_URL}/api/tickets`,
};

const socialprofils = {
    github: "https://github.com/Srikanthy12866?tab=repositories",
    facebook: "https://www.facebook.com/srikanth12866/?locale=en_GB",
    linkedin: "https://www.linkedin.com/in/sri12866/",
    instagram: "https://www.instagram.com/sri.12866/"
};

// Resume URL routed securely through backend proxy (Goal 5: no exposed API keys)
const resume = `${BACKEND_BASE_URL}/api/resume/download`;

export {
    meta,
    dataabout,
    dataportfolio,
    products,
    worktimeline,
    skills,
    services,
    introdata,
    contactConfig,
    socialprofils,
    logotext,
    resume,
    skillGroups,
    BACKEND_BASE_URL,
};
