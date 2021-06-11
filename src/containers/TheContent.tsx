import { Suspense } from 'react'
import { Redirect, Route, Switch } from 'react-router';
import { privateRoutes } from '../routes';
import { checkUserAuthentication } from '../hoc/CheckUserAuthentication';

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



const TheContent = () => {
    const isAuthenticated = checkUserAuthentication();

    return (
        <main className="c-main">
        <Suspense fallback={loading}>
          <Switch>
            {isAuthenticated && privateRoutes.map((route: routeType)=>{
            return (route.component && <Route path={route.path} key={route.name} exact={route.exact} 
                render={(props: any) => (
                  <route.component {...props} />
                )}
            />)
          })}
            <Redirect from="/" to="/medical_devices" />
          </Switch>
        </Suspense>
    </main>
    )
}

export default TheContent
