import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { CldImage } from "next-cloudinary";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";

interface ImageProps {
	asset_id: string;
	public_id: string;
	secure_url: string;
	height: number;
	width: number;
	display_name: string;
}

export default function ImgDialog({
	handleDelete,
	image,
	isLoading,
}: {
	handleDelete: (id: string) => void;
	image: ImageProps;
	isLoading?: boolean; // Add isLoading prop
}) {
	const [open, setOpen] = React.useState(false);


	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<Box>
			<Button variant="outlined" onClick={handleClickOpen}>
				{/* show image */}
				<CldImage
					className="flex flex-wrap justify-center"
					src={image.secure_url}
					height={image.height}
					width={image.width}
					sizes="(min-width: 480px) 50vw,
                    (min-width: 728px) 33vw,
                    (min-width: 976px) 25vw,
                    100vw"
					alt={image.display_name}
				/>
			</Button>
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="dialog-title"
				sx={{
					width: "100%",
				}}
			>
				<DialogTitle
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						width: "100%",
						padding: 2,
					}}
				>
					<Typography variant="h6" component="p">
						{image.display_name}
					</Typography>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "flex-end",
							gap: 1,
						}}
					>
						<Tooltip title="Delete image">
							<span>
								<IconButton
									onClick={() =>
										handleDelete(image.public_id)
									}
									color="error"
									disabled={isLoading}
									aria-label="delete image"
								>
									{isLoading ? (
										<CircularProgress size={24} />
									) : (
										<DeleteIcon />
									)}
								</IconButton>
							</span>
						</Tooltip>
						<Tooltip title="Close">
							<IconButton
								onClick={handleClose}
								color="primary"
								aria-label="close dialog"
							>
								<CloseIcon />
							</IconButton>
						</Tooltip>
					</Box>
				</DialogTitle>
				<DialogContent sx={{ padding: 2 }}>
					<Card elevation={3}>
						<CardMedia
							sx={{
								height: 500,
								width: "100%",
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								overflow: "hidden",
								bgcolor: "rgba(0,0,0,0.03)",
							}}
							component={() => (
								<CldImage
									className="w-full h-auto max-h-[500px] object-cover"
									src={image.secure_url}
									height={image.height}
									width={image.width}
									sizes="(min-width: 480px) 50vw, (min-width: 728px) 33vw, (min-width: 976px) 25vw, 100vw"
									alt={image.display_name}
									priority
								/>
							)}
						/>
						<CardContent>
							<Typography variant="body2" color="text.secondary">
								{`Dimensions: ${image.width} × ${image.height}`}
							</Typography>
						</CardContent>
					</Card>
				</DialogContent>
			</Dialog>
		</Box>
	);
}
