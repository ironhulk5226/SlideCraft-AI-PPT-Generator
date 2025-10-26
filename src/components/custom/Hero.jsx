import React from 'react'
import Header from './Header'
import { Button } from '../ui/button'
import { Play } from 'lucide-react'
import { HeroVideoDialog } from '../ui/hero-video-dialog'
import { useUser , SignInButton } from '@clerk/clerk-react'
import Thumbnail from '../../assets/Thumbnail.png'
import { useNavigate } from 'react-router-dom'

const Hero = () => {
    const {user} = useUser();
    const navigate = useNavigate();
  return (
    <>
      <Header />
      <div className='flex flex-col items-center justify-center mt-32 space-y-4'>
        <h2 className='font-bold text-5xl'>From Idea to <span className='text-primary'>Presentation</span> In One Click⚡</h2>
        <p className='mt-4 text-xl text-gray-500 text-center'>Transform your ideas into stunning presentations effortlessly with our AI-powered tool.</p>
        <div className='flex gap-5 mt-10'>
            <a href="https://www.youtube.com/watch?v=1F9C_8Ngyk8" target="_blank" rel="noopener noreferrer">
              <Button variant='outline' size='lg' className='cursor-pointer hover:scale-105 transition-transform duration-300'>Watch Video <Play className="text-primary font-bold" /></Button>
            </a>
            {!user ? 
            <SignInButton mode='modal'>
              <Button size='lg' className='cursor-pointer hover:scale-105 transition-transform duration-300'>Get Started</Button>
            </SignInButton> : <Button size='lg' className='cursor-pointer hover:scale-105 transition-transform duration-300' onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>}
        </div>
         <div className="relative max-w-3xl mt-8 p-4">
            <h2 className='text-center my-4 font-bold'>Watch How to Create AI PPT</h2>
      <HeroVideoDialog
        className="block dark:hidden"
        animationStyle="from-center"
        videoSrc="https://www.youtube.com/embed/1F9C_8Ngyk8"
        thumbnailSrc={Thumbnail}
        thumbnailAlt="Hero Video"
      />
      
    </div>
      </div>
    </>
  )
}

export default Hero