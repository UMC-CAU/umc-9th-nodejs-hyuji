import express from 'express'         
import dotenv from 'dotenv'
import cors from 'cors'
import { handleUserSignUp } from "./controllers/user.controller.js";
import { handleCreateMyPageReview, handleListStoreReviews, handleListMyReviews } from "./controllers/review.controller.js";
import { assignMission, startUserMission, createMissionForStore, handleListStoreMissions, handleListMyInProgressMissions, completeUserMission } from "./controllers/mission.controller.js";

dotenv.config()

const app = express()
const port = process.env.PORT || 3000;

app.use(cors());  //cors 방식 허용
app.use(express.static('public'));  //정적 파일 접근
app.use(express.json());  //request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false }));  //단순 객체 문자열 형태로 본문 데이터 해석

app.get("/", (req, res) => {
  res.send('Hello World!');
})

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
  console.log(`Example app listening on port ${port}`)
})

