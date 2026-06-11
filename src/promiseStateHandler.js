// This is the same as resolvePromise.js from TW2 that was used for promise state mechanics
// my own file
// for TW 2.2.1
import { runInAction } from "mobx";

export async function resolvePromise(prms, promiseState) {
  runInAction(function setPromiseStateACB() {
    promiseState.promise = prms;
    promiseState.data = null; // set to null in order to forget the previous promise
    promiseState.error = null;
  });

  // pr stands for promise,
  function storeDataInPrStateACB(pr_result) {
    // pr_result = promise result
    // store data in promise state
    if (promiseState.promise === prms) {
      runInAction(function storeDataACB() {
        promiseState.data = pr_result;
      });
    }
  }

  function errorTriggeredACB(pr_error) {
    // pr_error = promise error
    // store error in promise state
    if (promiseState.promise === prms) {
      runInAction(function storeErrorACB() {
        promiseState.error = pr_error;
      });
    }
  }

  // resolve promise if it is defined
  if (prms !== null && prms !== undefined) {
    prms.then(storeDataInPrStateACB).catch(errorTriggeredACB);
  }
}