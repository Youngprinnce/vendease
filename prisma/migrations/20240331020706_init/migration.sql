-- CreateEnum
CREATE TYPE "CharacterStatus" AS ENUM ('ACTIVE', 'DEAD', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateTable
CREATE TABLE "Character" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "status" "CharacterStatus" NOT NULL,
    "state_of_origin" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "locationId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Episode" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "release_date" TIMESTAMP(3) NOT NULL,
    "episode_code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Episode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "comment" VARCHAR(250) NOT NULL,
    "ip_address_location" TEXT NOT NULL,
    "episodeId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CharacterEpisodes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Character_locationId_key" ON "Character"("locationId");

-- CreateIndex
CREATE UNIQUE INDEX "Character_first_name_last_name_state_of_origin_key" ON "Character"("first_name", "last_name", "state_of_origin");

-- CreateIndex
CREATE UNIQUE INDEX "Episode_episode_code_key" ON "Episode"("episode_code");

-- CreateIndex
CREATE UNIQUE INDEX "_CharacterEpisodes_AB_unique" ON "_CharacterEpisodes"("A", "B");

-- CreateIndex
CREATE INDEX "_CharacterEpisodes_B_index" ON "_CharacterEpisodes"("B");

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "Episode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CharacterEpisodes" ADD CONSTRAINT "_CharacterEpisodes_A_fkey" FOREIGN KEY ("A") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CharacterEpisodes" ADD CONSTRAINT "_CharacterEpisodes_B_fkey" FOREIGN KEY ("B") REFERENCES "Episode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
