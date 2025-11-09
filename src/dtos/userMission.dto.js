// 진행 중인 유저 미션 목록 응답 DTO
export const responseFromUserMissions = (rows = []) => {
  const data = rows.map((r) => ({
    id: r.userMissionId,
    status: r.status,
    mission: r.mission
      ? {
          id: r.mission.missionId,
          storeId: r.mission.storeId,
          title: r.mission.title,
          body: r.mission.body,
          store: r.mission.store
            ? {
                id: r.mission.store.storeId,
                name: r.mission.store.name,
              }
            : null,
        }
      : null,
    createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : null,
    updatedAt: r.updatedAt ? new Date(r.updatedAt).toISOString() : null,
  }));

  return {
    data,
    pagination: {
      cursor: data.length ? data[data.length - 1].id : null,
    },
  };
};
