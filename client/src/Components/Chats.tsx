import { FaPlus } from 'react-icons/fa'
import loginimg from '../assets/loginimg.svg'
import { useEffect, useState } from 'react'
import { IoSearchOutline } from 'react-icons/io5'
import { ImCross } from 'react-icons/im'
import { createChats, GetAllChats } from '../apis/ChatApi'
import { getUserInfo } from '../apis/UserApi'
import { Link } from 'react-router-dom'
 
const Chats = () => {
  const [searchbar, setsearchbar] = useState(true)
    const [search, setsearch] = useState<string>("")
  const [searchdata, setsearchdata] = useState<User[]>([])
  const [allchat, setallchat] =useState<Chat[]>([])
  
  const searchuser=async(search:string)=>{
    const res = await getUserInfo(search)
    setsearchdata(res.data.user)
    console.log("search",res.data);
    
  }
  const setusertochat = async(id:string)=>{
    try {
      const res = await createChats(id)
    
    console.log("setusertochat",res.data);
    } catch (error) {
      console.log(error);
      
    }
  }
   const getchat = async()=>{
    try {
      
        const res = await GetAllChats()
        console.log(res.data.fullChat);
        setallchat(res.data.fullChat)
        
      
    } catch (error) {
      console.log("Error Getallchat",error);
      
    }

  }
  useEffect(() => {
   
   getchat()
  }, [])
  
  return (
    <div className='w-full  sm:h-[90dvh] h-[90dvh] flex flex-col border border-gray-300'>
      {/* Header */}
      <div className='w-full border  border-gray-300 flex items-center justify-between  px-2 py-4'>
        <p className='text-xl'>Chats</p>
        <p className='border p-3 rounded-full'>
          {
            searchbar ? 
            (<FaPlus onClick={() => setsearchbar(!searchbar)} />)
            :
            (<ImCross onClick={() => {setsearchbar(!searchbar);getchat()}} />)
          }
          
          
        </p>
      </div>

      {/* Scrollable chat list */}
      {
        searchbar ?
          (
            <div className="flex-1 overflow-y-auto py-1 px-1">
  {allchat.map((data, i) => (
    <Link to={`/chat/${data._id}`} key={i}>
      <div  className="flex items-center gap-3 p-2 border border-gray-300 rounded mb-2 bg-white">
      <img
        src={loginimg}
        alt=""
        className="w-12 h-12 border border-gray-500 rounded-full object-cover"
      />
      <div className="flex-1">
        
          <p className="font-semibold">{data.chatname}</p>
          <p className="text-sm text-gray-600">
            {data.latestMessage?.content}
          </p>
        
      </div>
      <span className="w-3 h-3 inline-block rounded-full bg-green-400"></span>
    </div>
    </Link>
    
  ))}
</div>

          )
          :
          (
            <div className="flex-1  overflow-y-auto py-1 px-1">
              <div className='border border-gray-300 p-1 flex gap-2'>
                <input onChange={(e)=>setsearch(e.target.value)} type="text" placeholder='Search' className='flex items-center  p-2 border border-gray-300 rounded bg-white w-full outline-none focus:ring-2 focus:ring-green-200' />

                <button onClick={()=>searchuser(search)}  className="p-3 bg-green-500 hover:bg-green-600 text-white rounded-full">
                  <IoSearchOutline className="text-xl" />
                </button>
              </div>

              {searchdata.map((data, i) => (
                <div key={i} onClick={()=>setusertochat(data._id)} className="flex items-center gap-3 p-2 border border-gray-300 rounded mb-2 bg-white">
                  <img src={data.avatar} alt="" className="w-12 h-12 border border-gray-500 rounded-full object-cover" />
                  <div className="flex-1">
                    <p className="font-semibold">{data.username}</p>
                    <p className="text-sm text-gray-600">{data.phone}</p>
                  </div>

                </div>
              ))}
            </div>
          )
      }

    </div>
  )
}

export default Chats

