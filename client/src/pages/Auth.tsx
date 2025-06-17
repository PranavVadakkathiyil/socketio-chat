import { BsFillChatHeartFill } from 'react-icons/bs'
import loginimg from '../assets/loginimg.svg'
import { AuthComponent } from '../Components/AuthComponent'
const Auth = () => {
    return (
        <section className='w-screen h-screen'>
            <div>
                <p className='flex items-center justify-center gap-1 text-2xl p-3'><BsFillChatHeartFill className='text-[#92E3A9] text-2xl' /><span>lovechat</span> </p>

            </div>


            <div className='sm:flex'>
                <div className='sm:w-[50%]'>
                    <img src={loginimg} alt="img" className='w-full h-full' />
                </div>
                <div className='sm:w-[50%] '>
                    <AuthComponent />
                </div>
            </div>
        </section>
    )
}

export default Auth