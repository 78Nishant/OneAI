import React from 'react'
import Sidebar from '../components/Sidebar'
import MainContent from '../components/MainContent'

const Home = () => {
  return (
    <div className='flex h-screen overflow-y-auto'>
      <Sidebar/>
      <MainContent/>
    </div>
  )
}

export default Home
