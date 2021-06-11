import { AppBar, Button, Grid, Toolbar, Typography } from '@material-ui/core'
import { useHistory } from 'react-router'
import "../css/Shared.css";
import LogoutIcon from "@material-ui/icons/LockOutlined";
import Cookies from "universal-cookie";
import { APP_TITLE } from '../staticData/TitleData';

const cookies = new Cookies();


const TheHeader = () => {
    const history = useHistory()

    const appTitleOnClickHandler = ()=>{
        history.push("/medical_devices")
    }

    const logoutHandler = ()=>{
        cookies.remove("access_token");
        localStorage.removeItem("user");
        history.push("/login")
    }

    return (
        <>
        <div className="flex-grow">
            <AppBar position="static"> 
                <Toolbar>
                    <Grid
                        justify="space-between"
                        container 
                        >
                        <Grid item>
                            <Typography className="appbar-title" variant="h6" onClick ={appTitleOnClickHandler}>{APP_TITLE}</Typography>
                                
                        </Grid>

                        <Grid item>
                            <div>
                                <Button onClick={logoutHandler} style={{color: "white"}}><LogoutIcon/>LOGOUT</Button>
                            </div>
                        </Grid>
                    </Grid>
                </Toolbar>    
            </AppBar>
            </div>
        </>
    )
}

export default TheHeader
