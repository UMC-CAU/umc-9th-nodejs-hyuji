import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { handleUserSignUp } from "./controllers/user.controller.js";
import {
  handleCreateMyPageReview,
  handleListStoreReviews,
  handleListMyReviews,
} from "./controllers/review.controller.js";
import {
  assignMission,
  startUserMission,
  createMissionForStore,
  handleListStoreMissions,
  handleListMyInProgressMissions,
  completeUserMission,
} from "./controllers/mission.controller.js";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/api/v1/users/signup", handleUserSignUp);
app.post("/api/v1/mypage/:userMissionId", handleCreateMyPageReview);
app.post("/api/v1/stores/:storeId/missions", createMissionForStore);
app.post("/api/v1/missions/:missionId/assign", assignMission);
app.post("/api/v1/missions/:userMissionId/start", startUserMission);
app.get("/api/v1/stores/:storeId/reviews", handleListStoreReviews);
app.get("/api/v1/users/:userId/reviews", handleListMyReviews);
app.get("/api/v1/stores/:storeId/missions", handleListStoreMissions);
app.get("/api/v1/users/:userId/missions/in-progress", handleListMyInProgressMissions);
app.post("/api/v1/missions/:userMissionId/done", completeUserMission);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});