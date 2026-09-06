import { BookIcon, CogIcon, EarthAmericasIcon, HomeIcon, PresentationIcon } from '@sanity/icons'
import type { StructureResolver } from 'sanity/structure'

const PINNED_SINGLETONS = [
  'siteSettings',
  'homePage',
  'kulturenPage',
  'historienPage',
  'foredragPage',
  'bogerPage',
] as const

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Front page — Johnny og jeg')
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
        .title('Historien')
        .icon(BookIcon)
        .child(
          S.document()
            .schemaType('historienPage')
            .documentId('historienPage'),
        ),
      S.listItem()
        .title('Foredrag')
        .icon(PresentationIcon)
        .child(
          S.document()
            .schemaType('foredragPage')
            .documentId('foredragPage'),
        ),
      S.listItem()
        .title('Bøger, spil, film')
        .icon(BookIcon)
        .child(
          S.document()
            .schemaType('bogerPage')
            .documentId('bogerPage'),
        ),
      S.listItem()
        .title('Site Settings')
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
