-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "course" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student_Group" (
    "id" SERIAL NOT NULL,
    "theme" TEXT NOT NULL,
    "university_course" TEXT,
    "description" TEXT,
    "modality" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Student_Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group_Members" (
    "user_id" INTEGER NOT NULL,
    "group_id" INTEGER NOT NULL,
    "role" TEXT NOT NULL,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Group_Members_pkey" PRIMARY KEY ("user_id","group_id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "id_student_group" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "date_time_event" TIMESTAMP(3) NOT NULL,
    "local_or_link_event" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Warning" (
    "id_warning" SERIAL NOT NULL,
    "id_student_group" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "post_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Warning_pkey" PRIMARY KEY ("id_warning")
);

-- CreateTable
CREATE TABLE "Material" (
    "id_material" SERIAL NOT NULL,
    "id_student_group" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "external_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Material_pkey" PRIMARY KEY ("id_material")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "Group_Members" ADD CONSTRAINT "Group_Members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group_Members" ADD CONSTRAINT "Group_Members_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Student_Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_id_student_group_fkey" FOREIGN KEY ("id_student_group") REFERENCES "Student_Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Warning" ADD CONSTRAINT "Warning_id_student_group_fkey" FOREIGN KEY ("id_student_group") REFERENCES "Student_Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Material" ADD CONSTRAINT "Material_id_student_group_fkey" FOREIGN KEY ("id_student_group") REFERENCES "Student_Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
