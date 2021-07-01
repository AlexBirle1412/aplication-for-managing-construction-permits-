import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ProjectContent from "./components/projects/ProjectContent";
import ProjectList from "./components/projects/ProjectList";
import CreateOrEditProject from "./components/projects/CreateOrEditProject";
import Login from "./components/users/Login";
import ForgotPassword from "./components/users/FogotPassword";
import ResetPassword from "./components/users/ResetPassword";
import SignUp from "./components/users/SignUp";
import Diagram from "./components/statistics/Diagram";
import ActivateAcount from "./components/users/ActivateAcount";
import ManageUsers from "./components/users/ManageUsers";
import Upload from "./components/forUpload/Upload";
import Preview from "./components/projects/Preview";

import axiosInterceptor from "./controls/AxiosInterceptor.js";

export default function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/sign-up" exact component={SignUp} />
          <Route path="/forgot-password" exact component={ForgotPassword} />
          <Route path="/reset-password/:id" exact component={ResetPassword} />
          <Route path="/projects" exact component={ProjectList} />
          <Route path="/projects/view/:id" exact component={ProjectContent} />
          <Route
            path="/projects/create"
            exact
            render={(props) => (
              <CreateOrEditProject {...props} forEdit={false} />
            )}
          />
          <Route
            path="/projects/edit/:id"
            exact
            render={(props) => (
              <CreateOrEditProject {...props} forEdit={true} />
            )}
          />
          <Route path="/statistics" exact component={Diagram}></Route>
          <Route
            path="/activate-account/:token"
            exact
            component={ActivateAcount}
          ></Route>
          <Route path="/manage-users" exact component={ManageUsers}></Route>
          <Route
            path="/projects/view/:projectId/uploads/:activityId"
            exact
            render={(props) => (
              <Upload
                {...props}
                projectInfo={{
                  projectId: props.location.projectId,
                  activityId: props.location.activityId,
                }}
              />
            )}
          ></Route>

          <Route
            path="/preview/:projectId"
            exact
            render={(props) => <Preview {...props} />}
          ></Route>
        </Switch>
      </Router>
    </>
  );
}
