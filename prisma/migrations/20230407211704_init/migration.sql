-- CreateTable
CREATE TABLE "Star" (
    "id" TEXT NOT NULL,
    "ra" DOUBLE PRECISION NOT NULL,
    "dec" DOUBLE PRECISION NOT NULL,
    "name" TEXT,
    "HD" INTEGER NOT NULL,
    "Vmag" DOUBLE PRECISION NOT NULL,
    "bv" DOUBLE PRECISION,
    "hex" TEXT,

    CONSTRAINT "Star_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Constellation" (
    "id" TEXT NOT NULL,
    "ra" DOUBLE PRECISION NOT NULL,
    "dec" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Constellation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Line" (
    "id" TEXT NOT NULL,
    "edge1" INTEGER NOT NULL,
    "edge2" INTEGER NOT NULL,
    "constellationId" TEXT,

    CONSTRAINT "Line_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Line" ADD CONSTRAINT "Line_constellationId_fkey" FOREIGN KEY ("constellationId") REFERENCES "Constellation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
