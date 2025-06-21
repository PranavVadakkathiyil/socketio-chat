import React, { createContext,useContext,useState } from "react";

type AddGrouptype = {
    open:boolean;
    setopen:React.Dispatch<React.SetStateAction<boolean>>

}

const AddgroupContext = createContext<AddGrouptype|undefined>(undefined)
export const ContextProvider = ({children}:{children:React.ReactNode})=>{

    const [open, setopen] = useState(false)
    
    
    return(
        <AddgroupContext.Provider value={{open,setopen}}>
            {children}
        </AddgroupContext.Provider>
    )
}
export const addGroupContext = ()=>{
    const context = useContext(AddgroupContext)
    if(context === undefined){
        throw new Error("Context error");
        
    }
    return context
}