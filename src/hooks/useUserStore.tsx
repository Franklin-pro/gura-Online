import {create } from 'zustand'
import axiosInstance from '@/lib/axios'
import { toast } from './use-toast'



export const useUserStore = create((set,get) => ({
  user: null,
 loading:false,
 checkingAuth:true,


 signup:async({name,email,password,confirmPassword}) =>{
    set({loading:true})
    if(password !== confirmPassword){
        set({loading:false})
      return  toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "Passwords do not match.",
          });
    }
    try{
        const response = await axiosInstance.post('/auth/signup',{name,email,password} )
        set({user:response.data.user,loading:false})
    }catch(error){
        set({loading:false})
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: error.message,
            
          });
    }

 }
}))