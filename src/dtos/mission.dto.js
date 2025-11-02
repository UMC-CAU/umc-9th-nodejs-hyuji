// 미션 생성용 DTO
export const bodyToMission = (body = {}) => ({
  title: body.title ?? null,
  body: body.body ?? body.description ?? null,
});

// 미션 할당용 DTO
export const bodyToAssign = (body = {}) => ({
  userId: body.userId ?? 1,
  storeId: body.storeId ?? null,
});

// 미션 시작용 DTO
export const bodyToStart = (body = {}) => ({
  userMissionId: body.userMissionId ?? null,
  userId: body.userId ?? 1,
});

// 응답용 DTO
export const responseFromMission = (mission = {}) => {
  if (!mission) return null;

  return {
    id: mission.mission_id,
    storeId: mission.store_id,
    title: mission.title,
    body: mission.body,
    createdAt: mission.created_at
      ? new Date(mission.created_at).toISOString()
      : null,
    updatedAt: mission.updated_at
      ? new Date(mission.updated_at).toISOString()
      : null,
  };
};
