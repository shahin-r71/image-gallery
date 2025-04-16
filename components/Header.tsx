"use client";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import PhotoCamera from "@mui/icons-material/PhotoCamera"; 
import IconButton from "@mui/material/IconButton"; 
import CloudinaryUploader from "./CloudinaryUploader"; 

interface HeaderProps {
	searchTerm: string;
	handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Header({
	searchTerm,
	handleSearchChange,
}: HeaderProps) {
	return (
		<AppBar
			position="static"
			sx={{ backgroundColor: "background.paper", color: "text.primary" }}
		>
			<Toolbar
				sx={{
					display: "flex",
					justifyContent: "space-between",
					flexWrap: "wrap",
					gap: 2,
				}}
			>
				{/* Left Side: Logo and Title */}
				<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
					<IconButton
						edge="start"
						color="inherit"
						aria-label="logo"
						sx={{ display: "inline-flex" }}
					>
						<PhotoCamera />
					</IconButton>
					<Typography
						variant="h6"
						component="div"
						sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
					>
						SnapGallery
					</Typography>
				</Box>

				{/* Right Side: Search and Upload */}
				<Stack
					direction="row"
					spacing={2}
					sx={{
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<TextField
						label="Search by Tag or Title"
						variant="outlined"
						size="small" // Make search input smaller
						value={searchTerm}
						onChange={handleSearchChange}
						sx={{
							width: { xs: "150px", sm: "200px" },
							"& .MuiInputBase-input": {
								paddingTop: "6.5px",
								paddingBottom: "6.5px",
							},
							"& .MuiInputLabel-outlined": {
								transform: "translate(14px, 8px) scale(1)",
							},
							"& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
								transform: "translate(14px, -6px) scale(0.75)",
							},
						}}
					/>
					<CloudinaryUploader />
				</Stack>
			</Toolbar>
		</AppBar>
	);
}
