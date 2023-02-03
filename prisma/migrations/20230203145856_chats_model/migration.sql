-- AlterTable
ALTER TABLE "User" ADD COLUMN     "chatsId" TEXT;

-- CreateTable
CREATE TABLE "Chats" (
    "id" TEXT NOT NULL,
    "isGroupChat" BOOLEAN NOT NULL,
    "chatName" TEXT NOT NULL,

    CONSTRAINT "Chats_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_chatsId_fkey" FOREIGN KEY ("chatsId") REFERENCES "Chats"("id") ON DELETE SET NULL ON UPDATE CASCADE;
