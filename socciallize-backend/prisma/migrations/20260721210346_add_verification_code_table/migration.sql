-- CreateTable
CREATE TABLE "VerifyCode" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "Code" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerifyCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VerifyCode_email_key" ON "VerifyCode"("email");
