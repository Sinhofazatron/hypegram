import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SignupValidation } from "@/lib/validation";
import { z } from "zod";
import { SlSocialFoursqare } from "react-icons/sl";
import Loader from "@/components/shared/Loader";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from '@/context/AuthContext';

const SignupForm = () => {
  const { toast } = useToast();
  const { mutateAsync: createUserAccount, isPending: isCreatingAccount } =
    useCreateUserAccount();
  const {mutateAsync: signInAccount, isPending: isSigningIn} = useSignInAccount()
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const navigate = useNavigate()
 
  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof SignupValidation>) {
    const newUser = await createUserAccount(values);

    if (!newUser) {
      return toast({
        title: "Возникла ошибка при регистрации, попробуйте позднее",
      });
    }

    const session = await signInAccount({
      email: values.email,
      password: values.password
    })

    if(!session) {
      return toast({
        title: "Ошибка входа в систему, попробуйте позднее",
      });
    }

    const isLoggedIn = await checkAuthUser()

    if(isLoggedIn) {
      form.reset()
      navigate('/')
    } else {
      return toast({
        title: "Ошибка регистрации, попробуйте позднее",
      });
    }
  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <div className="flex gap-2 items-center">
          <SlSocialFoursqare size={28} />
          <p className="h2-bold">Hypegram</p>
        </div>
        <h2 className="font-semibold text-xl pt-5 sm:pt-5">Создать аккаунт</h2>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-3  mt-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="ml-1">Имя</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="bg-slate-300 text-black"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="ml-1">Логин</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="bg-slate-300 text-black"
                    {...field}
                  />
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
                <FormLabel className="ml-1">Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    className="bg-slate-300 text-black"
                    {...field}
                  />
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
                <FormLabel className="ml-1">Пароль</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    className="bg-slate-300 text-black"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="shad-button_primary mt-4" type="submit">
            {isCreatingAccount ? (
              <div className="flex-center gap-2">
                <Loader /> Загрузка...
              </div>
            ) : (
              "Создать аккаунт"
            )}
          </Button>
          <p className="text-small-regular text-light-2 text-center mt-2">
            Уже есть зарегистрированы?{" "}
            <Link to="/sign-in" className="text-red-500 hover:text-red-400">
              Войти
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SignupForm;
