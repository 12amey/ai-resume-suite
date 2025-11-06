import { db } from '@/db';
import { hackathons } from '@/db/schema';

async function main() {
    const sampleHackathons = [
        {
            userId: 1,
            name: 'HackMIT 2023',
            organizer: 'MIT',
            date: '2023-09-16',
            position: '1st Place',
            projectName: 'SmartScheduler',
            description: 'AI-powered calendar assistant that optimizes meeting schedules',
            technologies: 'React, Python, OpenAI API, Firebase',
            teamSize: 4,
            createdAt: new Date('2023-09-20').toISOString(),
        },
        {
            userId: 1,
            name: 'TreeHacks 2024',
            organizer: 'Stanford University',
            date: '2024-02-17',
            position: 'Top 10',
            projectName: 'EcoTrack',
            description: 'Carbon footprint tracking app with gamification',
            technologies: 'React Native, Node.js, MongoDB, ML',
            teamSize: 3,
            createdAt: new Date('2024-02-20').toISOString(),
        },
        {
            userId: 2,
            name: 'PennApps XXIV',
            organizer: 'University of Pennsylvania',
            date: '2023-09-08',
            position: 'Winner',
            projectName: 'HealthAI',
            description: 'Medical diagnosis assistant using computer vision',
            technologies: 'Python, TensorFlow, Flask, React',
            teamSize: 4,
            createdAt: new Date('2023-09-12').toISOString(),
        },
        {
            userId: 2,
            name: 'LA Hacks 2024',
            organizer: 'UCLA',
            date: '2024-04-05',
            position: '2nd Place',
            projectName: 'SafeCity',
            description: 'Crime prediction and prevention platform using ML',
            technologies: 'Python, Scikit-learn, D3.js, PostgreSQL',
            teamSize: 3,
            createdAt: new Date('2024-04-08').toISOString(),
        },
        {
            userId: 2,
            name: 'CalHacks 10.0',
            organizer: 'UC Berkeley',
            date: '2024-10-20',
            position: 'Best AI Hack',
            projectName: 'CodeMentor',
            description: 'AI-powered coding tutor for beginners',
            technologies: 'Python, GPT-4, Next.js, Supabase',
            teamSize: 2,
            createdAt: new Date('2024-10-23').toISOString(),
        }
    ];

    await db.insert(hackathons).values(sampleHackathons);
    
    console.log('✅ Hackathons seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});