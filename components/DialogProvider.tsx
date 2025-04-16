import * as React from "react";
import {
	DialogsProvider,
	useDialogs,
	DialogProps,
} from "@toolpad/core/useDialogs";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Alert from "@mui/material/Alert";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import ImgDialog from "./ImgDialog";
import {  toast } from "react-toastify";

// Update interface to match actual data (asset_id from Cloudinary)
interface ImageProps {
	asset_id: string; // Use asset_id
	public_id: string;
	secure_url: string;
	height: number;
	width: number;
	display_name: string;
}
interface DeleteError {
	id: string | null;
	error: string | null;
}


function MyCustomDialog({ open, onClose, payload }: DialogProps<DeleteError>) {
	return (
		<Dialog fullWidth open={open} onClose={() => onClose()}>
			<DialogTitle>Custom Error Handler</DialogTitle>
			<DialogContent>
				<Alert severity="error">
					{`An error occurred while deleting item "${payload.id}":`}
					<pre>{payload.error}</pre>
				</Alert>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => onClose()}>Close me</Button>
			</DialogActions>
		</Dialog>
	);
}

// Accept and pass down the callback prop
function ImageContent({
	image,
	onDeleteSuccess,
}: {
	image: ImageProps;
	onDeleteSuccess: () => void;
}) {
	const dialogs = useDialogs();
	const [isDeleting, setIsDeleting] = React.useState(false);


	const handleDelete = async (id: string) => {
		if (id) {
			const deleteConfirmed = await dialogs.confirm(
				`Are you sure you want to delete "${id}"?`
			);
			if (deleteConfirmed) {
				try {
					setIsDeleting(true);
					// call api to delete image
					const response = await fetch("/api/images", {
						method: "DELETE",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ id }),
					});

					if (!response.ok) {
						throw new Error("Failed to delete image");
					}

					toast.success("Image deleted successfully!", {
						position: "top-center",
						autoClose: 3000,
					});
					// Call the callback passed from ImageGallery to trigger refetch
					onDeleteSuccess();
				} catch (error) {
					const message =
						error instanceof Error
							? error.message
							: "Unknown error";
					await dialogs.open(MyCustomDialog, { id, error: message });
				} finally {
					setIsDeleting(false);
				}
			}
		}
	};
	return (
		<>
			<ImgDialog
				handleDelete={handleDelete}
				image={image}
				isLoading={isDeleting}
			/>
			
		</>
	);
}

// Accept and pass down the callback prop
export default function ImageDialogProvider({
	image,
	onDeleteSuccess,
}: {
	image: ImageProps;
	onDeleteSuccess: () => void;
}) {
	return (
		<DialogsProvider>
			<ImageContent image={image} onDeleteSuccess={onDeleteSuccess} />
		</DialogsProvider>
	);
}
