import { CogIcon, EarthAmericasIcon, HomeIcon } from '@sanity/icons'
import type { StructureResolver } from 'sanity/structure'

const PINNED_SINGLETONS = ['siteSettings', 'homePage', 'kulturenPage'] as const

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Indhold')
    .items([
      S.listItem()
        .title('Forside — Johnny og jeg')
        .icon(HomeIcon)
        .child(
          S.document()
            .schemaType('homePage')
            .documentId('homePage'),
        ),
      S.listItem()
        .title('Kulturen')
        .icon(EarthAmericasIcon)
        .child(
          S.document()
            .schemaType('kulturenPage')
            .documentId('kulturenPage'),
        ),
      S.listItem()
        .title('Indstillinger for sitet')
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings'),
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem) => !PINNED_SINGLETONS.includes(listItem.getId() as (typeof PINNED_SINGLETONS)[number]),
      ),
    ])
