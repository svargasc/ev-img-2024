import { useForm } from 'react-hook-form'
import logoeventBrew from '../img/logoeventsBrew.png'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';


function RegisterPage() {

    const { register, handleSubmit, formState: {
        errors
    } } = useForm();
    const {signup, isAuthenticated , errors: registerErrors} = useAuth();
    const navigate = useNavigate();
    
    useEffect(() => {
        if (isAuthenticated) navigate('/login')
    }, [isAuthenticated])

    const onSubmit = handleSubmit(async (values) => {
        signup(values);
    });

  return (
    <>
        <div className="flex flex-col items-center justify-center h-screen bg-[url('https://i.ibb.co/LQf91TG/fondo-EB.webp')] bg-cover">
            <h2 className='text-7xl text-[#FFEEB3]'>REGISTRATE</h2>
            <div className="flex justify-center items-center h-4/5 w-[80%]">
                <div className='flex flex-col justify-center items-center w-1/2'>
                    <Link to="/"><img className='1/2' src={ logoeventBrew } alt="" /></Link>
                    <p className='bg-[#4A2D0B] rounded-full py-1 px-4 text-[#FFEEB3] text-2xl '>¿Ya tienes cuenta? Inicia sesión aquí. <NavLink className="text-[#AC703E] underline hover:font-bold" to="/login" >Iniciar sesión</NavLink> </p>
                </div>
                <form 
                 className='flex flex-col items-center w-1/2 h-[70%]' 
                 onSubmit={onSubmit}
                 >  
                    <div className='bg-[#0000004f] rounded-xl flex flex-col justify-center items-center w-4/5 h-full'>
                        {
                            registerErrors.map((error, i) => (
                                <div className='bg-red-500 text-white w-2/3 text-lg' key={i}>{error}</div>
                            )) 
                        }
                        
                        <input 
                         className='my-2 w-2/3 h-12 text-lg bg-[#FFEEB3] text-[#AC703E] pl-2 font-bold placeholder-[#AC703E] placeholder:font-bold' 
                         type="text" {...register("username",{ required:true })} 
                         placeholder='Nombres:' 
                        />
                        
                         {errors.username && (<p className='text-red-500'>username is required</p>)}

                        <input 
                         className='my-2 w-2/3 h-12 text-lg bg-[#FFEEB3] text-[#AC703E] pl-2 font-bold placeholder-[#AC703E] placeholder:font-bold' 
                         type="email" {...register("email",{ required:true })} 
                         placeholder='Correo:'
                        />

                        {errors.email && (<p className='text-red-500'>email is required</p>)}

                        <input 
                         className='my-2 w-2/3 h-12 text-lg bg-[#FFEEB3] text-[#AC703E] pl-2 font-bold placeholder-[#AC703E] placeholder:font-bold' 
                         type="password" {...register("password",{ required:true })} 
                         placeholder='Contraseña:'
                        />

                        {errors.password && (<p className='text-red-500'>password is required</p>)}

                        <button className='bg-[#FFEEB3] text-[#AC703E] text-2xl font-bold h-12 w-1/4 rounded-full mt-2 hover:bg-[#AC703E] hover:text-[#FFEEB3] duration-300' type='submit'>
                            Enviar 
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </>
  )
}

export default RegisterPage