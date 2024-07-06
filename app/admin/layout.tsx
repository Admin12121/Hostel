"use client";
import "@/styles/style.css";
import { useEffect } from "react";

import AOS from "aos";
import "aos/dist/aos.css";
import Header from "@/components/template/ui/header";
import PageIllustration from "@/components/template/page-illustration";
import Footer from "@/components/template/ui/footer";
import { Card, CardBody, Link } from "@nextui-org/react";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    AOS.init({
      once: true,
      disable: "phone",
      duration: 600,
      easing: "ease-out-sine",
    });
  });

  return (
    <>
      <Header />
      <main className="grow">
        <PageIllustration />
        <div className="flex w-full h-full pt-20 px-5 min-h-[100vh] gap-3">
          <Card className="w-80 h-full min-h-[50vh]">
            <CardBody className="flex flex-col gap-3">
              <Link
                href="/admin"
                color="foreground"
                className="p-3 hover:bg-zinc-800 rounded-lg"
              >
                Home
              </Link>
              <Link
                href="/admin/users"
                color="foreground"
                className="p-3 hover:bg-zinc-800 rounded-lg"
              >
                Users
              </Link>
              <Link
                href="/admin/payments"
                color="foreground"
                className="p-3 hover:bg-zinc-800 rounded-lg"
              >
                Payments
              </Link>
            </CardBody>
          </Card>
          <section>{children}</section>
        </div>
      </main>
    </>
  );
}
