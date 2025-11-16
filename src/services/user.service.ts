import bcrypt from "bcrypt";
import { responseFromUser } from "../dtos/user.dto.js";
import { DuplicateUserEmailError } from "../errors.js";
import {
  addUser,
  getUser,
  getUserPreferencesByUserId,
  setPreference,
} from "../repositories/user.repository.js";

export const userSignUp = async (data: UserCreateData) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const { preferences, ...userData } = data;
  const joinUserId = await addUser({
    ...userData,
    password: hashedPassword,
  });

  if (joinUserId === null) {
    throw new DuplicateUserEmailError("이미 존재하는 이메일입니다.", data);
  }

  for (const preference of preferences) {
    await setPreference(joinUserId, preference);
  }

  const user = await getUser(joinUserId);
  const userPreferences = await getUserPreferencesByUserId(joinUserId);

  return responseFromUser({ user, preferences: userPreferences });
};