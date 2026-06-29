-- CreateTable
CREATE TABLE "PilotApplication" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "areas" TEXT NOT NULL,
    "dgcaId" TEXT NOT NULL,
    "experience" TEXT,
    "droneModels" TEXT NOT NULL,
    "shootTypes" TEXT,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "PilotApplication_whatsapp_key" ON "PilotApplication"("whatsapp");

