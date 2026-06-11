import { useState } from "react";
import { observer } from "mobx-react-lite";
import { GoogleAuthView } from "../views/googleAuthView";
import { loginWithGoogle, logoutUser } from "../authSource";

const GoogleAuth = observer(function GoogleAuthRender(props) {
  const [authError, setAuthError] = useState(null);

  // this starts google login through authSource
  // presenter no longer talks directly to Firebase Auth
  function loginACB() {
    setAuthError(null);

    return loginWithGoogle()
      .then(function loginSuccessACB() {
        setAuthError(null);
      })
      .catch(function loginErrorACB(error) {
        setAuthError(error);
        console.error(error);
      });
  }

  // this logs out current user through authSource
  function logoutACB() {
    setAuthError(null);

    return logoutUser()
      .then(function logoutSuccessACB() {
        setAuthError(null);
      })
      .catch(function logoutErrorACB(error) {
        setAuthError(error);
        console.error(error);
      });
  }

  return (
    <GoogleAuthView
      user={props.model.user}
      error={authError}
      login={loginACB}
      logout={logoutACB}
      renderContent={props.children}
    />
  );
});

export { GoogleAuth };