import { db } from '@/db';
import { courses } from '@/db/schema';

async function main() {
    const sampleCourses = [
        {
            userId: 1,
            name: 'Advanced React Patterns',
            platform: 'Frontend Masters',
            instructor: 'Kent C. Dodds',
            completionDate: '2023-07-15',
            certificateUrl: 'https://frontendmasters.com/certificates/john-react',
            skillsLearned: 'React, Hooks, Context API, Performance Optimization',
            duration: '8 hours',
            createdAt: new Date('2023-07-15').toISOString(),
        },
        {
            userId: 1,
            name: 'Microservices with Node.js and React',
            platform: 'Udemy',
            instructor: 'Stephen Grider',
            completionDate: '2023-10-20',
            certificateUrl: 'https://udemy.com/certificate/john-microservices',
            skillsLearned: 'Microservices, Docker, Kubernetes, Message Queues',
            duration: '54 hours',
            createdAt: new Date('2023-10-20').toISOString(),
        },
        {
            userId: 1,
            name: 'System Design for Interviews',
            platform: 'Educative',
            instructor: 'Educative Team',
            completionDate: '2024-01-10',
            certificateUrl: null,
            skillsLearned: 'System Design, Scalability, Distributed Systems',
            duration: '12 hours',
            createdAt: new Date('2024-01-10').toISOString(),
        },
        {
            userId: 1,
            name: 'AWS Certified Solutions Architect',
            platform: 'A Cloud Guru',
            instructor: 'Ryan Kroonenburg',
            completionDate: '2024-03-25',
            certificateUrl: 'https://acloudguru.com/cert/john-aws',
            skillsLearned: 'AWS, Cloud Architecture, S3, EC2, Lambda',
            duration: '20 hours',
            createdAt: new Date('2024-03-25').toISOString(),
        },
        {
            userId: 2,
            name: 'Machine Learning Specialization',
            platform: 'Coursera',
            instructor: 'Andrew Ng',
            completionDate: '2023-06-30',
            certificateUrl: 'https://coursera.org/verify/john-ml-spec',
            skillsLearned: 'Machine Learning, Neural Networks, Supervised Learning, Unsupervised Learning',
            duration: '45 hours',
            createdAt: new Date('2023-06-30').toISOString(),
        },
        {
            userId: 2,
            name: 'Deep Learning Specialization',
            platform: 'Coursera',
            instructor: 'Andrew Ng',
            completionDate: '2023-11-15',
            certificateUrl: 'https://coursera.org/verify/jane-dl-spec',
            skillsLearned: 'Deep Learning, CNNs, RNNs, Transformers, PyTorch',
            duration: '60 hours',
            createdAt: new Date('2023-11-15').toISOString(),
        },
        {
            userId: 2,
            name: 'Natural Language Processing with Transformers',
            platform: 'Hugging Face',
            instructor: 'Lewis Tunstall',
            completionDate: '2024-02-28',
            certificateUrl: 'https://huggingface.co/cert/jane-nlp',
            skillsLearned: 'NLP, Transformers, BERT, GPT, Fine-tuning',
            duration: '15 hours',
            createdAt: new Date('2024-02-28').toISOString(),
        },
        {
            userId: 2,
            name: 'MLOps Engineering',
            platform: 'DataCamp',
            instructor: 'DataCamp Team',
            completionDate: '2024-05-10',
            certificateUrl: 'https://datacamp.com/cert/jane-mlops',
            skillsLearned: 'MLOps, Model Deployment, Monitoring, CI/CD for ML',
            duration: '25 hours',
            createdAt: new Date('2024-05-10').toISOString(),
        },
    ];

    await db.insert(courses).values(sampleCourses);
    
    console.log('✅ Courses seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});