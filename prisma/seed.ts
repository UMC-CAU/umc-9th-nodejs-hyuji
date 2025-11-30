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

  const users: any[] = [];
  for (let i = 1; i <= 6; i++) {
    const email = `user${i}@example.com`;

    // 여러 번 seed 돌려도 안 깨지게 upsert 사용
    const u = await prisma.user.upsert({
      where: { email }, // email은 @unique
      update: {
        name: `사용자${i}`,
        nickname: `유저${i}`,
      },
      create: {
        email,
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

  // 흑석 고기집 리뷰 12개
  for (let i = 0; i < 12; i++) {
    const user = users[i % users.length];
    const time = new Date(Date.now() - i * 60 * 60 * 1000);

    const um = await prisma.userMission.create({
      data: {
        userId: user.userId,
        missionId: targetMission.missionId,
        createdAt: time,
        updatedAt: time,
      },
    });

    await prisma.review.create({
      data: {
        userMissionId: um.userMissionId,
        body: `흑석 고기집 후기 #${i + 1} - 맛있다!`,
        // schema에서 score가 Int라 정수로 변경 (3,4,5 반복)
        score: 3 + (i % 3),
        createdAt: time,
        updatedAt: time,
      },
    });
  }

  // 흑석 분식집 리뷰 3개
  for (let i = 0; i < 3; i++) {
    const user = users[(i + 2) % users.length];
    const time = new Date(Date.now() - i * 90 * 60 * 1000);

    const um = await prisma.userMission.create({
      data: {
        userId: user.userId,
        missionId: otherMission.missionId,
        createdAt: time,
        updatedAt: time,
      },
    });

    await prisma.review.create({
      data: {
        userMissionId: um.userMissionId,
        body: `흑석 분식집 후기 #${i + 1} - 가성비 굿`,
        // 여기도 Int (3,4,3)
        score: 3 + (i % 2),
        createdAt: time,
        updatedAt: time,
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
