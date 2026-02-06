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
    <div className="min-h-screen w-full relative">
      {/* Radial Gradient Background from Bottom */}
         <div
    className="absolute inset-0 z-0"
    style={{
      background: `
       radial-gradient(ellipse 80% 60% at 60% 20%, rgba(175, 109, 255, 0.50), transparent 65%),
        radial-gradient(ellipse 70% 60% at 20% 80%, rgba(255, 100, 180, 0.45), transparent 65%),
        radial-gradient(ellipse 60% 50% at 60% 65%, rgba(255, 235, 170, 0.43), transparent 62%),
        radial-gradient(ellipse 65% 40% at 50% 60%, rgba(120, 190, 255, 0.48), transparent 68%),
        linear-gradient(180deg, #f7eaff 0%, #fde2ea 100%)
      `,
    }}
  />
      {/* Your Content/Components */}
      <div className="relative z-10">
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
      </div>
    </div>
  )
}

export default Hero