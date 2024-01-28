import React from 'react'
import logoeventBrew from '../img/logoeventsBrew.png'
import { NavLink } from 'react-router-dom'

function HomePage() {
  return (
    <>
      <div className='flex justify-center items-center h-screen'>
        <div className='w-1/2 bg-[#FFEEB3] h-full flex items-center justify-center'>
          <img src={logoeventBrew} alt="" />
        </div>
        <div className='w-1/2 bg-[#AC703E] h-full flex flex-col justify-around items-center'>
          <h2 className='text-7xl'>Bienvenidos</h2>
          <div className='w-2/3 flex justify-between h-14'>
            <NavLink className='bg-[#FFEEB3] text-black h-full w-1/3 text-2xl border rounded-2xl flex justify-center items-center font-bold hover:shadow-2xl hover:text-3xl' to='/login'>Iniciar sesión</NavLink>
            <NavLink className='bg-[#FFEEB3] text-black h-full w-1/3 text-2xl border rounded-2xl flex justify-center items-center font-bold hover:shadow-2xl hover:text-3xl' to='/register'>Registrate</NavLink>   
          </div>
          <p className='w-4/5 h-1/3 text-center text-2xl'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus libero atque, reprehenderit fugiat voluptate consectetur velit debitis ex modi quisquam, incidunt doloribus aut vitae excepturi illum consequatur ea! Cum, quia.</p>
        </div>
      </div>
    </>
  )
}

export default HomePage