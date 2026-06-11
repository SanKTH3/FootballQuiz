import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { MainPageView } from "../views/mainPageView";
import { GoogleAuth } from "./googleAuthPresenter";

const MainPage = observer(function MainPageRender(props) {
  // remembers if the user clicked start before login finished
  const [startAfterLogin, setStartAfterLogin] = useState(false);

  // when firebase finishes loading the user into the model,
  // continue starting the game automatically
  useEffect(function continueAfterLoginACB() {
    if (
      startAfterLogin &&
      props.model.user &&
      props.model.ready
    ) {
      setStartAfterLogin(false);
      goToQuizIfAllowed();
    }
  }, [
    startAfterLogin,
    props.model.user,
    props.model.ready,
  ]);

  return (
    <GoogleAuth model={props.model}>
      {renderMainPageCB}
    </GoogleAuth>
  );

  function renderMainPageCB(authProps) {
    return (
      <MainPageView
        welcome_msg={props.model.welcome_msg}
        game_name={props.model.game_name}
        onStart={startQuizACB}
        user={authProps.user}
      />
    );

    function startQuizACB() {
      if (props.model.user && props.model.ready) {
        goToQuizIfAllowed();
        return;
      }

      setStartAfterLogin(true);
      authProps.login();
    }
  }

  function goToQuizIfAllowed() {
    // const result = props.model.startGame();
    props.model.startGame()
    // if (result?.route) {
    //   window.location.hash = result.route;
    // }
  }
});

export { MainPage };