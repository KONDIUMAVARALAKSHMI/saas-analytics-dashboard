'use server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
})

export async function updateProfile(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' }
  }

  const rawData = {
    name: formData.get('name'),
  }

  const parsed = updateProfileSchema.safeParse(rawData)
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0]?.message ?? 'Validation error',
    }
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { name: parsed.data.name },
    })

    revalidatePath('/profile')
    return { success: true }
  } catch (e) {
    return { success: false, error: 'Failed to update profile' }
  }
}
