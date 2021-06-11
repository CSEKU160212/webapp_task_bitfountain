import { CircularProgress } from "@material-ui/core";
import "../../css/loader/Index.css";
import "../../App.css"
interface propType{
  data: string
}

const LoadingComponent =(props: propType)=> {
    return (
      <div className="App-header">
        <h3>
          <CircularProgress
            size={40}
          />
        </h3>
        <div className="loading-text">
          {`Loading ${props.data} Information, Please Wait....`}
        </div>
      </div>
    );
}

export default LoadingComponent;
