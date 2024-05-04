import './globals.css';
import {Routes,Route} from 'react-router-dom';
import SignInForm from './_auth/forms/SignInForm';
import { AllUsers, CreatePost, EditPost, Explore, Home, PostDetails, Profile, Saved } from './_root/pages';
import SignUpForm from './_auth/forms/SignUpForm';
import AuthLayout from './_auth/AuthLayout';
import RootLayout from './_root/RootLayout';
import { Toaster } from './components/ui/toaster';
import UpdateProfile from './_root/pages/UpdateProfile';
import Followers from './_root/pages/Followers';
import Followings from './_root/pages/Following';
import Updates from './_root/pages/Updates';
import UpdateDetails from './_root/pages/UpdateDetails';


const App = () => {
  return (
    <main className="flex h-screen">
      <Routes>
        <Route element={<AuthLayout/>}>
          <Route path='/signin' element={<SignInForm/>}/>
          <Route path='/signup' element={<SignUpForm/>}/>
        </Route>
        {/*public routes*/}
        
        {/*private routes*/}
       
        <Route element={<RootLayout/>}>
        <Route index element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/all-users" element={<AllUsers />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:id" element={<EditPost />} />
          <Route path="/posts/:id" element={<PostDetails />} />
          <Route path="/profile/:id/*" element={<Profile />} />
          <Route path="/update-profile/:id" element={<UpdateProfile />} />
          <Route path="/:id/followers" element={<Followers/>} />
          <Route path="/:id/followings" element={<Followings/>} />
          <Route path="/updates" element={<Updates/>} />
          <Route path="/updates/:id" element={<UpdateDetails />} />

          
        </Route>

      </Routes>
      <Toaster />
    </main>
  )
}

export default App
