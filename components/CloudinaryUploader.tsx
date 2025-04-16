"use client";

import Button from "@mui/material/Button";
import { CldUploadButton } from "next-cloudinary";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { toast } from "react-toastify";
import { useRef } from "react";

const cloudPresetName = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

const CloudinaryUploader = () => {
	const uploadSuccessRef = useRef<boolean>(false);

	return (
		<CldUploadButton
			options={{ multiple: true }}
			onSuccess={() => {
				uploadSuccessRef.current = true;
			}}
			onCloseAction={() => {
				if (uploadSuccessRef.current) {
					toast.success("Successfully uploaded!", {
						position: "top-center",
						autoClose: 1200, 
					});
					uploadSuccessRef.current = false;
					
					// Start reload after a very short delay to ensure toast appears
					setTimeout(() => {
						window.location.reload();
					}, 1200); // Just enough time for toast to begin showing
				}
			}}
			uploadPreset={cloudPresetName}
		>
			<Button
				component="label"
				variant="contained"
				tabIndex={-1}
				startIcon={<CloudUploadIcon />}
			>
				Upload files
			</Button>
		</CldUploadButton>
	);
};

export default CloudinaryUploader;
