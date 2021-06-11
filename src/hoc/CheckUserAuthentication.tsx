import Cookies from "universal-cookie"

export const checkUserAuthentication= ()=>{
    const cookies = new Cookies();
    const localStorageUser =  localStorage.getItem("user");
    let authUser:any;

    if(localStorageUser){
        authUser = JSON.parse(localStorageUser);
    }
    const access_token = cookies.get("access_token");
    
    if(authUser && access_token){
        return true;
    }
    return false;
}