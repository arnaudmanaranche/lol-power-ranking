import prisma from 'Utils/prisma'
import supabase from 'Utils/supabase'

export async function deleteUser(id: string): Promise<{ status: string }> {
  await prisma.user.delete({
    where: { id }
  })
  await supabase.auth.api.deleteUser(id)

  return { status: 'OK' }
}
