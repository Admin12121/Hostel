"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Spinner } from "@nextui-org/react";
import { Card, CardBody, Image, Divider } from "@nextui-org/react";
import { Avatar, AvatarIcon } from "@nextui-org/react";

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

const page = ({ params }: { params: { user: string } }) => {
  const route = useRouter();
  const [isLoading, setIsLoading] = React.useState(true);
  const [users, setUser] = useState<User>();

  const getUserDetails = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/user/alluser", {
        params: { username: params.user },
      });
      if (res.data) {
        setUser(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <div className="flex items-center justify-center w-[60vw] h-[75vh]">
      {isLoading && <Spinner color="default" />}
      {!isLoading && (
        <Card className="w-full h-full">
          <CardBody className="flex items-center justify-center">
            <Image
              alt="Album cover"
              className="object-cover bg-gradient-to-br from-[#FFB457] to-[#FF705B]"
              height={200}
              shadow="md"
              // src="https://nextui.org/images/album-cover.png"
              width={200}
            />
            <Divider className="my-4" />
            <span>
              <span className="flex">
                <h1>{users?.fname} {users?.lname}</h1>
              </span>
              <span>
                <h1>{users?.email}</h1>
              </span>
            </span>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default page;
