"use client"
import {
  Tabs,
  Tab,
  Card,
  Input,
  CardBody,
  Checkbox,
  Button,
  Link,
  Divider,
} from "@nextui-org/react";
import axios from "axios";
import { useRouter } from 'next/navigation'
import { useState } from "react";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'sonner'

interface LoginFormInput {
  email: string;
  password: string;
}

interface SignUpFormInput {
  fname: string;
  lname: string;
  email: string;
  phone: string;
  password: string;
  password2: string;
}

const loginSchema = yup.object().shape({
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const signUpSchema = yup.object().shape({
  fname: yup.string().required('First name is required'),
  lname: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  phone: yup.string().matches(/^\d+$/, 'Phone number must be numeric').required('Phone number is required'),
  password: yup.string().required('Password is required'),
  password2: yup.string().oneOf([yup.ref('password'), undefined], 'Passwords must match').required('Confirm password is required'),
});

export default function LoginTab() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | number>("login");
  const [loading, setLoading] = useState<boolean>(false)
  const route = useRouter()

  const { 
    register: loginRegister, 
    handleSubmit: handleLoginSubmit, 
    formState: { errors: loginErrors ,isSubmitting: isLoginSubmitting}, 
    trigger: triggerLogin 
  } = useForm<LoginFormInput>({
    resolver: yupResolver(loginSchema),
  });

  const { 
    register: signUpRegister, 
    handleSubmit: handleSignUpSubmit, 
    formState: { errors: signUpErrors , isSubmitting: isSignUpSubmitting}, 
    trigger: triggerSignUp 
  } = useForm<SignUpFormInput>({
    resolver: yupResolver(signUpSchema),
  });

  const onLoginSubmit = (data: LoginFormInput) => {
    setLoading(true);
    try {
      toast.promise(
        axios.post("/api/login", data),
        {
          loading: 'Loading...',
          success: (response) => {
            setLoading(false);          
            setSelected("login")     
            console.log("Success: ", response?.data);
            route.push('./')
            return `${response.data.message}`;
          },
          error: (error) => {
            setLoading(false);            
            const errorMessage = error.response?.data?.error || "An unexpected error occurred";
            return `Error: ${errorMessage}`;
          },
        }
      );
    } catch (error) {
      setLoading(false);    
      console.error("Sign-up error:", error);
    }
  };

  // const onSignUpSubmit = async (data: SignUpFormInput) => {
  //   // console.log(data)
  //   // try{
  //   //   const res = await axios.post("/api/signup", data);
  //   //   console.log("Success : ", res?.data);

  //   // }catch(error:any){
  //   //   console.log("Error", error.message);
  //   // }
  //   toast.promise(
  //     axios.post("/api/signup", data),
  //     {
  //       loading: 'Loading...',
  //       success: (response) => {
  //         console.log("Success: ", response?.data);
  //         return `${response.data.message}`;
  //       },
  //       error: (error) => {
  //         const errorMessage = error.response?.data?.error || "An unexpected error occurred";
  //         return `Error: ${errorMessage}`;
  //       },
  //     }
  //   );
  // };
  
  const onSignUpSubmit = async (data: SignUpFormInput) => {
    setLoading(true);
    try {
      toast.promise(
        axios.post("/api/signup", data),
        {
          loading: 'Loading...',
          success: (response) => {
            setLoading(false);          
            setSelected("login")     
            console.log("Success: ", response?.data);
            return `${response.data.message}`;
          },
          error: (error) => {
            setLoading(false);            
            const errorMessage = error.response?.data?.error || "An unexpected error occurred";
            return `Error: ${errorMessage}`;
          },
        }
      );
    } catch (error) {
      setLoading(false);    
      console.error("Sign-up error:", error);
    }
  };

  const handleBlur = (trigger: any, field: string) => {
    trigger(field);
  };

  return (
    <>
      <Card className="min-w-[450px] min-h-[550px]">
        <CardBody className="overflow-hidden">
          <Tabs
            fullWidth
            size="lg"
            aria-label="Tabs form"
            selectedKey={selected}
            onSelectionChange={setSelected}
          >
            <Tab key="login" title="Login">
              <form className="flex flex-col gap-4" onSubmit={handleLoginSubmit(onLoginSubmit)}>
                <Input 
                  autoFocus 
                  label="Email" 
                  isInvalid={!!loginErrors.email} 
                  isRequired 
                  {...loginRegister('email', { 
                    onBlur: () => handleBlur(triggerLogin, 'email') 
                  })} 
                  errorMessage={loginErrors.email?.message} 
                />
                <Input 
                  label="Password" 
                  type="password" 
                  isInvalid={!!loginErrors.password} 
                  isRequired 
                  {...loginRegister('password', { 
                    onBlur: () => handleBlur(triggerLogin, 'password') 
                  })} 
                  errorMessage={loginErrors.password?.message} 
                />
                <div className="flex py-2 px-1 justify-between">
                  <Checkbox
                    defaultSelected
                    color="default"
                    classNames={{
                      label: "text-small",
                    }}
                  >
                    Remember me
                  </Checkbox>
                  <Link color="primary" href="#" size="sm">
                    Forgot password?
                  </Link>
                </div>
                <Button color="secondary" size="lg" type="submit" variant="shadow" isLoading={loading} >
                  Sign in
                </Button>
                <div className="flex gap-2 justify-center items-center">
                  <Divider className="my-4 w-[35%]" /> or{" "}
                  <Divider className="my-4 w-[35%]" />
                </div>
              </form>
            </Tab>
            <Tab key="sign" title="Sign up">
              <form className="flex flex-col gap-4" onSubmit={handleSignUpSubmit(onSignUpSubmit)}>
                <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                  <Input 
                    type="text" 
                    isRequired 
                    autoFocus 
                    label="First Name" 
                    isInvalid={!!signUpErrors.fname} 
                    {...signUpRegister('fname', { 
                      onBlur: () => handleBlur(triggerSignUp, 'fname') 
                    })} 
                    errorMessage={signUpErrors.fname?.message } 
                  />
                  <Input 
                    type="text" 
                    isRequired 
                    label="Last Name" 
                    isInvalid={!!signUpErrors.lname} 
                    {...signUpRegister('lname', { 
                      onBlur: () => handleBlur(triggerSignUp, 'lname') 
                    })} 
                    errorMessage={signUpErrors.lname?.message} 
                  />
                </div>
                <Input 
                  type="email" 
                  isRequired 
                  label="Email" 
                  isInvalid={!!signUpErrors.email} 
                  {...signUpRegister('email', { 
                    onBlur: () => handleBlur(triggerSignUp, 'email') 
                  })} 
                  errorMessage={signUpErrors.email?.message}
                />
                <Input 
                  type="tel" 
                  isRequired 
                  label="Phone" 
                  isInvalid={!!signUpErrors.phone} 
                  {...signUpRegister('phone', { 
                    onBlur: () => handleBlur(triggerSignUp, 'phone') 
                  })} 
                  errorMessage={signUpErrors.phone?.message} 
                />
                <Input 
                  type="password" 
                  isRequired 
                  label="Password" 
                  isInvalid={!!signUpErrors.password} 
                  {...signUpRegister('password', { 
                    onBlur: () => handleBlur(triggerSignUp, 'password') 
                  })} 
                  errorMessage={signUpErrors.password?.message} 
                />
                <Input 
                  type="password" 
                  isRequired 
                  label="Confirm Password" 
                  isInvalid={!!signUpErrors.password2} 
                  {...signUpRegister('password2', { 
                    onBlur: () => handleBlur(triggerSignUp, 'password2') 
                  })} 
                  errorMessage={signUpErrors.password2?.message} 
                />
                <div className="flex py-2 px-1 justify-between">
                  <Checkbox
                    color="default"
                    classNames={{
                      label: "text-small",
                    }}
                  >
                    Accept Terms and Conditions
                  </Checkbox>
                </div>
                <Button color="secondary" type="submit" isLoading={loading} >
                  Sign Up
                </Button>
              </form>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </>
  );
}
