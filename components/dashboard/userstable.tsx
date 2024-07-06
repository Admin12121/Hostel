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
import axios from "axios";
import { Spinner } from "@nextui-org/react";
import { VerticalDotsIcon } from "./VerticalDotsIcon";

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

const Userstable = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [users, SetUser] = useState<User[]>([]);

  const getUserDetails = async () => {
    setIsLoading(true);
    const res = await axios.get("api/user/alluser");
    if (res) {
      console.log(res.data.data);
      SetUser(res.data.data);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <>
      <Table
        color="default"
        selectionMode="multiple"
        aria-label="Example table with client side sorting"
        classNames={{
          table: "min-h-[400px] max-h-[400px] min-w-[600px]",
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
              <TableCell >
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
                      <DropdownItem>View</DropdownItem>
                      <DropdownItem>Edit</DropdownItem>
                      <DropdownItem>Delete</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default Userstable;
