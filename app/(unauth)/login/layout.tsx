"use client";
import "@/styles/style.css";
import { useEffect } from "react";

import AOS from "aos";
import "aos/dist/aos.css";
import Header from "@/components/template/ui/header";
import PageIllustration from "@/components/template/page-illustration";
import Footer from "@/components/template/ui/footer";

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

        {children}
      </main>

      <Footer />
    </>
  );
}
