import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { GridList, GridListTile, GridListTileBar } from "@material-ui/core";
import { Link } from "react-router-dom";
import auth from "./../auth/auth-helper";
import Enroll from "./../enrollment/Enroll";

export default function Courses(props) {
  return (
    <GridList cellHeight={220} cols={2}>
      {props.courses.map((course, i) => {
        return (
          <GridListTile key={i} style={{ padding: 0 }}>
            <Link to={"/course/" + course._id}>
              <img src={"/api/course/photo" + course._id} alt={course.name} />
            </Link>
            <GridListTileBar
              title={<Link to={"/course/" + course._id}>{course.name}</Link>}
              subtitle={<span>{course.category}</span>}
              actionIcon={
                auth.isAuthenticated() ? (
                  <Enroll courseId={course._id} />
                ) : (
                  <Link to="/signin">Sign in to enroll</Link>
                )
              }
            />
          </GridListTile>
        );
      })}
    </GridList>
  );
}

Courses.propTypes = {
  courses: PropTypes.array.isRequired,
};
