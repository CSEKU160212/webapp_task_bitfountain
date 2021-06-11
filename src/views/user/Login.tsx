import React, { useEffect, useState } from 'react'
import "../../css/Shared.css"
import "../../App.css"
import "../../css/login/Index.css"
import {
    validateLoginEmail, 
    validateLoginPassword 
} from '../../hoc/formValidation/LoginFormValidation';
import { Button, CircularProgress, TextField } from '@material-ui/core'
import { USER_LOGIN_URL } from '../../apiEndpoints/Index'
import axios from "axios";
import { useHistory } from 'react-router'
import Cookies from "universal-cookie"
import { checkUserAuthentication } from '../../hoc/CheckUserAuthentication'
import { LOGIN_TITLE } from '../../staticData/TitleData'
import setTitle from '../../hoc/SetTitle'


interface User{
    email: string,
    password: string
} 

interface ValidationResultType{
    error: boolean,
    message: string
}

const cookies = new Cookies();

const Login = () => {
    
    const [user, setUser] = useState<User>({email:"", password:""});
    const [errors, setErrors] = useState<User>({email:"", password: ""});
    const [loading, setLoading] = useState(false);
    const [errorLogin, setErrorLogin] = useState("");
    const history = useHistory();

    const inputFieldOnChangeHandler = (e: any)=>{
        const value: string = e.target.value;
        const fieldName: string = e.target.name;
        setUser({...user, [fieldName]:value});
        setErrors({...errors, [fieldName]: ""});
        setErrorLogin("");
    }

    const submitForm = async(data: User)=>{
        try{
            setLoading(true);
            const loginResponse = await axios.post(USER_LOGIN_URL, data);
            if (loginResponse.status === 200) {
                let dateTimeToResetCookie = new Date();

                dateTimeToResetCookie.setTime(
                    dateTimeToResetCookie.getTime() + parseInt(loginResponse.data.expires_in) * 3600 * 1000
                );

                cookies.set("access_token", loginResponse.data.access_token, {
                    path: "/",
                    expires: dateTimeToResetCookie,
                });

                localStorage.setItem("user", JSON.stringify(loginResponse.data.user));
                history.push("/");
            } else {
                setLoading(false);
                setErrorLogin("Incorrect Email or Password");
            }
        }catch({response}){
            setLoading(false);
            setErrorLogin(response?.data.message)
        }
    }
    

    const loginSubmit = (e:any)=>{
        e.preventDefault();
        setErrorLogin("");
        const emailValidationRes: ValidationResultType = validateLoginEmail(user.email); 
        const passwordValidationRes: ValidationResultType = validateLoginPassword(user.password); 
        let validationError: true|false = false;
        if(emailValidationRes.error || passwordValidationRes.error){
            validationError = true;
            setErrors(
                {   ...errors, 
                    email: emailValidationRes.message,
                    password: passwordValidationRes.message
                })
        }
        
        if(validationError){
            return;
        }
        else{
            submitForm(user);
        }
    }

    useEffect(()=>{
        if(checkUserAuthentication()){
            history.push("/");
        }
        setTitle(LOGIN_TITLE)
    }, [history])

    return (
        <div className="App">
            <div className="App-header">
                <div className="login-box">
                    {
                        loading?<CircularProgress  size={30}/>:null
                    }
                    <div className="error-text">
                        <div>{errorLogin}</div>
                        <div>{errors.email}</div>
                        <div>{errors.password}</div>
                    </div>
                    <form noValidate autoComplete="off" action="">
                        <div className="input-text-field-margin">
                            <TextField
                                autoFocus
                                id="email"
                                name="email"
                                label="Email"
                                type="email"
                                placeholder="Enter Email"
                                multiline={false}
                                variant="outlined"
                                required
                                className="input-text-field "
                                autoComplete="email"
                                value={user.email}
                                onChange={(e) => inputFieldOnChangeHandler(e)}
                            />
                        </div>
                        <div className="input-text-field-margin">
                            <TextField
                                id="password"
                                label="Password"
                                type="password"
                                name="password"
                                required
                                placeholder="Enter Password"
                                multiline={false}
                                variant="outlined"
                                className="input-text-field"
                                autoComplete="password"
                                value={user.password}
                                onChange={(e) => inputFieldOnChangeHandler(e)}
                            />
                        </div>
                        <div className="input-text-field-margin">
                            <Button
                                variant="contained"
                                color="primary"
                                className="submit-button"
                                type="submit"
                                onClick={(e:any)=>loginSubmit(e)}
                            >
                                <b>Login</b>
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login
