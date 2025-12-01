import { prisma } from "../db.config.js";

type UserCreateDbData = Omit<UserCreateData, "preferences">;

export const addUser = async (
  data: UserCreateDbData
): Promise<number | null> => {
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
      select: { userId: true },
    });
    if (existing) return null;

    const created = await prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        name: data.name ?? null,
        gender: data.gender ?? null,
        birthday: data.birthday ?? null,
        address: data.address ?? null,
        phone: data.phone ?? null,
        areaId: data.areaId ?? null,
      },
      select: { userId: true },
    });
    return created.userId;
};

export const getUser = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { userId },
    select: {
      userId: true,
      email: true,
      name: true,
      gender: true,
      birthday: true,
      address: true,
      status: true,
      inactiveDate: true,
      createdAt: true,
      updatedAt: true,
      phone: true,
      provider: true,
      areaId: true,
      phoneVerified: true,
    },
  });
  return user ?? null;
};

export const setPreference = async (
  userId: number,
  foodTypeId: number
): Promise<void> => {
  await prisma.preferredFoodType.create({
    data: {
      userId,
      foodTypeId,
    },
  });
};

export const getUserPreferencesByUserId = async (userId: number) => {
  const rows = await prisma.preferredFoodType.findMany({
    where: { userId },
    include: {
      foodType: { select: { name: true } },
    },
    orderBy: { foodTypeId: "asc" },
  });

  return rows.map((r) => ({
    id: r.preferredFoodTypeId,
    userId: r.userId,
    foodTypeId: r.foodTypeId,
    foodTypeName: r.foodType?.name ?? null,
  }));
};

type UserUpdateDbData = {
  name?: string | null;
  gender?: string | null;
  birthday?: Date | null;
  address?: string | null;
  phone?: string | null;
  areaId?: number | null;
};

export const updateUserProfile = async (
  userId: number,
  data: UserUpdateDbData
): Promise<void> => {
  await prisma.user.update({
    where: { userId },
    data,
  });
};

export const replaceUserPreferences = async (
  userId: number,
  foodTypeIds: number[]
): Promise<void> => {
  // 기존 선호 카테고리 전부 삭제
  await prisma.preferredFoodType.deleteMany({
    where: { userId },
  });

  if (!foodTypeIds.length) return;

  await prisma.preferredFoodType.createMany({
    data: foodTypeIds.map((foodTypeId) => ({
      userId,
      foodTypeId,
    })),
  });
};
