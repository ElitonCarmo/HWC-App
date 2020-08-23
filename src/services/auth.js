import { havePermission } from './permissoes';

export const TOKEN_KEY = "@hwc-Token";
export const TOKEN_USER_KEY = "@hwc-user-Token";

export const isAuthenticated = (screen) => {
    
    let authenticated = false;

    if (localStorage.getItem(TOKEN_KEY) !== null) 
        authenticated = havePermission(screen)
    
    
    return authenticated;
}


export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const getUserToken = () => localStorage.getItem(TOKEN_USER_KEY);

export const login = (token, user) => {

    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(TOKEN_USER_KEY, user);
};

export const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_USER_KEY);
};