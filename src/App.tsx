import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import AlertMessage from './components/AlertMMessage';
import { CategoryType, UserType } from './types/index';
import Navigation from './components/Navigation';
import Container from 'react-bootstrap/Container';
import Home from './views/Home';
import Login from './views/Login';
import SignUp from './views/SignUp';
import {getMe} from './lib/apiWrapper.ts';
import EditPost from './views/EditPost';


export default function App(){
    const [isLoggedIn, setIsLoggedIn] = useState(False);
    const [currentUser, setCurrentUser] = useState<UserType|null>(null);
    const [alertMessage, setAlertMessage] = useState<string|undefined>(undefined);
    const [category, setCategory] = useState<CategoryType|undefined>(undefined);
   
    useEffect(() => {
        async function getLoggedInUser(){
            if(isLoggedIn){
                const token = localStorage.getItem('token')||'';
                if (token){
                    const response = await getMe(token);
                    if (response.data){
                        setCurrentUser(response.data)
                        localStorage.setItem('currentUser', JSON.stringify(response.data))
                        console.log(response.data);
                    } else {
                        setIsLoggedIn(False);
                        console.warn(response.data);
                    }
                }
            }
        }
        getLoggedInUser();
    }, [isLoggedIn])
    const flashMessage = (newMessage:string|undefined, newCategory:CategoryType|undefined) => {
        setAlertMessage(newMessage);
        setCategory(newCategory);
    }
    const logUserIn = () => {
        setIsLoggedIn(true);
    }
    const logUserOut = () => {
        setIsLoggedIn(false);
        setCurrentUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExp');
        flashMessage('You have successfully logged out', 'success');
    }
    return (
        <>
            <Navigation isLoggedIn={isLoggedIn} logUserOut={logUserOut}/>
            <Container>
                {alertMessage && <AlertMessage message={alertMessage} category={category} flashMessage={flashMessage}/>}
                <Routes>
                    <Route path='/' element={<Home isLoggedIn={isLoggedIn} currentUser={currentUser} flashMessage={flashMessage} /> } />
                    <Route path='/signup' element={<SignUp flashMessage={flashMessage}/> } />
                    <Route path='/login' element={<Login flashMessage={flashMessage} logUserIn={logUserIn}/> } />
                    <Route path='/edit/:postId' element={<EditPost flashMessage={flashMessage} currentUser={currentUser} />} /> <Route path='/edit/:postId' element={<EditPost flashMessage={flashMessage} currentUser={currentUser} />} />
                </Routes>
            </Container>
        </>
    )
}