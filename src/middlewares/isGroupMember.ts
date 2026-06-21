import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma';

export async function isGroupMember(req: Request, res: Response, next: NextFunction) {
  const user_id = req.user_id;
  const studentGroupId = (req.params.studentGroupId || req.params.id) as string;

  if (!user_id) {
    return res.status(401).json({ error: 'Usuário não autenticado.' });
  }

  if (!studentGroupId) {
    return res.status(400).json({ error: 'ID do grupo de estudos não fornecido.' });
  }

  try {
    const membership = await prisma.group_Members.findFirst({
      where: {
        user_id,
        group_id: studentGroupId,
      }
    });

    if (!membership) {
      return res.status(403).json({ error: 'Você não tem permissão para acessar os recursos deste grupo porque não é um participante.' });
    }

    return next();
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao verificar permissões do grupo.' });
  }
}
