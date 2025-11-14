import bcrypt from "bcrypt";
import { responseFromUser } from "../dtos/user.dto.js";
import { DuplicateUserEmailError } from "../errors.js";
import {
  addUser,
  getUser,
  getUserPreferencesByUserId,
  setPreference,
} from "../repositories/user.repository.js";

interface SignUpData {
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

export const userSignUp = async (data: SignUpData) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const joinUserId = await addUser({
    email: data.email,
    password: hashedPassword,
    name: data.name,
    gender: data.gender,
    birthday: data.birthday,
    address: data.address,
    phone: data.phone,
    areaId: data.areaId,
  });

  if (joinUserId === null) {
    throw new DuplicateUserEmailError("이미 존재하는 이메일입니다.", data);
  }

  for (const preference of data.preferences) {
    await setPreference(joinUserId, preference);
  }

  const user = await getUser(joinUserId);
  const preferences = await getUserPreferencesByUserId(joinUserId);

  return responseFromUser({ user, preferences });
};