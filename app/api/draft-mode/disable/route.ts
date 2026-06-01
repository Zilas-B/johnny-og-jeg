import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  const draft = await draftMode()
  if (draft.isEnabled) draft.disable()
  const { searchParams } = new URL(request.url)
  redirect(searchParams.get('redirectTo') ?? '/')
}
