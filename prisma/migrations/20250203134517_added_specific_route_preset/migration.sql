-- CreateTable
CREATE TABLE "RoutePreset" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "routes" TEXT[],
    "name" TEXT NOT NULL,

    CONSTRAINT "RoutePreset_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RoutePreset" ADD CONSTRAINT "RoutePreset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
