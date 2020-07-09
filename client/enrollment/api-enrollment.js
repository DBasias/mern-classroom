import { sign } from "jsonwebtoken";

const create = async (params, credentials) => {
  try {
    let response = await fetch("/api/enrollment/" + params.courseId, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
    });

    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const read = async (params, credentials, signal) => {
  try {
    let response = await fetch("/api/enrollment/" + params.enrollmentId, {
      method: "GET",
      signal: signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
    });

    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const complete = async (params, credentials, enrollment) => {
  try {
    let response = await fetch(
      "/api/enrollment/complete/" + params.enrollmentId,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + credentials.t,
        },
        body: JSON.stringify(enrollment),
      }
    );

    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

export { create, read, complete };
