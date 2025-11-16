interface MissionBody {
  title?: string;
  body?: string;
}

interface MissionData {
  title?: string;
  body?: string;
}

interface MissionInfo {
  missionId: number;
  storeId: number;
  title: string;
  body: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}

interface MissionResponse {
  id: number;
  storeId: number;
  title: string;
  body: string;
  createdAt: string | null;
  updatedAt: string | null;
}

export const bodyToMission = (body: MissionBody = {}): MissionData => {
  return {
    title: body.title,
    body: body.body,
  };
}

export const bodyToAssign = (body: any) => ({
  userId: body.userId ?? 1,
  storeId: body.storeId ?? null,
});

export const bodyToStart = (body: any) => ({
  userMissionId: body.userMissionId ?? null,
  userId: body.userId ?? 1,
});

export const responseFromMission = (mission: MissionInfo | null): MissionResponse | null => {
  if (!mission) return null;

  return {
    id: mission.missionId,
    storeId: mission.storeId,
    title: mission.title,
    body: mission.body,
    createdAt: mission.createdAt ? new Date(mission.createdAt).toISOString() : null,
    updatedAt: mission.updatedAt ? new Date(mission.updatedAt).toISOString() : null,
  };
};

export const responseFromMissions = (missions: MissionInfo[] = []) => {
  const data: MissionResponse[] = missions.map((m) => ({
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