import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const resumes = sqliteTable('resumes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id).notNull(),
  name: text('name').notNull(),
  template: text('template').notNull().default('modern'),
  thumbnail: text('thumbnail'),
  atsScore: integer('ats_score'),
  lastUpdated: text('last_updated').notNull(),
  createdAt: text('created_at').notNull(),
});

export const personalInfo = sqliteTable('personal_info', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  resumeId: integer('resume_id').references(() => resumes.id).notNull().unique(),
  fullName: text('full_name'),
  title: text('title'),
  email: text('email'),
  phone: text('phone'),
  location: text('location'),
  linkedin: text('linkedin'),
  website: text('website'),
  summary: text('summary'),
});

export const internships = sqliteTable('internships', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id).notNull(),
  company: text('company').notNull(),
  position: text('position').notNull(),
  startDate: text('start_date').notNull(),
  endDate: text('end_date'),
  current: integer('current', { mode: 'boolean' }).default(false),
  description: text('description'),
  skillsUsed: text('skills_used'),
  location: text('location'),
  createdAt: text('created_at').notNull(),
});

export const hackathons = sqliteTable('hackathons', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id).notNull(),
  name: text('name').notNull(),
  organizer: text('organizer'),
  date: text('date').notNull(),
  position: text('position'),
  projectName: text('project_name'),
  description: text('description'),
  technologies: text('technologies'),
  teamSize: integer('team_size'),
  createdAt: text('created_at').notNull(),
});

export const courses = sqliteTable('courses', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id).notNull(),
  name: text('name').notNull(),
  platform: text('platform'),
  instructor: text('instructor'),
  completionDate: text('completion_date'),
  certificateUrl: text('certificate_url'),
  skillsLearned: text('skills_learned'),
  duration: text('duration'),
  createdAt: text('created_at').notNull(),
});

export const projects = sqliteTable('projects', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id).notNull(),
  name: text('name').notNull(),
  description: text('description'),
  link: text('link'),
  githubUrl: text('github_url'),
  technologies: text('technologies'),
  startDate: text('start_date'),
  endDate: text('end_date'),
  status: text('status'),
  createdAt: text('created_at').notNull(),
});

export const experiences = sqliteTable('experiences', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  resumeId: integer('resume_id').references(() => resumes.id).notNull(),
  sourceType: text('source_type'),
  sourceId: integer('source_id'),
  company: text('company'),
  position: text('position'),
  startDate: text('start_date'),
  endDate: text('end_date'),
  current: integer('current', { mode: 'boolean' }).default(false),
  description: text('description'),
  orderIndex: integer('order_index').default(0),
});

export const education = sqliteTable('education', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  resumeId: integer('resume_id').references(() => resumes.id).notNull(),
  school: text('school'),
  degree: text('degree'),
  field: text('field'),
  startDate: text('start_date'),
  endDate: text('end_date'),
  grade: text('grade'),
  orderIndex: integer('order_index').default(0),
});

export const skills = sqliteTable('skills', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id).notNull(),
  name: text('name').notNull(),
  category: text('category'),
  proficiency: text('proficiency'),
  sourceType: text('source_type'),
  sourceId: integer('source_id'),
  createdAt: text('created_at').notNull(),
});

export const resumeSkills = sqliteTable('resume_skills', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  resumeId: integer('resume_id').references(() => resumes.id).notNull(),
  skillId: integer('skill_id').references(() => skills.id).notNull(),
  orderIndex: integer('order_index').default(0),
});

export const certifications = sqliteTable('certifications', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  resumeId: integer('resume_id').references(() => resumes.id).notNull(),
  userId: integer('user_id').references(() => users.id).notNull(),
  name: text('name').notNull(),
  issuer: text('issuer'),
  date: text('date'),
  credentialUrl: text('credential_url'),
  orderIndex: integer('order_index').default(0),
});