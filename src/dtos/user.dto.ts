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

export interface UserCreateData {
  email: string;
  password: string;
  name?: string | null;
  gender?: string | null;
  birthday?: Date | null;
  address?: string | null;
  phone?: string | null;
  areaId?: number | null;
  preferences: number[];  
}

export interface UserUpdateData {
  name?: string | null;
  gender?: string | null;
  birthday?: Date | null;
  address?: string | null;
  phone?: string | null;
  areaId?: number | null;
  preferences?: number[];
}

export const bodyToUserUpdate = (body: Partial<UserBody>): UserUpdateData => {
  let birthday: Date | null = null;

  if (body.birthday) {
    const parsed = new Date(body.birthday);
    if (!Number.isNaN(parsed.getTime())) {
      birthday = parsed;
    }
  }

  return {
    name: body.name ?? null,
    gender: body.gender ?? null,
    birthday,
    address: body.address ?? null,
    phone: body.phone ?? null,
    areaId: body.areaId ?? null,
    preferences: body.preferences,
  };
};


interface UserResponse {
  email: string | null;
  name: string | null;
  preferCategory: string[];
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

export const bodyToUser = (body: UserBody): UserCreateData => {
  const birthday = 
  body.birthday && body.birthday.trim().length > 0
  ? new Date(body.birthday)
  : null;

  return {
    email: body.email,
    password: body.password,
    name: body.name ?? null,
    gender: body.gender ?? null,
    birthday,
    address: body.address ?? null,
    phone: body.phone ?? null,
    areaId: body.areaId ?? null,
    preferences: body.preferences ?? [],
  };
};

export const responseFromUser = ({
  user,
  preferences,
}: {
  user?: UserInfo | null;
  preferences?: PreferenceInfo[];
}): UserResponse => {
  const preferFoods: string[] = Array.isArray(preferences)
    ? preferences
        .map((p) => p?.foodType?.name ?? p?.foodTypeName ?? null)
        .filter((v): v is string => Boolean(v))
    : [];

  return {
    email: user?.email ?? null,
    name: user?.name ?? null,
    preferCategory: preferFoods,
  };
};