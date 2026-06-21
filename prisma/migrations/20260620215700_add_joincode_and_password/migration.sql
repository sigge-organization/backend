-- AlterTable
ALTER TABLE "student_groups" ADD COLUMN "joinCode" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
ADD COLUMN "password" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "student_groups_joinCode_key" ON "student_groups"("joinCode");
