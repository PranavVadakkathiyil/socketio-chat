import Chats from '../Components/Chats'
import ViewChat from '../Components/ViewChat'

const ChatPageView = () => {
  return (
    <>
    <section className='w-screen  sm:flex px-1 gap-4 '>
    <div className='sm:min-w-sm '>
        <Chats/>
    </div>
    <div className='w-full'>
        <ViewChat/>
    </div>
    </section>
    </>
  )
}

export default ChatPageView