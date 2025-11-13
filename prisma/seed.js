// prisma/seed.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // 1) 기초 데이터: 지역, 카테고리
  const area = await prisma.area.create({
    data: { name: "서울 흑석" },
  });

  const category = await prisma.storeCategory.create({
    data: { name: "한식" },
  });

  // 2) 가게 2개 (target: 리뷰 12개, other: 리뷰 3개)
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

  // 3) 유저 6명 (email unique 가정)
  const users = [];
  for (let i = 1; i <= 6; i++) {
    const u = await prisma.user.create({
      data: {
        email: `user${i}@example.com`,
        password: "hashed-password", // 실제론 해시 사용
        name: `사용자${i}`,
        nickname: `유저${i}`,
        status: "ACTIVE", // 스키마에 있으면 유지, 없으면 제거
      },
    });
    users.push(u);
  }

  // 4) 미션: 가게별 1개씩
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

  // 5) user_mission + review 생성
  // targetStore 에 리뷰 12개 이상 생성 (cursor 테스트용)
  for (let i = 0; i < 12; i++) {
    const user = users[i % users.length];
    const um = await prisma.userMission.create({
      data: {
        userId: user.userId,
        missionId: targetMission.missionId,
        // 필요 시 status 등 추가
        createdAt: new Date(Date.now() - i * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - i * 60 * 60 * 1000),
      },
    });

    await prisma.review.create({
      data: {
        userMissionId: um.userMissionId,
        body: `흑석 고기집 후기 #${i + 1} - 맛있다!`,
        score: 3 + ((i % 3) + 1) * 0.5, // 3.5, 4.0, 4.5 반복
        createdAt: new Date(Date.now() - i * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - i * 60 * 60 * 1000),
        // 스키마에 missionId/storeId 컬럼이 있다면 아래 두 줄도 같이 저장
        // missionId: targetMission.missionId,
        // storeId: targetStore.storeId,
      },
    });
  }

  // otherStore 에는 3개만
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
        score: 3 + (i % 2), // 3,4 반복
        createdAt: new Date(Date.now() - i * 90 * 60 * 1000),
        updatedAt: new Date(Date.now() - i * 90 * 60 * 1000),
        // missionId: otherMission.missionId,
        // storeId: otherStore.storeId,
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
