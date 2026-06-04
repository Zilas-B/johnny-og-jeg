'use client'

import { defineConfig } from 'sanity'
import { presentationTool } from 'sanity/presentation'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'

import { apiVersion, dataset, projectId } from './sanity/env'
import { schemaTypes } from './sanity/schemas'
import { structure } from './sanity/structure'

const SINGLETONS = ['siteSettings', 'homePage', 'kulturenPage'] as const
type Singleton = (typeof SINGLETONS)[number]
const isSingleton = (type: string): type is Singleton =>
  (SINGLETONS as readonly string[]).includes(type)

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [
    structureTool({ structure }),
    presentationTool({
      previewUrl: {
        origin: typeof window === 'undefined' ? 'http://localhost:3000' : window.location.origin,
        preview: '/',
        previewMode: {
          enable: '/api/draft-mode/enable',
        },
      },
      resolve: {
        locations: {
          homePage: { locations: [{ title: 'Forside', href: '/' }] },
          siteSettings: { locations: [{ title: 'Forside', href: '/' }] },
          kulturenPage: { locations: [{ title: 'Kulturen', href: '/kulturen' }] },
          landscape: {
            select: { slug: 'slug.current' },
            resolve: (doc) => ({
              locations: [
                { title: 'Kulturen', href: '/kulturen' },
                ...(doc?.slug ? [{ title: 'Arkivside', href: `/${doc.slug}` }] : []),
              ],
            }),
          },
          page: {
            select: { title: 'title', slug: 'slug.current' },
            resolve: (doc) => ({
              locations: doc?.slug
                ? [{ title: (doc.title as string) ?? 'Side', href: `/${doc.slug}` }]
                : [],
            }),
          },
        },
      },
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  document: {
    actions: (prev, { schemaType }) =>
      isSingleton(schemaType)
        ? prev.filter(
            ({ action }) =>
              action !== 'duplicate' && action !== 'delete' && action !== 'unpublish',
          )
        : prev,
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === 'global'
        ? prev.filter((opt) => !isSingleton(opt.templateId))
        : prev,
  },
})
