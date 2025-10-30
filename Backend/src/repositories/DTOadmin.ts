import type { Prisma, administradores } from '@prisma/client';

interface IAdminRepository  {
  create(data: Prisma.administradoresUncheckedCreateInput): Promise<administradores>
  findByEmail(email: string): Promise<administradores | null>
  findById(id: number): Promise<administradores | null>
}


export type { IAdminRepository }