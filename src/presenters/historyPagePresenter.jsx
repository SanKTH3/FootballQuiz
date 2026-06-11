import { observer } from "mobx-react-lite";
import { HistoryPageView } from "../views/historyPageView";

const HistoryPage = observer(function HistoryPageRender(props){

    return <HistoryPageView
        gameHistory={props.model.gameHistory}

    />;
});

export { HistoryPage };