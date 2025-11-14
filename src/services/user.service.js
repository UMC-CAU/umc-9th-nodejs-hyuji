// import bcrypt from "bcrypt";
// import { responseFromUser } from "../dtos/user.dto.js";
// import {
//   addUser,
//   getUser,
//   getUserPreferencesByUserId,
//   setPreference,
// } from "../repositories/user.repository.js";

// export const userSignUp = async (data) => {
//   // 비밀번호 해싱
//   const hashedPassword = await bcrypt.hash(data.password, 10);

//   // 유저 정보 저장
//   const joinUserId = await addUser({
//     email: data.email,
//     password: hashedPassword,
//     name: data.name,
//     gender: data.gender,
//     birthday: data.birthday,
//     address: data.address,
//     phone: data.phone,
//     areaId: data.areaId,
//   });

//   if (joinUserId === null) {
//     throw new Error("이미 존재하는 이메일입니다.");
//   }

//   // 선호 카테고리 매핑
//   for (const preference of data.preferences) {
//     await setPreference(joinUserId, preference);
//   }

//   const user = await getUser(joinUserId);
//   const preferences = await getUserPreferencesByUserId(joinUserId);

//   return responseFromUser({ user, preferences });
// };
