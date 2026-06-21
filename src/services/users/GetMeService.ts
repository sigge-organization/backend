import { Users } from '@prisma/client';
import { prisma } from '../../repositories/users/AuthUserRepository';


type GetMeResponse = {
  id: string;
  email: string;
  name: string | null;
  course: string | null;
  created_at: Date;
  updated_at: Date;
}




export class GetMeService {
    /**
     * Retorna os dados do usuário logado(Depois quero trazer em quais grupos ele esta no momento)
     */
    async execute(userId: string): Promise<GetMeResponse> {
        const user = await prisma.users.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                course: true,
                created_at: true,
                updated_at: true,
            }
        });

        if (!user) {
            throw new Error('Usuário não encontrado.');
        }
        
        // Remove a propriedade teamMemberships do objeto final
        const {...userInfo } = user;

        return user;
    }
}