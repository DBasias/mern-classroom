import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardHeader,
  CardMedia,
  Typography,
  IconButton,
} from "@material-ui/core";
import { Edit } from "@material-ui/icons";
import { read } from "./api-course";
import auth from "./../auth/auth-helper";

export default function Course({ match }) {
  const [course, setCourse] = useState({ instructor: {} });
  const [values, setValues] = useState({
    error: "",
  });

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    read({ courseId: match.params.courseId }, signal).then(data => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setCourse(data);
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, [match.params.courseId]);

  const imageUrl = course._id
    ? `/api/courses/photo/${course._id}?${new Date().getTime()}`
    : "/api/courses/defaultPhoto";

  return (
    <div>
      <Card>
        <CardHeader
          title={course.name}
          subheader={
            <div>
              <Link to={"/user/" + course.instructor._id}>
                By {course.instructor.name}
              </Link>
              <span>{course.category}</span>
            </div>
          }
          action={
            <>
              {auth.isAuthenticated().user &&
                auth.isAuthenticated.user._id === course.instructor._id && (
                  <span>
                    <Link to={"/teach/course/edit/" + course._id}>
                      <IconButton aria-label="Edit" color="secondary">
                        <Edit />
                      </IconButton>
                    </Link>
                  </span>
                )}
            </>
          }
        />
        <CardMedia image={imageUrl} title={course.name} />
        <div>
          <Typography variant="body1">{course.description}</Typography>
        </div>
      </Card>
    </div>
  );
}
