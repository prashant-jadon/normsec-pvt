import { account } from '@/lib/appwrite/config';
import { useUserContext } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { z } from 'zod';
import { UpdateRecoverValidation } from '@/lib/Validation';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const FormPasswordRest = () => {
    const {checkAuthUser} = useUserContext();
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof UpdateRecoverValidation>>({
        resolver: zodResolver(UpdateRecoverValidation),
        defaultValues: {
          password: "",
          repassword:"",

        },
      })



   
    async function onSubmit(values: z.infer<typeof UpdateRecoverValidation>) {
       

        let urlSearchParams = new URLSearchParams(window.location.search);
        let secret = urlSearchParams.get("secret");
        let userId = urlSearchParams.get("userId");

        if (userId && secret) {
            try {
                await account.updateRecovery(userId, secret, values.password);
            } catch (error) {
                alert(error);
            }
        } else {
            alert('User ID or secret not found in the URL.');
        }

        const isLoggedIn = await checkAuthUser();
        if(isLoggedIn){
         navigate('/');
        }else{
         toast({title:'CONSOLE LOG REDIRECG'})
        }
    };

    // Redirect if user is logged in

    return (

        <Form {...form}>
        <div className='sm:w-420 flex-center flex-col'>
            <img src='/assets/images/logo.svg' alt='logo'/>
            <h2 className='h3-bold md:h2-bold pt-1 sm:pt-12'>Log In to your Account</h2>
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



              

              

              <Button type="submit" className='shad-button_primary'>
                
                "Sign In"
        
              </Button>



            </form>

    </div>
  </Form>
)};

export default FormPasswordRest;
