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

export const collections = { projects };
