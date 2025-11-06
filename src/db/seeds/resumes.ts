import { db } from '@/db';
import { resumes } from '@/db/schema';

async function main() {
    const now = new Date();
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    const fourMonthsAgo = new Date(now.getTime() - 120 * 24 * 60 * 60 * 1000);

    const sampleResumes = [
        {
            userId: 1,
            name: 'Software Engineer Resume',
            template: 'modern',
            thumbnail: null,
            atsScore: 85,
            lastUpdated: now.toISOString(),
            createdAt: threeMonthsAgo.toISOString(),
        },
        {
            userId: 1,
            name: 'Full Stack Developer Resume',
            template: 'professional',
            thumbnail: null,
            atsScore: 78,
            lastUpdated: oneWeekAgo.toISOString(),
            createdAt: twoMonthsAgo.toISOString(),
        },
        {
            userId: 2,
            name: 'Data Scientist Resume',
            template: 'minimal',
            thumbnail: null,
            atsScore: 92,
            lastUpdated: threeDaysAgo.toISOString(),
            createdAt: fourMonthsAgo.toISOString(),
        },
        {
            userId: 2,
            name: 'ML Engineer Resume',
            template: 'modern',
            thumbnail: null,
            atsScore: 88,
            lastUpdated: fiveDaysAgo.toISOString(),
            createdAt: oneMonthAgo.toISOString(),
        }
    ];

    await db.insert(resumes).values(sampleResumes);
    
    console.log('✅ Resumes seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});