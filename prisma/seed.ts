import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const area = await prisma.area.create({
    data: { name: "서울 흑석" },
  });

  const category = await prisma.storeCategory.create({
    data: { name: "한식" },
  });

  const targetStore = await prisma.store.create({
    data: {
      name: "흑석 고기집",
      areaId: area.areaId,
      storeCategoryId: category.storeCategoryId,
    },
  });

  const otherStore = await prisma.store.create({
    data: {
      name: "흑석 분식집",
      areaId: area.areaId,
      storeCategoryId: category.storeCategoryId,
    },
  });

  const users = [];
  for (let i = 1; i <= 6; i++) {
    const u = await prisma.user.create({
      data: {
        email: `user${i}@example.com`,
        password: "hashed-password",
        name: `사용자${i}`,
        nickname: `유저${i}`,
      },
    });
    users.push(u);
  }

  const targetMission = await prisma.mission.create({
    data: {
      storeId: targetStore.storeId,
      title: "식사 인증 (기본)",
      body: "10,000원 이상 식사하기",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const otherMission = await prisma.mission.create({
    data: {
      storeId: otherStore.storeId,
      title: "음료 인증",
      body: "음료 1잔 주문하기",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  for (let i = 0; i < 12; i++) {
    const user = users[i % users.length];
    const um = await prisma.userMission.create({
      data: {
        userId: user.userId,
        missionId: targetMission.missionId,
        createdAt: new Date(Date.now() - i * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - i * 60 * 60 * 1000),
      },
    });

    await prisma.review.create({
      data: {
        userMissionId: um.userMissionId,
        body: `흑석 고기집 후기 #${i + 1} - 맛있다!`,
        score: 3 + ((i % 3) + 1) * 0.5,
        createdAt: new Date(Date.now() - i * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - i * 60 * 60 * 1000),
      },
    });
  }

  for (let i = 0; i < 3; i++) {
    const user = users[(i + 2) % users.length];
    const um = await prisma.userMission.create({
      data: {
        userId: user.userId,
        missionId: otherMission.missionId,
        createdAt: new Date(Date.now() - i * 90 * 60 * 1000),
        updatedAt: new Date(Date.now() - i * 90 * 60 * 1000),
      },
    });

    await prisma.review.create({
      data: {
        userMissionId: um.userMissionId,
        body: `흑석 분식집 후기 #${i + 1} - 가성비 굿`,
        score: 3 + (i % 2),
        createdAt: new Date(Date.now() - i * 90 * 60 * 1000),
        updatedAt: new Date(Date.now() - i * 90 * 60 * 1000),
      },
    });
  }

  console.log("✅ Seed done: targetStore has 12+ reviews.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });