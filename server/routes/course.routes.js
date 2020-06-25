import express from "express";
import authCtrl from "../controllers/auth.controller";
import userCtrl from "../controllers/user.controller";
import courseCtrl from "../controllers/course.controller";

const router = express.Router();

router
  .route("/api/courses/by/:userId")
  .post(
    authCtrl.requireSignin,
    authCtrl.hasAuthorization,
    userCtrl.isEducator,
    courseCtrl.create
  );

router
  .route("/api/courses/photo/:courseId")
  .get(courseCtrl.photo, courseCtrl.defaultPhoto);

router.param("courseId", courseCtrl.courseByID);
router.param("userId", userCtrl.userByID);

export default router;
