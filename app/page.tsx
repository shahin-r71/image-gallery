"use client"
import Footer from "@/components/Footer";
// import CloudinaryUploader from "@/components/CloudinaryUploader";
import Header from "@/components/Header";
import ImageGallery from "@/components/ImageGallery";
import { useState } from "react";
import { ToastContainer } from "react-toastify";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(event.target.value); // Update search term immediately for input responsiveness
  };
  return (
		<div className="h-[100vh]">
			<Header
				searchTerm={searchTerm}
				handleSearchChange={handleSearchChange}
			/>
			<ImageGallery searchTerm={searchTerm} />
			<Footer />
			<ToastContainer />
		</div>
  );
}
