import { observer } from "mobx-react-lite";
import { MainPage } from "./mainPagePresenter";
import { ScorePage } from "./scorePagePresenter";
import { QuizPage } from "./quizPagePresenter";
import { GoogleAuth } from "./googleAuthPresenter";
import { HistoryPage } from "./historyPagePresenter";

import { Navbar } from "./quizPagePresenter";
import {  createHashRouter,  RouterProvider, useParams} from "react-router-dom";
import { SuspenseView } from "../views/suspenseView";

const ReactRoot = observer(function ReactRoot(props){
 
    function renderAppCB(authProps){
        return renderApp(authProps)
    }
      return <GoogleAuth model={props.model}>
        {renderAppCB}
    </GoogleAuth>;
        //  return renderApp()

function renderApp(authProps){
    function checkAccess(path, model, login){

    if(props.model.user == undefined || path == "/"){
        return <MainPage model={model}
                         login={authProps.login}
                        /> 
       
    } else if(path == "/quiz"){

            return <div>
                    <Navbar model = {model} logout={authProps.logout} user={props.model.user}/>
                    <QuizPage model={model}/>
                </div>
        }
        
    else if(path == "/scores"){

            return <div>
                    <Navbar model = {model} logout={authProps.logout} user={props.model.user}/>
                    <ScorePage model={model}/>
                </div>
    }else if(path == "/history"){
       
            return <div>
                    <Navbar model = {model} logout={authProps.logout} user={props.model.user}/>
                    <HistoryPage model={model}/>
                </div>
            
    }else if(path != "/"  && path != "/quiz" && path != "/scores" && path != "/history"){
        return <MainPage model={model}
                        login={authProps.login}
                    />      
    }

    

}
    // function renderApp(){                      
        function makeRouter(model){
            // console.log("extra")
        
      
            return createHashRouter([
                {
                 path: "/",
                 element: checkAccess("/", model, authProps.login) 
                //  <MainPage model={model}
                //           login={authProps.login}
                //           />,
                },
                {
                 path: "/quiz",

                 element: checkAccess("/quiz", model, authProps.login) 
                //  <div>
                //     <Navbar model = {model}/>
                //     <QuizPage model={model}/>
                //     </div>,
                },
                {
                 path: "/scores",
                 element: checkAccess("/scores", model, authProps.login) 
                //  <div>
                //  <Navbar model = {model}/>
                //  <ScorePage model = {model}/>
                //  </div>   
                }, {
                 path: "/history",
                 element: checkAccess("/history", model, authProps.login)
                //  <div>
                //  <Navbar model = {model}/>
                //  <HistoryPage model = {model}/>
                //  </div>   

                },  {
                 path: "*",
                 element:    <MainPage model={model}
                            login={authProps.login}
                            />,
                //  <div>
                //  <Navbar model = {model}/>
                //  <HistoryPage model = {model}/>
                //  </div>   

                },
            ])
      }
    //When logged in, they gain access to the main page
    if(props.model.ready){
        // only for debugging
        // if(props.model.user == undefined){
        // console.log(props.model.user + " " + "123")
        // }else{
        //    console.log(props.model.user + " is logged in") 
        // }
        return <div>
            <div><RouterProvider router={makeRouter(props.model)}/></div>
            {/* <MainPage model={props.model} /> */}
        </div>
   }else{
    
    //Wait until auth and persistence are initialized
    if(props.model.user === undefined || props.model.ready === false){
        return <div><SuspenseView promise={"dummy promise"} /></div>
    }
   } 

}




   return null;
}




);




export { ReactRoot };