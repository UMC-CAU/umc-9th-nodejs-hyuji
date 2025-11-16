type UserMissionStatus = "ASSIGNED" | "IN_PROGRESS" | "DONE";

interface UserMissionRow {
  userMissionId: number;
  status: UserMissionStatus;
  mission: {
    missionId: number;
    storeId: number;
    title: string;
    body: string;
    store: { 
      storeId: number; 
      name: string 
    } | null;
  } | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

interface UserMissionResponse {
  id: number;
  status: UserMissionStatus;
  mission: {
    id: number;
    storeId: number;
    title: string;
    body: string;
    store: { id: number; name: string } | null;
  } | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export const responseFromUserMissions = (
  rows: UserMissionRow[] = []
): {
  data: UserMissionResponse[];
  pagination: { cursor: number | null };
} => {
  const data: UserMissionResponse[] = rows.map((r) => ({
    id: r.userMissionId!,
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

export const responseFromUserMission = (
  r: UserMissionRow | null = null
): UserMissionResponse | null => {
  if (!r) return null;
  return {
    id: r.userMissionId!,
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
  };
};