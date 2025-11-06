import { db } from '@/db';
import { users } from '@/db/schema';

async function main() {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const eightMonthsAgo = new Date();
    eightMonthsAgo.setMonth(eightMonthsAgo.getMonth() - 8);
    
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const sampleUsers = [
        {
            id: 1,
            email: 'john@example.com',
            name: 'John Smith',
            createdAt: sixMonthsAgo.toISOString(),
            updatedAt: oneWeekAgo.toISOString(),
        },
        {
            id: 2,
            email: 'jane@example.com',
            name: 'Jane Doe',
            createdAt: eightMonthsAgo.toISOString(),
            updatedAt: threeDaysAgo.toISOString(),
        }
    ];

    await db.insert(users).values(sampleUsers);
    
    console.log('✅ Users seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});