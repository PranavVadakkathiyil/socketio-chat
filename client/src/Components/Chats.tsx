import { FaPlus } from 'react-icons/fa'
import loginimg from '../assets/loginimg.svg'
import { useState } from 'react'
import { IoSearchOutline } from 'react-icons/io5'
import { ImCross } from 'react-icons/im'
 
const Chats = () => {
  const [searchbar, setsearchbar] = useState(true)
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
            (<ImCross onClick={() => setsearchbar(!searchbar)} />)
          }
          
          
        </p>
      </div>

      {/* Scrollable chat list */}
      {
        searchbar ?
          (
            <div className="flex-1  overflow-y-auto py-1 px-1">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-2 border border-gray-300 rounded mb-2 bg-white">
                  <img src={loginimg} alt="" className="w-12 h-12 border border-gray-500 rounded-full object-cover" />
                  <div className="flex-1">
                    <p className="font-semibold">Pranav</p>
                    <p className="text-sm text-gray-600">Hello</p>
                  </div>
                  <div>
                    <span className="w-3 h-3 inline-block rounded-full bg-green-400"></span>
                  </div>
                </div>
              ))}
            </div>
          )
          :
          (
            <div className="flex-1  overflow-y-auto py-1 px-1">
              <div className='border border-gray-300 p-1 flex gap-2'>
                <input type="text" placeholder='Search' className='flex items-center  p-2 border border-gray-300 rounded bg-white w-full outline-none focus:ring-2 focus:ring-green-200' />

                <button className="p-3 bg-green-500 hover:bg-green-600 text-white rounded-full">
                  <IoSearchOutline className="text-xl" />
                </button>
              </div>

              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-2 border border-gray-300 rounded mb-2 bg-white">
                  <img src={loginimg} alt="" className="w-12 h-12 border border-gray-500 rounded-full object-cover" />
                  <div className="flex-1">
                    <p className="font-semibold">Pranav</p>
                    <p className="text-sm text-gray-600">9562840801</p>
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
