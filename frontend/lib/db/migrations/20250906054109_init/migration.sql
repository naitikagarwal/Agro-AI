-- CreateTable
CREATE TABLE "Field" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Field_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DaywiseData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fieldId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "soilMoisture" REAL,
    "soilTemperature" REAL,
    "soilPH" REAL,
    "nutrientN" REAL,
    "nutrientP" REAL,
    "nutrientK" REAL,
    "soilEC" REAL,
    "airTemperature" REAL,
    "humidity" REAL,
    "rainfall" REAL,
    "leafWetness" REAL,
    "canopyTemperature" REAL,
    "evapotranspiration" REAL,
    "solarPAR" REAL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DaywiseData_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "Field" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DaywiseImage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "daywiseDataId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DaywiseImage_daywiseDataId_fkey" FOREIGN KEY ("daywiseDataId") REFERENCES "DaywiseData" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DaywiseResult" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fieldId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "plantStressScore" REAL,
    "diseaseRiskProbability" REAL,
    "irrigationRecommendation" TEXT,
    "nutrientRecommendation" TEXT,
    "otherRecommendations" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DaywiseResult_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "Field" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FinalResult" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fieldId" INTEGER NOT NULL,
    "cycleName" TEXT,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "averageSoilMoisture" REAL,
    "averageCanopyTemp" REAL,
    "avgPlantStressScore" REAL,
    "yieldEstimate" REAL,
    "recommendations" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FinalResult_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "Field" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Field_userId_idx" ON "Field"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Field_userId_name_key" ON "Field"("userId", "name");

-- CreateIndex
CREATE INDEX "DaywiseData_fieldId_date_idx" ON "DaywiseData"("fieldId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "DaywiseData_fieldId_date_key" ON "DaywiseData"("fieldId", "date");

-- CreateIndex
CREATE INDEX "DaywiseImage_daywiseDataId_idx" ON "DaywiseImage"("daywiseDataId");

-- CreateIndex
CREATE INDEX "DaywiseResult_fieldId_date_idx" ON "DaywiseResult"("fieldId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "DaywiseResult_fieldId_date_key" ON "DaywiseResult"("fieldId", "date");

-- CreateIndex
CREATE INDEX "FinalResult_fieldId_cycleName_idx" ON "FinalResult"("fieldId", "cycleName");
