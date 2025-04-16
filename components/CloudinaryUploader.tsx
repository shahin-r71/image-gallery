"use client";

import Button from "@mui/material/Button";
import { CldUploadButton } from "next-cloudinary";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const cloudPresetName = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

const CloudinaryUploader = () => {
  return (


		<CldUploadButton
			options={{ multiple: true }}
			onCloseAction={() => {
				window.location.reload();
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
