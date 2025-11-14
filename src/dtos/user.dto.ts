interface UserBody {
  email: string;
  password: string;
  name?: string;
  gender?: string;
  birthday?: string;
  address?: string;
  phone?: string;
  areaId?: number | null;
  preferences?: number[];
}

interface UserData {
  email: string;
  password: string;
  name?: string;
  gender?: string;
  birthday?: Date;
  address?: string;
  phone?: string;
  areaId?: number | null;
  preferences: number[];
}

interface UserResponse {
  email?: string | null;
  name?: string | null;
  preferCategory: (string | null)[];
}

interface UserInfo {
  userId?: number;
  email?: string | null;
  name?: string | null;
  gender?: string | null;
  birthday?: Date | null;
  address?: string | null;
  status?: string;
  inactiveDate?: Date | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  phone?: string | null;
  provider?: string | null;
  areaId?: number | null;
  phoneVerified?: string;
}

interface PreferenceInfo {
  id?: number;
  userId?: number;
  foodTypeId?: number;
  foodTypeName?: string | null;
  foodType?: { name?: string | null };
}

export const bodyToUser = (body: UserBody): UserData => {
  const birthday = body.birthday ? new Date(body.birthday) : undefined;

  return {
    email: body.email,
    password: body.password,
    name: body.name,
    gender: body.gender,
    birthday,
    address: body.address || "",
    phone: body.phone,
    areaId: body.areaId || null,
    preferences: body.preferences || [],
  };
};

export const responseFromUser = ({
  user,
  preferences,
}: {
  user?: UserInfo;
  preferences?: PreferenceInfo[];
}): UserResponse => {
  const preferFoods = Array.isArray(preferences)
    ? preferences
        .map(
          (p) => p?.foodType?.name ?? p?.foodTypeName ?? null
        )
        .filter(Boolean)
    : [];

  return {
    email: user?.email ?? null,
    name: user?.name ?? null,
    preferCategory: preferFoods,
  };
};