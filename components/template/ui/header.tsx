"use client"
import Link from "next/link";
import MobileMenu from "./mobile-menu";
import Cookies from "js-cookie";
import { Avatar, AvatarIcon, DropdownSection ,Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, cn} from "@nextui-org/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'

const getToken = () => {
  const access_token = Cookies.get("token");
  return access_token;
};



export default function Header() {
  const [user, SetUser ] = useState<any>("")
  const access_token = getToken();
  const route = useRouter()

  const getUserDetails = async () => {
    const res = await axios.get('/api/user/profile')
    SetUser(res.data.data)
  }

  useEffect(()=>{
    if(access_token){
      getUserDetails()
    }
  },[access_token])

  const removeToken = () => {
    Cookies.remove("token");
    route.push('/login')
  };
  return (
    <header className="absolute w-full z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Site branding */}
          <div className="shrink-0 mr-4 flex items-center gap-3">
            {/* Logo */}
            <Link href="/" className="block" aria-label="Cruip">
              <svg
                className="w-8 h-8 fill-current text-purple-600"
                viewBox="0 0 32 32"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M31.952 14.751a260.51 260.51 0 00-4.359-4.407C23.932 6.734 20.16 3.182 16.171 0c1.634.017 3.21.28 4.692.751 3.487 3.114 6.846 6.398 10.163 9.737.493 1.346.811 2.776.926 4.262zm-1.388 7.883c-2.496-2.597-5.051-5.12-7.737-7.471-3.706-3.246-10.693-9.81-15.736-7.418-4.552 2.158-4.717 10.543-4.96 16.238A15.926 15.926 0 010 16C0 9.799 3.528 4.421 8.686 1.766c1.82.593 3.593 1.675 5.038 2.587 6.569 4.14 12.29 9.71 17.792 15.57-.237.94-.557 1.846-.952 2.711zm-4.505 5.81a56.161 56.161 0 00-1.007-.823c-2.574-2.054-6.087-4.805-9.394-4.044-3.022.695-4.264 4.267-4.97 7.52a15.945 15.945 0 01-3.665-1.85c.366-3.242.89-6.675 2.405-9.364 2.315-4.107 6.287-3.072 9.613-1.132 3.36 1.96 6.417 4.572 9.313 7.417a16.097 16.097 0 01-2.295 2.275z" />
              </svg>
            </Link>
            जीवन
          </div>

          {/* Desktop navigation */}
          <nav
            className={`hidden md:flex md:grow  ${
              access_token ? "flex justify-end" : ""
            }`}
          >
            {/* Desktop sign in links */}
            {!access_token ? (
              <ul className="flex grow justify-end flex-wrap items-center">
                <li>
                  <Link
                    href="/login"
                    className="font-medium text-purple-600 hover:text-gray-200 px-4 py-3 flex items-center transition duration-150 ease-in-out"
                  >
                    Sign in
                  </Link>
                </li>
                <li>
                  <Link
                    href="/login"
                    className="btn-sm text-white bg-purple-600 hover:bg-purple-700 ml-3"
                  >
                    Sign up
                  </Link>
                </li>
              </ul>
            ) : (
            <Dropdown
              // showArrow
              classNames={{
                base: "before:bg-default-200", // change arrow background
                content: "py-1 px-1 border border-default-200 bg-gradient-to-br from-white to-default-200 dark:from-default-50 dark:to-black",
              }}
            >
              <DropdownTrigger>
               <Avatar
                 icon={<AvatarIcon />}
                 classNames={{
                   base: "bg-gradient-to-br from-[#FFB457] to-[#FF705B]",
                   icon: "text-black/80",
                 }}
               />
              </DropdownTrigger>
              <DropdownMenu variant="faded" aria-label="Dropdown menu with description">
              <DropdownSection>  
               {user && user?.isAdmin  && <DropdownItem
                    key="new"
                    shortcut="⌘A"
                    onClick={()=>route.push('/admin')}                    
                  >
                    Admin Panal
                  </DropdownItem>}
                <DropdownItem
                    key="new"
                    shortcut="⌘P"
                  >
                    Profile
                  </DropdownItem>
                  <DropdownItem
                    key="copy"
                    shortcut="⌘S"
                  >
                    Settings
                  </DropdownItem>
                  <DropdownItem
                    key="edit"
                    shortcut="⌘⇧E"
                  >
                    Payment
                  </DropdownItem>
                </DropdownSection>
                <DropdownSection>  
                  <DropdownItem
                    key="delete"
                    className="text-danger"
                    color="danger"
                    shortcut="⌘⇧D"
                    onClick={()=>removeToken()}
                  >
                    Log out
                  </DropdownItem>
                </DropdownSection>
              </DropdownMenu>
            </Dropdown>
            )}
          </nav>

          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
