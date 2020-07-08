import React, { useState } from "react";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
import { Button } from "@material-ui/core";
import auth from "./../auth/auth-helper";
import { create } from "./api-enrollment";

export default function Enroll(props) {
  const [values, setValues] = useState({
    enrollmentId: "",
    error: "",
    redirect: false,
  });
  const jwt = auth.isAuthenticated();

  const clickEnroll = () => {
    create({ courseId: props.courseId }, { t: jwt.token }).then(data => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, enrollmentId: data._id, redirect: true });
      }
    });
  };

  if (values.redirect) {
    return <Redirect to={"/learn/" + values.enrollmentId} />;
  }

  return (
    <Button variant="contained" color="secondary" onClick={clickEnroll}>
      Enroll
    </Button>
  );
}

Enroll.propTypes = {
  courseId: PropTypes.string.isRequired,
};
