import './App.css';
import React from "react"
import { BrowserRouter, Route, Switch } from "react-router-dom";
import {publicRoutes} from "./routes"
const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);
interface routeType {
  path: string,
  name: string,
  component: any
  exact: boolean
}


function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <React.Suspense fallback={loading}>
          <Switch>
            {
              publicRoutes.map((route: routeType)=>{
                return (route.component && <Route path={route.path} key={route.name} exact={route.exact} 
                    render={(props: any) => (
                      <route.component {...props} />
                    )}
                />)
              })
            }
          </Switch>
        </React.Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App;
