import { db } from '@/db';
import { projects } from '@/db/schema';

async function main() {
    const sampleProjects = [
        {
            userId: 1,
            name: 'TaskMaster Pro',
            description: 'Full-stack task management app with real-time collaboration',
            link: 'https://taskmaster-pro.com',
            githubUrl: 'https://github.com/johnsmith/taskmaster',
            technologies: 'React, Node.js, Socket.io, MongoDB',
            startDate: '2023-05-01',
            endDate: '2023-08-30',
            status: 'completed',
            createdAt: new Date('2023-05-01').toISOString(),
        },
        {
            userId: 1,
            name: 'DevPortfolio',
            description: 'Portfolio website builder for developers with templates',
            link: 'https://devportfolio.io',
            githubUrl: 'https://github.com/johnsmith/devportfolio',
            technologies: 'Next.js, TypeScript, Tailwind CSS, Vercel',
            startDate: '2023-09-15',
            endDate: '2024-01-20',
            status: 'completed',
            createdAt: new Date('2023-09-15').toISOString(),
        },
        {
            userId: 1,
            name: 'API Gateway Service',
            description: 'Scalable API gateway with rate limiting and authentication',
            link: null,
            githubUrl: 'https://github.com/johnsmith/api-gateway',
            technologies: 'Go, Redis, JWT, Docker',
            startDate: '2024-02-01',
            endDate: null,
            status: 'in-progress',
            createdAt: new Date('2024-02-01').toISOString(),
        },
        {
            userId: 1,
            name: 'CodeSnippet Manager',
            description: 'VS Code extension for managing code snippets',
            link: null,
            githubUrl: 'https://github.com/johnsmith/code-snippets',
            technologies: 'TypeScript, VS Code API, SQLite',
            startDate: '2024-04-10',
            endDate: null,
            status: 'in-progress',
            createdAt: new Date('2024-04-10').toISOString(),
        },
        {
            userId: 2,
            name: 'SentimentAnalyzer',
            description: 'Real-time sentiment analysis dashboard for social media',
            link: 'https://sentiment-analyzer.app',
            githubUrl: 'https://github.com/janedoe/sentiment-analyzer',
            technologies: 'Python, FastAPI, Transformers, React, D3.js',
            startDate: '2023-04-01',
            endDate: '2023-07-15',
            status: 'completed',
            createdAt: new Date('2023-04-01').toISOString(),
        },
        {
            userId: 2,
            name: 'ImageClassifier API',
            description: 'REST API for image classification using custom CNN models',
            link: 'https://api.imageclassifier.com',
            githubUrl: 'https://github.com/janedoe/image-classifier',
            technologies: 'Python, PyTorch, FastAPI, Docker, AWS',
            startDate: '2023-08-20',
            endDate: '2023-11-30',
            status: 'completed',
            createdAt: new Date('2023-08-20').toISOString(),
        },
        {
            userId: 2,
            name: 'DataViz Studio',
            description: 'Interactive data visualization platform for business analytics',
            link: 'https://dataviz-studio.com',
            githubUrl: 'https://github.com/janedoe/dataviz-studio',
            technologies: 'Python, Plotly, Dash, Pandas, PostgreSQL',
            startDate: '2024-01-05',
            endDate: null,
            status: 'in-progress',
            createdAt: new Date('2024-01-05').toISOString(),
        }
    ];

    await db.insert(projects).values(sampleProjects);
    
    console.log('✅ Projects seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});