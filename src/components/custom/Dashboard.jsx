import React, { useContext, useEffect, useRef } from 'react'
import { useUser } from '@clerk/clerk-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import PleaseSignin from './PleaseSignin'
import { firebaseDb } from '../../../config/FirebaseConfig'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { UserDetailContext } from '../../../context/UserDetailContext'
import Header from './Header'
import PromptBox from './PromptBox'
import MyProjects from './MyProjects'

const Dashboard = () => {
    const {user,isLoaded} = useUser();
    const navigate = useNavigate();
    const{userDetail,setUserDetail} = useContext(UserDetailContext);
    const location = useLocation();
    const promptBoxRef = useRef(null);
    
    useEffect(()=>{
      user && createNewUser()
    },[user])

    const createNewUser = async () =>{
      // if user alr exists, redirect to dashboard
      if(user){
        const docRef = doc(firebaseDb, "users", user?.primaryEmailAddress?.emailAddress || ""); // db, collection, document id
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
          setUserDetail(docSnap.data());
        } else {
          // docSnap.data() will be undefined in this case
          const data = {
            fullName: user?.fullName || "",
            email: user?.primaryEmailAddress?.emailAddress || "",
            createdAt: new Date(),
            credits:5
          }
          await setDoc(doc(firebaseDb,"users", user?.primaryEmailAddress?.emailAddress || ""), {
            ...data
          } )
          setUserDetail(data);
        }

      }
     
    }

    if(!user && isLoaded){
        return <PleaseSignin />
    }


  return (
    <>
    {user && isLoaded && <div>
      <Header />
      {location.pathname === "/dashboard" &&
      <div>
        <PromptBox ref={promptBoxRef} />
        <MyProjects onCreateNewClick={() => promptBoxRef.current?.focus()} />
      </div>
      }
       
       <Outlet />
    </div>}
    
    </>
  )
}

export default Dashboard