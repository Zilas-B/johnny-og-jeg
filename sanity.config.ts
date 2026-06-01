'use client'

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'

import { apiVersion, dataset, projectId } from './sanity/env'
import { schemaTypes } from './sanity/schemas'
import { structure } from './sanity/structure'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  document: {
    actions: (prev, { schemaType }) =>
      schemaType === 'siteSettings'
        ? prev.filter(
            ({ action }) =>
              action !== 'duplicate' && action !== 'delete' && action !== 'unpublish',
          )
        : prev,
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === 'global'
        ? prev.filter((opt) => opt.templateId !== 'siteSettings')
        : prev,
  },
})
