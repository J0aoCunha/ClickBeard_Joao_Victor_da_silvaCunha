import type { Prisma, administradores } from '@prisma/client';

interface IAdminRepository  {
  Create(data: Prisma.administradoresUncheckedCreateInput): Promise<administradores>
  list(): Promise<administradores[]>
  delete(id: number): Promise<void>
}


export type { IAdminRepository }