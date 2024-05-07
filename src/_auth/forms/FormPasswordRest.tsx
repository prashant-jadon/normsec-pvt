import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { UpdateRecoverValidation } from "@/lib/Validation";
import { account } from "@/lib/appwrite/config";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const FormPasswordRest = () => {

    const { toast } = useToast();
 
      const navigate = useNavigate();
  

  
      const form = useForm<z.infer<typeof UpdateRecoverValidation>>({
          resolver: zodResolver(UpdateRecoverValidation),
          defaultValues: {
            password: "",
            repassword: "",
          },
        })

  
  
        async function onSubmit(values: z.infer<typeof UpdateRecoverValidation>) {
            const urlParams = new URLSearchParams(window.location.search);
            const userId = urlParams.get('userId');
            const secret = urlParams.get('secret');
            if(userId==null){
                return;
            }
            if(secret==null){
                return;
            }
          
           const session = await account.updateRecovery(userId,secret,values.password);
           console.log(session);

         if(!session){
          return toast({title: "Sign in failed. Please try again."})
         }
          
         if(session){
            form.reset();
            navigate('/sigin');
           }else{
            toast({title:'Reset password fail Failed.Please try again'})
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


              <FormField 
              control={form.control} 
              name="repassword"
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

                       
         
          <Button type="submit" className='shad-button_primary'>"Sign Up" </Button>

        </form>
</div>
</Form>
  )
}

export default FormPasswordRest
