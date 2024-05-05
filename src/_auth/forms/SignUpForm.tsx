
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {Form,FormControl, FormField, FormItem,FormLabel,FormMessage,
} from "@/components/ui/form"
import { Input } from "../../components/ui/input"
import { SignUpValidation } from '@/lib/Validation'
import Loader from '@/components/shared/Loader'
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from "@/components/ui/use-toast"
import { useCreatUserAccount, useCreatUserAccountWithGoogle, useSignInAccount } from '@/lib/react-query/queriesAndMutations'
import { useUserContext } from '@/context/AuthContext'


  
const SignUpForm = () => {
  const { toast } = useToast();
  const {checkAuthUser} = useUserContext();
    const {mutateAsync:createUserAccount,isPending:isCreatingUser} = useCreatUserAccount();
    const {mutateAsync:createUserAccountwithgoogle,isPending:isCreatingUserwithgoogle} = useCreatUserAccountWithGoogle();

    

    const {mutateAsync:signInAccount} = useSignInAccount();
    const navigate = useNavigate();


    const form = useForm<z.infer<typeof SignUpValidation>>({
        resolver: zodResolver(SignUpValidation),
        defaultValues: {
          username:"",
          name: "",
          email: "",
          password: "",

        },
      })


      async function onSubmit(values: z.infer<typeof SignUpValidation>) {
        const newUser = await createUserAccount(values);
        if(!newUser){
          return  toast({
            title: "Sign Up Failed.Please try again",
          });
        }

   


      
       const session = await signInAccount({
        email: values.email,
        password: values.password
       });

       if(!session){
        return toast({title: "Sign in failed. Please try again."})
       }
        
       const isLoggedIn = await checkAuthUser();
       if(isLoggedIn){
        form.reset();
        navigate('/');
       }else{
        toast({title:'Sign Up Failed.Please try again'})
       }
  }
  
  return (
    <Form {...form}>
        <div className='sm:w-420 flex-center flex-col'>
            <img src='/assets/images/logo.svg' alt='logo'/>
            <h2 className='h3-bold md:h2-bold pt-1 sm:pt-12'>Create a New Account</h2>
            <p className='text-light-3 small-medium md:base-regular mt-2'>To use RentAround enter your details</p>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
                     
              <FormField 
              control={form.control} 
              name="username"
              render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input type='name' className='shad-input' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                )}
              />

              <FormField 
              control={form.control} 
              name="name"
              render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input type='name' className='shad-input' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                )}
              />

                           
              <FormField 
              control={form.control} 
              name="email"
              render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type='email' className='shad-input' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                )}
              />

              <FormField 
              control={form.control} 
              name="password"
              render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type='password' className='shad-input' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                )}
              />
              <Button type="submit" className='shad-button_primary'>
                {isCreatingUser?(
                  <div className='flex-center gap-2'>
                    
                    <Loader/>
                    Loading...
                  </div>
                ):
                "Sign Up"
                }
              </Button>

              <Button type="submit" className='shad-button_primary'>
                {isCreatingUserwithgoogle?(
                  <div className='flex-center gap-2'>
                    
                    <Loader/>
                    Loading...
                  </div>
                ):
                "Sign Up with google"
                }
              </Button>
              <p className='text-small-regular text-light-2 text-center mt-2'>
                Already have an account?
                <Link to="/signin" className='text-primary-500 text-small-semibold ml-1'>Log In</Link>
              </p>

            </form>
    </div>
    <button onClick={async ()=>{
           const withgoogle = await createUserAccountwithgoogle();
           console.log(withgoogle)
    }}>
  {isCreatingUserwithgoogle?(
                  <div className='flex-center gap-2'>
                    
                    <Loader/>
                    Loading...
                  </div>
                ):
                "Sign Up with google"
                }
    </button>
  </Form>
  
  )
}

export default SignUpForm
