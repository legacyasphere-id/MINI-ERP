-- CreateTable
CREATE TABLE "settings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "warehouseName" TEXT NOT NULL DEFAULT 'Main Distribution Centre',
    "warehouseCode" TEXT NOT NULL DEFAULT 'WH-MAIN-001',
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "lowStockPct" INTEGER NOT NULL DEFAULT 30,
    "overstockPct" INTEGER NOT NULL DEFAULT 110,
    "movementLogLimit" INTEGER NOT NULL DEFAULT 20,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);
