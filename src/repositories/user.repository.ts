import { prisma } from "../db.config.js";

interface UserCreateData {
  email: string;
  password: string;
  name?: string | null;
  gender?: string | null;
  birthday?: Date | null;
  address?: string | null;
  phone?: string | null;
  areaId?: number | null;
}

export const addUser = async (data: UserCreateData): Promise<number | null> => {
  try {
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
  } catch (err) {
    throw new Error(
      `유저 등록 중 오류 발생: ${err instanceof Error ? err.message : "Unknown error"}`
    );
  }
};

export const getUser = async (userId: number) => {
  try {
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
  } catch (err) {
    throw new Error(
      `사용자 조회 중 오류 발생: ${err instanceof Error ? err.message : "Unknown error"}`
    );
  }
};

export const setPreference = async (
  userId: number,
  foodTypeId: number
): Promise<void> => {
  try {
    await prisma.preferredFoodType.create({
      data: {
        userId,
        foodTypeId,
      },
    });
  } catch (err) {
    throw new Error(
      `선호 카테고리 매핑 중 오류 발생: ${err instanceof Error ? err.message : "Unknown error"}`
    );
  }
};

export const getUserPreferencesByUserId = async (userId: number) => {
  try {
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
  } catch (err) {
    throw new Error(
      `선호 카테고리 조회 중 오류 발생: ${err instanceof Error ? err.message : "Unknown error"}`
    );
  }
};