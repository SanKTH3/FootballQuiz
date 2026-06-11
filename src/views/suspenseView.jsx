// import "/src/style.css"
export function SuspenseView(props){
    // Stub TW 2.3.1
    // return "SuspenseView ";
    // Used to call it a callback, but it is not. It is not an argument to a function.
    return suspenseViewDisplay()

    // For TW 2.4.1
    // Suspense view will display different things depending on the conditions
    // This functions takes care of this logic
    function suspenseViewDisplay() {
        // If we have no promise, i.e. promise is undefined render "no data"
        // if(props.promise===undefined){
        //     return <span>{"no data"}</span>
        // }
        // If promise and error are both defined, render an error message
        if(props.promise && props.error){ 
            return <span>{props.error.toString()}</span>
        }
        else{
            // if promise is defined but we have no data or error yet, display gif
            return <img src = "https://brfenergi.se/iprog/loading.gif"/>
        }

    }
}