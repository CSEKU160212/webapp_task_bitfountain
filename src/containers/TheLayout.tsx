import React, { useEffect } from 'react'
import TheContent from './TheContent'
import TheHeader from './TheHeader'
import Cookies from "universal-cookie"
import { useHistory } from 'react-router'

const cookies = new Cookies();

const TheLayout = () => {
    const history = useHistory();
    useEffect(()=>{
      const access_token = cookies.get("access_token");
      const user = localStorage.getItem("user");
      if (!access_token || !user) {
        history.push("/login");
      }
    }, [history])
    
    return (
        <>
        <TheHeader />
        <TheContent />
        </>
    )
}

export default TheLayout
