// TODO make a reactive model (application state), pass it as prop to the components used
import { createRoot } from "react-dom/client";
import { reactiveModel } from "../reactiveModel";
import { ReactRoot } from "./ReactRoot";

import { app } from "../firebase";
import {getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut,} from "firebase/auth";

// import "../style.css";

// const mountedApp= createRoot(document.getElementById('root'))

// mountedApp.render(<div>hello world!</div>);    // see if comment exists
const root = createRoot(document.getElementById("root"));
root.render(<ReactRoot model={reactiveModel} />);



