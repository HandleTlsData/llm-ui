import React, { createContext, useState, useContext, ReactNode } from 'react';
import axios from 'axios';
import backendURL from './Global';

interface AuthContextType 
{
  isAuthenticated: boolean;
  myUsername: string;
  loginWithToken: () => Promise<boolean>;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => 
{
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [myUsername, setMyUsername] = useState('');
  

  function setCookie(name: string, value: string, days: number) 
  {
    var expires = "";
    if (days) 
    {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
  }

  const getUsername = async () => 
  {
    try 
    {
      const data = { token: localStorage.getItem('authtok') };
      const response = await axios.post(backendURL + '/getUsername', data);
      console.log('Username', response.data);
      setMyUsername(response.data);
    } 
    catch (error) 
    {
      console.error('Unable to get username!', error);
    }
  }

  const loginWithToken = async () => 
  {
    try 
    {
      const data = { token: localStorage.getItem('authtok') };
      if(data.token != null)
      {
        const response = await axios.post(backendURL + '/loginToken', data);
        console.log('Login successful!', response.data);
        setCookie("token", data.token, 3600);
        setIsAuthenticated(true);
        getUsername();
        return true;
      }
    } 
    catch (error) 
    {
      console.error('Login failed!', error);
      setIsAuthenticated(false);
    }

    return false;
  }
  const login = async (username: string, password: string) => 
  {
    try 
    {
      const data = { name: username, password: password};
      const response = await axios.post(backendURL + '/login', data);
      if (response.status === 200) 
      {
        localStorage.setItem('authtok',response.data);   
        return loginWithToken();
      }
      else
      {
        setIsAuthenticated(false);
      }
    } 
    catch (error) 
    {
      console.error('Error signing in:', error);
      setIsAuthenticated(false);
    } 
    return false;
  }
  const logout = () => 
  {
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, myUsername, loginWithToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => 
{
  const context = useContext(AuthContext);
  if (context === undefined) 
  {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};