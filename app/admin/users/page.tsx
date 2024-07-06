"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  User,
  Pagination,
  Selection,
  ChipProps,
  SortDescriptor,
} from "@nextui-org/react";
import { Avatar, AvatarIcon } from "@nextui-org/react";
import { Spinner } from "@nextui-org/react";
import { VerticalDotsIcon } from "./VerticalDotsIcon";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  RadioGroup,
  Radio,
} from "@nextui-org/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";

interface User {
  _id: string;
  fname: string;
  lname: string;
  phone: number;
  email: string;
  profile?: string;
  isVerified: boolean;
  isAdmin: boolean;
  username: string;
  __v: number;
}

interface SignUpFormInput {
  fname: string;
  lname: string;
  email: string;
  phone: string;
  password: string;
  password2: string;
}

const signUpSchema = yup.object().shape({
  fname: yup.string().required("First name is required"),
  lname: yup.string().required("Last name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  phone: yup
    .string()
    .matches(/^\d+$/, "Phone number must be numeric")
    .required("Phone number is required"),
  password: yup.string().required("Password is required"),
  password2: yup
    .string()
    .oneOf([yup.ref("password"), undefined], "Passwords must match")
    .required("Confirm password is required"),
});

const page = () => {
  const route = useRouter();
  const [isLoading, setIsLoading] = React.useState(true);
  const [users, SetUser] = useState<User[]>([]);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [loading, setLoading] = useState<boolean>(false);

  const getUserDetails = async () => {
    setIsLoading(true);
    const res = await axios.get("/api/user/alluser");
    if (res) {
      console.log(res.data.data);
      SetUser(res.data.data);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  const {
    register: signUpRegister,
    handleSubmit: handleSignUpSubmit,
    formState: { errors: signUpErrors, isSubmitting: isSignUpSubmitting },
    trigger: triggerSignUp,
  } = useForm<SignUpFormInput>({
    resolver: yupResolver(signUpSchema),
  });

  const onSignUpSubmit = async (data: SignUpFormInput) => {
    setLoading(true);
    try {
      toast.promise(axios.post("/api/signup", data), {
        loading: "Loading...",
        success: (response) => {
          setLoading(false);
          onClose()
          getUserDetails()
          return `${response.data.message}`;
        },
        error: (error) => {
          setLoading(false);
          const errorMessage =
            error.response?.data?.error || "An unexpected error occurred";
          return `Error: ${errorMessage}`;
        },
      });
    } catch (error) {
      setLoading(false);
      console.error("Sign-up error:", error);
    }
  };

  const handleBlur = (trigger: any, field: string) => {
    trigger(field);
  };

  const handleDelete = async (id:string) =>{
    try {
      toast.promise(axios.delete("/api/user/alluser", { params: { id } }), {
        loading: "Loading...",
        success: (response) => {
          getUserDetails()
          return `${response.data.message}`;
        },
        error: (error) => {
          const errorMessage =
            error.response?.data?.error || "An unexpected error occurred";
          return `Error: ${errorMessage}`;
        },
      });
    } catch (error) {
      setLoading(false);
      console.error("Sign-up error:", error);
    }
  }

  return (
    <>
      <section className="flex flex-col gap-3">
        <span className="flex items-end justify-end">
          <Button color="default" onPress={onOpen}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24px"
              height="24px"
              viewBox="0 0 24 24"
            >
              <g id="Complete">
                <g data-name="add" id="add-2">
                  <g>
                    <line
                      fill="none"
                      stroke="#fff"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      x1="12"
                      x2="12"
                      y1="19"
                      y2="5"
                    />

                    <line
                      fill="none"
                      stroke="#fff"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      x1="5"
                      x2="19"
                      y1="12"
                      y2="12"
                    />
                  </g>
                </g>
              </g>
            </svg>
            Add User
          </Button>
        </span>
        <Table
          color="default"
          selectionMode="multiple"
          aria-label="Example table with client side sorting"
          classNames={{
            table: "min-h-[75vh]  min-w-[70vw]",
          }}
        >
          <TableHeader className="h-3">
            <TableColumn key="fname">User</TableColumn>
            <TableColumn key="phone">Email</TableColumn>
            <TableColumn key="email">Phone</TableColumn>
            <TableColumn key="actions">Actions</TableColumn>
          </TableHeader>
          <TableBody
            className="h-full"
            items={users}
            isLoading={isLoading}
            loadingContent={<Spinner color="default" />}
          >
            {(item: User) => (
              <TableRow key={item._id} className="max-h-3 h-3 ">
                <TableCell>
                  <span className="flex items-center gap-2">
                    <Avatar
                      radius="md"
                      icon={<AvatarIcon />}
                      classNames={{
                        base: "bg-gradient-to-br from-[#FFB457] to-[#FF705B]",
                        icon: "text-black/80",
                      }}
                      src={item?.profile}
                    />
                    {item.fname}
                  </span>
                </TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item.phone}</TableCell>
                <TableCell>
                  <div className="relative flex justify-end items-center gap-2">
                    <Dropdown className="bg-background border-1 border-default-200">
                      <DropdownTrigger>
                        <Button
                          isIconOnly
                          radius="full"
                          size="sm"
                          variant="light"
                        >
                          <VerticalDotsIcon className="flex items-center gap-2" />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu>
                        <DropdownItem onClick={()=>route.push(`/admin/users/${item.username}`)}>View</DropdownItem>
                        <DropdownItem>Edit</DropdownItem>
                        <DropdownItem onClick={()=>handleDelete(item._id)}>Delete</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </section>
      <Modal
        isOpen={isOpen}
        placement="auto"
        size="md"
        backdrop="blur"
        onOpenChange={onOpenChange}
        classNames={{
          backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20"
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Register User
              </ModalHeader>
              <ModalBody>
                <form
                  className="flex flex-col gap-4 pb-3"
                  onSubmit={handleSignUpSubmit(onSignUpSubmit)}
                >
                  <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                    <Input
                      type="text"
                      isRequired
                      autoFocus
                      label="First Name"
                      isInvalid={!!signUpErrors.fname}
                      {...signUpRegister("fname", {
                        onBlur: () => handleBlur(triggerSignUp, "fname"),
                      })}
                      errorMessage={signUpErrors.fname?.message}
                    />
                    <Input
                      type="text"
                      isRequired
                      label="Last Name"
                      isInvalid={!!signUpErrors.lname}
                      {...signUpRegister("lname", {
                        onBlur: () => handleBlur(triggerSignUp, "lname"),
                      })}
                      errorMessage={signUpErrors.lname?.message}
                    />
                  </div>
                  <Input
                    type="email"
                    isRequired
                    label="Email"
                    isInvalid={!!signUpErrors.email}
                    {...signUpRegister("email", {
                      onBlur: () => handleBlur(triggerSignUp, "email"),
                    })}
                    errorMessage={signUpErrors.email?.message}
                  />
                  <Input
                    type="tel"
                    isRequired
                    label="Phone"
                    isInvalid={!!signUpErrors.phone}
                    {...signUpRegister("phone", {
                      onBlur: () => handleBlur(triggerSignUp, "phone"),
                    })}
                    errorMessage={signUpErrors.phone?.message}
                  />
                  <Input
                    type="password"
                    isRequired
                    label="Password"
                    isInvalid={!!signUpErrors.password}
                    {...signUpRegister("password", {
                      onBlur: () => handleBlur(triggerSignUp, "password"),
                    })}
                    errorMessage={signUpErrors.password?.message}
                  />
                  <Input
                    type="password"
                    isRequired
                    label="Confirm Password"
                    isInvalid={!!signUpErrors.password2}
                    {...signUpRegister("password2", {
                      onBlur: () => handleBlur(triggerSignUp, "password2"),
                    })}
                    errorMessage={signUpErrors.password2?.message}
                  />
                  <Button color="secondary" type="submit" isLoading={loading}>
                    Sign Up
                  </Button>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default page;
