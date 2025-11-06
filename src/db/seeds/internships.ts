import { db } from '@/db';
import { internships } from '@/db/schema';

async function main() {
    const sampleInternships = [
        {
            userId: 1,
            company: 'Google',
            position: 'Software Engineering Intern',
            startDate: '2023-06-01',
            endDate: '2023-08-31',
            current: false,
            description: 'Developed scalable microservices using Go and Kubernetes. Improved API response time by 40%.',
            skillsUsed: 'Go, Kubernetes, Docker, REST APIs',
            location: 'Mountain View, CA',
            createdAt: new Date('2023-06-01').toISOString(),
        },
        {
            userId: 1,
            company: 'Microsoft',
            position: 'Backend Developer Intern',
            startDate: '2024-01-15',
            endDate: '2024-05-30',
            current: false,
            description: 'Built cloud-native applications on Azure. Implemented CI/CD pipelines and automated testing.',
            skillsUsed: 'C#, Azure, CI/CD, Unit Testing',
            location: 'Redmond, WA',
            createdAt: new Date('2024-01-15').toISOString(),
        },
        {
            userId: 1,
            company: 'StartupX',
            position: 'Full Stack Intern',
            startDate: '2024-06-01',
            endDate: null,
            current: true,
            description: 'Working on React and Node.js applications. Managing database migrations and API development.',
            skillsUsed: 'React, Node.js, PostgreSQL, Express',
            location: 'Remote',
            createdAt: new Date('2024-06-01').toISOString(),
        },
        {
            userId: 2,
            company: 'Meta',
            position: 'Data Science Intern',
            startDate: '2023-05-20',
            endDate: '2023-08-20',
            current: false,
            description: 'Analyzed user engagement data and built ML models for recommendation systems.',
            skillsUsed: 'Python, TensorFlow, Pandas, SQL',
            location: 'Menlo Park, CA',
            createdAt: new Date('2023-05-20').toISOString(),
        },
        {
            userId: 2,
            company: 'Amazon',
            position: 'ML Engineering Intern',
            startDate: '2023-09-01',
            endDate: '2023-12-15',
            current: false,
            description: 'Developed computer vision models for product categorization. Deployed models to production using SageMaker.',
            skillsUsed: 'Python, PyTorch, AWS SageMaker, Computer Vision',
            location: 'Seattle, WA',
            createdAt: new Date('2023-09-01').toISOString(),
        },
        {
            userId: 2,
            company: 'DeepMind',
            position: 'Research Intern',
            startDate: '2024-01-10',
            endDate: '2024-06-30',
            current: false,
            description: 'Conducted research on reinforcement learning algorithms. Published findings in internal research papers.',
            skillsUsed: 'Python, JAX, Reinforcement Learning, Research',
            location: 'London, UK',
            createdAt: new Date('2024-01-10').toISOString(),
        },
        {
            userId: 2,
            company: 'OpenAI',
            position: 'AI Research Intern',
            startDate: '2024-07-01',
            endDate: null,
            current: true,
            description: 'Working on large language model fine-tuning and evaluation frameworks.',
            skillsUsed: 'Python, Transformers, LLMs, PyTorch',
            location: 'San Francisco, CA',
            createdAt: new Date('2024-07-01').toISOString(),
        },
    ];

    await db.insert(internships).values(sampleInternships);
    
    console.log('✅ Internships seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});