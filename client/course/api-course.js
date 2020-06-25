const create = async (params, credentials, course) => {
  try {
    let response = await fetch("/api/courses/by/" + params.userId, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + credentials.t,
      },
      body: course,
    });

    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

export { create };
