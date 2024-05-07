import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form"
import { SignInValidation } from "@/lib/Validation";
import { useResetPassword } from "@/lib/react-query/queriesAndMutations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";


const ResetPassword = () => {
    const { toast } = useToast();   
    const navigate = useNavigate();
    const {mutateAsync:resetpassword,isPending:isResetLoading} = useResetPassword();
    const form = useForm<z.infer<typeof SignInValidation>>({
        resolver: zodResolver(SignInValidation),
        defaultValues: {
          email: "",
        },
      })
      async function onSubmit(values: z.infer<typeof SignInValidation>) {
       const session = await resetpassword(values.email);
       console.log(session);

       if(!session){
        return toast({title: "Failed to send mail"})
       }

       if(session){
        form.reset();
        navigate('/');
       }else{
        toast({title:'Reset password fail Failed.Please try again'})
       }
  }
  return (
    <Form {...form}>
    <div className='sm:w-420 flex-center flex-col'>
        <img src='/assets/images/logo.svg' alt='logo'/>
        <h2 className='h3-bold md:h2-bold pt-1 sm:pt-12'>Log In to your Account</h2>
        <p className='text-light-3 small-medium md:base-regular mt-2'>To use RentAround enter your details</p>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
                       
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

        

          

          

          <Button type="submit" className='shad-button_primary'>
            {isResetLoading?(
              <div className='flex-center gap-2'>
                
                <Loader/>
                Loading...
              </div>
            ):
            "Sign In"
            }
          </Button>


        </form>
</div>
</Form>
  )
}

export default ResetPassword
