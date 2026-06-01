import { CogIcon } from '@sanity/icons'
import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Indhold')
    .items([
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
        (listItem) => listItem.getId() !== 'siteSettings',
      ),
    ])
