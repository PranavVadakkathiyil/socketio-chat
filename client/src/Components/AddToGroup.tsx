import React, { useState } from 'react';
import { IoSearchOutline } from 'react-icons/io5';
import { getUserInfo } from '../apis/UserApi';
import { FaPlus } from 'react-icons/fa';
import { ImCross } from 'react-icons/im';
import { createGroup } from '../apis/ChatApi';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
type User = {
    _id: string;
    username: string;
    phone: string;
    avatar: string;
};

const AddToGroup: React.FC = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<User[]>([]);
    const [addedItems, setAddedItems] = useState<User[]>([]);
    const [groupname, setgroupname] = useState<string>('')
    const navigate = useNavigate()
    const handleSearch = async () => {
        try {
            if (!query.trim()) return;

            const res = await getUserInfo(query)

           
            setResults(res.data.user); // assuming response is User[]
        } catch (error) {
            console.error('Error searching users:', error);
        }
    };

    const handleAdd = (user: User) => {
        const alreadyAdded = addedItems.find((u) => u._id === user._id);
        if (!alreadyAdded) {
            setAddedItems((prev) => [...prev, user]);
        }
    };

    const handleRemove = (userId: string) => {
        setAddedItems((prev) => prev.filter((u) => u._id !== userId));
    };
    const makegroup = async()=>{
        if(!groupname) return
       
        const users = addedItems.map((user)=>user._id)
        try {
            const res =await createGroup(users,groupname)
          
            if(res.data.success){
                toast.success("Created chat group")
                navigate('/home')
            }
            else{
                toast.success(res.data.message)
            }
            
        } catch (error) {
            console.log(error);
            
        }
        
    }

    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <div className="border border-gray-300 rounded-xl p-4 w-[90%] max-w-xl shadow-lg">
                
                {/* Search bar */}
                <div className="flex gap-2 mb-4">
                    
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search users..."
                        className="border px-3 py-2 w-full rounded-md outline-none focus:ring-2 focus:ring-green-400"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-green-400 text-white border p-3 rounded-full hover:bg-green-500"
                    >
                        <IoSearchOutline />
                    </button>
                </div>

                {/* Search Results */}
                <div className="mb-4">
                    {results.map((user) => (
                        <div
                            key={user._id}
                            className="flex justify-between items-center border-b border-gray-300 py-2"
                        >
                            <img src={user.avatar} alt="img" className="w-12 h-12 border border-gray-500 rounded-full object-cover" />
                            <div className="flex-1">
                                <p className="font-semibold">{user.username}</p>
                                <p className="text-sm text-gray-600">{user.phone}</p>
                            </div>
                            <button
                                onClick={() => handleAdd(user)}
                                className="text-green-600 border border-green-600 p-2 rounded-full hover:bg-green-100"
                            >
                                <FaPlus/>
                            </button>
                        </div>
                    ))}
                </div>

                {/* Added Users */}
                <div>
                    <h3 className="font-semibold mb-2">Added Users:</h3>
                    {addedItems.length === 0 && <p className="text-gray-500">No users added.</p>}
                    {addedItems.map((user) => (
                        <div
                            key={user._id}
                            className="flex justify-between items-center border-b border-gray-300 py-2"
                        >
                            <div>
                                <p className="font-medium">{user.username}</p>
                                <p className="text-sm text-gray-500">{user.phone}</p>
                            </div>
                            <button
                                onClick={() => handleRemove(user._id)}
                                className="text-red-600 border border-red-600 p-2 rounded-full hover:bg-red-100"
                            >
                                <ImCross/>
                            </button>
                        </div>

                    ))}
                </div>
                <div>
                    {addedItems.length >= 2 && (
                        <div className="mt-4">
                            <input type="text" value={groupname} onChange={(e)=>setgroupname(e.target.value)} placeholder='Group Name' required className="border mb-2 px-3 py-2 w-full rounded-md outline-none focus:ring-2 focus:ring-green-400"/>
                            <button  onClick={()=>makegroup()} className="bg-green-400 text-white px-4 py-2 rounded hover:bg-green-500 w-full">
                                Make Group Chat
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddToGroup;
