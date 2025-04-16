import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Container from "@mui/material/Container";

function Copyright() {
	return (
		<Typography variant="body2" color="gray[500]" align="center">
			{"Copyright © "}
			<Link color="primary" href="#">
				SnapGallery
			</Link>{" "}
			{new Date().getFullYear()}
			{"."}
		</Typography>
	);
}

export default function Footer() {
	return (
		<Box
			component="footer"
			sx={{
				py: 2, 
				px: 2, 
				mt: "auto", 
                position: "fixed",
                bottom: 0,
                width: "100%",
                backgroundColor: (theme) =>
					theme.palette.mode === "light"
						? theme.palette.secondary.main
						: theme.palette.grey[800],
			}}
		>
			<Container maxWidth="sm">
				<Copyright />
			</Container>
		</Box>
	);
}
