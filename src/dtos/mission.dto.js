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
    id: mission.missionId,
    storeId: mission.storeId,
    title: mission.title,
    body: mission.body,
    createdAt: mission.createdAt
      ? new Date(mission.createdAt).toISOString()
      : null,
    updatedAt: mission.updatedAt
      ? new Date(mission.updatedAt).toISOString()
      : null,
  };
};

export const responseFromMissions = (missions = []) => {
  const data = missions.map((m) => ({
    id: m.missionId,
    storeId: m.storeId,
    title: m.title,
    body: m.body,
    createdAt: m.createdAt ? new Date(m.createdAt).toISOString() : null,
    updatedAt: m.updatedAt ? new Date(m.updatedAt).toISOString() : null,
  }));

  return {
    data,
    pagination: {
      cursor: data.length ? data[data.length - 1].id : null,
    },
  };
};