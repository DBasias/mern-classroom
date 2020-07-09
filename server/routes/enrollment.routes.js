import express from "express";
import authCtrl from "../controllers/auth.controller";
import courseCtrl from "../controllers/course.controller";
import enrollmentCtrl from "../controllers/enrollment.controller";

const router = express.Router();

router
  .route("/api/enrollment/new/:courseId")
  .post(
    authCtrl.requireSignin,
    enrollmentCtrl.findEnrollment,
    enrollmentCtrl.create
  );

router
  .route("/api/enrollment/complete/:enrollmentId")
  .put(
    authCtrl.requireSignin,
    enrollmentCtrl.isStudent,
    enrollmentCtrl.complete
  );

router
  .route("/api/enrollment/:enrollmentId")
  .get(authCtrl.requireSignin, enrollmentCtrl.isStudent, enrollmentCtrl.read);

router.param("courseId", courseCtrl.courseByID);
router.param("enrollmentId", enrollmentCtrl.enrollmentByID);

export default router;
