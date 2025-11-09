import * as missionService from "../services/mission.service.js";
import { bodyToMission } from "../dtos/mission.dto.js"; // 추가된 import

export const createMissionForStore = async (req, res) => {
  try {
    const storeId = parseInt(req.params.storeId);
    if (!storeId) return res.status(400).json({ message: "storeId path param required." });

    const created = await missionService.createMissionForStore(storeId, bodyToMission(req.body));
    return res.status(201).json(created);
  } catch (err) {
    return res.status(400).json({ message: `가게 미션 추가 중 오류가 발생했습니다: ${err.message}` });
  }
};


export const assignMission = async (req, res) => {
  const missionId = Number(req.params.missionId);
  const userId = req.user?.id ?? req.body.userId ?? 1;
  const { storeId } = req.body;

  try {
    const result = await missionService.assignMission({ userId, missionId, storeId });
    return res.status(201).json(result);
  } catch (error) {
    console.error(error);
    const map = {
      MISSION_NOT_FOUND: [404, "존재하지 않는 미션입니다."],
      STORE_MISMATCH: [409, "이 미션은 해당 매장과 일치하지 않습니다."],
      ALREADY_ASSIGNED: [409, "이미 할당된 미션입니다."],
    };
    const [code, msg] = map[error.message] ?? [500, "미션 할당 중 오류가 발생했습니다."];
    return res.status(code).json({ message: msg });
  }
};


export const startUserMission = async (req, res) => {
  const userMissionId = Number(req.params.userMissionId);
  const userId = req.user?.id ?? req.body.userId ?? 1;

  try {
    const result = await missionService.startUserMission({ userMissionId, userId });
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    const map = {
      NOT_FOUND: [404, "존재하지 않는 유저 미션입니다."],
      ALREADY_DONE: [409, "이미 완료된 미션입니다."],
      INVALID_STATUS: [409, "시작할 수 없는 상태의 미션입니다."],
    };
    const [code, msg] = map[error.message] ?? [500, "미션 시작 중 오류가 발생했습니다."];
    return res.status(code).json({ message: msg });
  }
};
