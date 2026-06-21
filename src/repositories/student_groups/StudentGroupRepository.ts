import { Modality } from '@prisma/client';
import prisma from '../../prisma';

export interface CreateStudentGroupDTO {
  theme: string;
  university_course?: string;
  description?: string;
  modality?: Modality;
  creator_id: string;
  password?: string;
  joinCode: string;
}

export interface UpdateStudentGroupDTO {
  theme?: string;
  university_course?: string;
  description?: string;
  modality?: Modality;
}

export class StudentGroupRepository {
  async create(data: CreateStudentGroupDTO) {
    const { creator_id, ...groupData } = data;
    return prisma.student_Group.create({
      data: {
        ...groupData,
        members: {
          create: {
            user_id: creator_id,
            role: "ADMIN"
          }
        }
      }
    });
  }

  async findAll(userId: string) {
    return prisma.student_Group.findMany({
      where: { 
        deleted_at: null,
        members: {
          some: {
            user_id: userId
          }
        }
      },
      include: {
        _count: {
          select: { members: true }
        },
        members: {
          where: { user_id: userId },
          select: { role: true, user_id: true }
        }
      }
    });
  }

  async findById(id: string) {
    return prisma.student_Group.findFirst({
      where: { id, deleted_at: null },
      include: {
        members: {
          include: { user: { select: { id: true, name: true, email: true, course: true } } }
        }
      }
    });
  }

  async findByJoinCode(joinCode: string) {
    return prisma.student_Group.findFirst({
      where: { joinCode, deleted_at: null }
    });
  }

  async addMember(groupId: string, userId: string) {
    return prisma.group_Members.create({
      data: {
        group_id: groupId,
        user_id: userId,
        role: "STUDENT"
      }
    });
  }

  async isMember(groupId: string, userId: string) {
    const member = await prisma.group_Members.findFirst({
      where: { group_id: groupId, user_id: userId }
    });
    return !!member;
  }

  async update(id: string, data: UpdateStudentGroupDTO) {
    return prisma.student_Group.update({
      where: { id },
      data
    });
  }

  async delete(id: string) {
    return prisma.student_Group.update({
      where: { id },
      data: { deleted_at: new Date() }
    });
  }
}
