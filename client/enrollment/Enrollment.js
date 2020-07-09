import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Drawer,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  ListSubheader,
  ListItemAvatar,
  Avatar,
  ListItemSecondaryAction,
  Typography,
  Card,
  CardHeader,
  CardContent,
  Button,
} from "@material-ui/core";
import {
  Info,
  CheckCircle,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
} from "@material-ui/icons";
import auth from "./../auth/auth-helper";
import { read, complete } from "./api-enrollment";

const useStyles = makeStyles(theme => ({
  root: theme.mixins.gutters({
    maxWidth: 800,
    margin: "auto",
    marginTop: theme.spacing(12),
    marginLeft: 250,
  }),
  heading: {
    marginBottom: theme.spacing(3),
    fontWeight: 200,
  },
  flex: {
    display: "flex",
    marginBottom: 20,
  },
  card: {
    padding: "24px 40px 20px",
  },
  subheading: {
    margin: "10px",
    color: theme.palette.openTitle,
  },
  details: {
    margin: "16px",
  },
  sub: {
    display: "block",
    margin: "3px 0px 5px 0px",
    fontSize: "0.9em",
  },
  avatar: {
    color: "#9b9b9b",
    border: "1px solid #bdbdbd",
    background: "none",
  },
  media: {
    height: 180,
    display: "inline-block",
    width: "100%",
    marginLeft: "16px",
  },
  icon: {
    verticalAlign: "sub",
  },
  category: {
    color: "#5c5c5c",
    fontSize: "0.9em",
    padding: "3px 5px",
    backgroundColor: "#dbdbdb",
    borderRadius: "0.2em",
    marginTop: 5,
  },
  action: {
    margin: "8px 24px",
    display: "inline-block",
  },
  drawer: {
    width: 240,
    flexShrink: 0,
  },
  drawerPaper: {
    width: 240,
    backgroundColor: "#616161",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  toolbar: theme.mixins.toolbar,
  selectedDrawer: {
    backgroundColor: "#e9e3df",
  },
  unselected: {
    backgroundColor: "#ffffff",
  },
  check: {
    color: "#38cc38",
  },
  subhead: {
    fontSize: "1.2em",
  },
  progress: {
    textAlign: "center",
    color: "#dfdfdf",
    "& span": {
      color: "#fffde7",
      fontSize: "1.15em",
    },
  },
  para: {
    whiteSpace: "pre-wrap",
  },
}));

export default function Enrollment({ match }) {
  const classes = useStyles();
  const [enrollment, setEnrollment] = useState({
    course: { instructor: [] },
    lessonStatus: [],
  });
  const [values, setValues] = useState({
    redirect: false,
    error: "",
    drawer: -1,
  });
  const [totalComplete, setTotalComplete] = useState(0);
  const jwt = auth.isAuthenticated();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    read(
      { enrollmentId: match.params.enrollmentId },
      { t: jwt.token },
      signal
    ).then(data => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setEnrollment({ data });
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, [match.params.enrollmentId]);

  const selectDrawer = index => event => {
    setValues({ ...values, drawer: index });
  };

  const totalCompleted = lessons => {
    let count = lessons.reduce((total, lessonStatus) => {
      return total + (lessonStatus.complete ? 1 : 0);
    }, 0);

    setTotalComplete(count);

    return count;
  };

  const markComplete = () => {
    if (!enrollment.lessonStatus[values.drawer].complete) {
      const lessonStatus = enrollment.lessonStatus;
      lessonStatus[values.drawer].complete = true;
      let count = totalCompleted(lessonStatus);
      let updatedData = {};

      updatedData.lessonStatusId = lessonStatus[values.drawer]._id;
      updatedData.complete = true;

      if (count == lessonStatus.length) {
        updatedData.courseCompleted = Date.now();
      }

      complete(
        { enrollmentId: match.params.enrollmentId },
        { t: jwt.token },
        updatedData
      ).then(data => {
        if (data && data.error) {
          setValues({ ...values, error: data.error });
        } else {
          setEnrollment({ ...enrollment, lessonStatus: lessonStatus });
        }
      });
    }
  };

  return (
    <div className={classes.root}>
      <Drawer
        variant="permanent"
        className={classes.drawer}
        classes={{ paper: classes.drawerPaper }}
      >
        <div className={classes.toolbar} />
        <List>
          <ListItem
            button
            onClick={selectDrawer(-1)}
            className={
              values.drawer == -1 ? classes.selectedDrawer : classes.unselected
            }
          >
            <ListItemIcon>
              <Info />
            </ListItemIcon>
            <ListItemText primary={"Course Overview"} />
          </ListItem>
        </List>
        <Divider />
        <List className={classes.unselected}>
          <ListSubheader component="div" className={classes.subhead}>
            Lessons
          </ListSubheader>
          {enrollment.lessonStatus.map((lesson, index) => (
            <ListItem
              button
              key={index}
              onClick={selectDrawer(index)}
              className={
                values.drawer == index
                  ? classes.selectedDrawer
                  : classes.unselected
              }
            >
              <ListItemAvatar>
                <Avatar className={classes.avatar}>{index + 1}</Avatar>
              </ListItemAvatar>
              <ListItemText primary={enrollment.course.lessons[index].title} />
              <ListItemSecondaryAction>
                {lesson.complete ? (
                  <CheckCircle className={classes.check} />
                ) : (
                  <RadioButtonUncheckedIcon />
                )}
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
        <Divider />
      </Drawer>
      {values.drawer != -1 && (
        <>
          <Typography variant="h5" className={classes.heading}>
            {enrollment.course.name}
          </Typography>
          <Card className={classes.card}>
            <CardHeader
              title={enrollment.course.lessons[values.drawer].title}
              action={
                <Button
                  onClick={markComplete}
                  variant={
                    enrollment.lessonStatus[values.drawer].complete
                      ? "contained"
                      : "outlined"
                  }
                  color="secondary"
                >
                  {enrollment.lessonStatus[values.drawer].complete
                    ? "Completed"
                    : "Mark as complete"}
                </Button>
              }
            />
            <CardContent>
              <Typography variant="body1">
                {enrollment.course.lessons[values.drawer].content}
              </Typography>
            </CardContent>
            <CardActions>
              <a href={enrollment.course.lessons[values.drawer].resource_url}>
                <Button variant="contained" color="primary">
                  Resource Link
                </Button>
              </a>
            </CardActions>
          </Card>
        </>
      )}
    </div>
  );
}
