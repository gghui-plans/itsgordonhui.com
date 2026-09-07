import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    shortTitle: z.string(),
    client: z.string(),
    employer: z.string(),
    role: z.string(),
    years: z.string(),
    status: z.enum(['Ongoing', 'Completed']),
    category: z.enum(['Transportation strategy', 'Parking management']),
    summary: z.string(),
    contribution: z.string(),
    responsibilities: z.array(z.string()),
    tags: z.array(z.string()),
    featureOrder: z.number(),
    sourceUrl: z.url(),
    sourceLabel: z.string(),
  }),
});

const insights = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/insights' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    slug: z.string(),
    description: z.string(),
    publicationType: z.enum(['Flagship paper', 'Practice article', 'Practice commentary', 'Case note', 'Short insight']),
    publishedDate: z.date(),
    updatedDate: z.date().optional(),
    abstract: z.string(),
    keyFindings: z.array(z.string()).default([]),
    topics: z.array(z.string()).default([]),
    sourceVersion: z.string().optional(),
    companionVersion: z.string().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, insights };
