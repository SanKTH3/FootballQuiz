
// Based on the initial mobxReactiveModel.js from TW labs (TW1)
import { observable, reaction, configure } from "mobx";
import { model } from "./GameModel";

import { connectToPersistence } from "./gamePersistence";

configure({enforceActions:"always"});
export const reactiveModel = observable(model);

connectToPersistence(reactiveModel, reaction);

