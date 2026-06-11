export function GoogleAuthView(props) {
  // this object can still be used by your app
  const authProps = {
    login: props.login,
    logout: props.logout,
    user: props.user,
  };

  return (
    <>
      {/* keep old render callback working */}
      {props.renderContent && props.renderContent(authProps)}

      {/* only show auth errors if something fails */}
      {renderError()}
    </>
  );

  // this only renders if firebase throws an error
  function renderError() {
    if (!props.error) {
      return null;
    }

    return (
      <p>
        {props.error.toString()}
      </p>
    );
  }
}