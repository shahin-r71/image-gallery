"use client";

import { useState, useEffect, useCallback } from "react";
import ImageDialogProvider from "./DialogProvider";
import Box from "@mui/material/Box";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import CloudinaryUploader from "./CloudinaryUploader";

// Define interfaces for expected Cloudinary API response structure
interface CloudinaryResource {
	asset_id: string;
	public_id: string;
	secure_url: string;
	height: number;
	width: number;
	display_name: string;
}
interface ImgGalleryProp {
	searchTerm: string;
}

// --- Simple Debounce Hook ---
function useDebounce<T>(value: T, delay: number): T {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		// Cleanup function to clear the timeout if value changes before delay ends
		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]); // Re-run effect if value or delay changes

	return debouncedValue;
}

export default function ImageGallery({ searchTerm }: ImgGalleryProp) {
	const [images, setImages] = useState<CloudinaryResource[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [pageCursors, setPageCursors] = useState<
		Record<number, string | undefined>
	>({});
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [totalCount, setTotalCount] = useState<number>(0);

	// Use the debounce hook
	const debouncedSearchTerm = useDebounce(searchTerm, 1000); // 1000ms delay

	const theme = useTheme();

	// --- Media Queries for Responsive Columns ---
	const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg")); // >= 1200px
	const isMediumScreen = useMediaQuery(theme.breakpoints.up("md")); // >= 900px
	// const isSmallScreen = useMediaQuery(theme.breakpoints.up("sm")); // >= 600px

	// Determine columns based on screen size
	const columns = isLargeScreen ? 4 : isMediumScreen ? 3 : 2; // Default to 2 on xs screens

	const fetchImages = useCallback(
		async (pageNum: number, currentSearchTerm: string) => {
			setLoading(true);
			setError(null); // Clear previous errors on new fetch

			const cursor = pageNum === 1 ? undefined : pageCursors[pageNum - 1];

			let apiUrl = "/api/images";
			const params = new URLSearchParams();
			params.append("max_results", "12");
			if (cursor) {
				params.append("next_cursor", cursor);
			}
			if (currentSearchTerm) {
				params.append("search", currentSearchTerm);
			}
			apiUrl = `${apiUrl}?${params.toString()}`;

			console.log(
				`Fetching page ${pageNum}, Search: "${currentSearchTerm}", URL: ${apiUrl}`
			);

			try {
				const response = await fetch(apiUrl);
				// Try parsing JSON even if !response.ok to get error message from API
				const data = await response.json();

				if (!response.ok) {
					throw new Error(
						data.error ||
							`Failed to fetch images: ${response.statusText}`
					);
				}

				// Only update state on successful fetch
				setImages(data.resources || []); // Default to empty array if resources missing
				setTotalCount(data.total_count || 0); // Use total_count from response

				// Store cursor correctly
				if (data.next_cursor) {
					setPageCursors((prev) => ({
						...prev,
						[pageNum]: data.next_cursor,
					}));
				}

			} catch (err) {
				console.error(
					`Error fetching page ${pageNum} with search "${currentSearchTerm}":`,
					err
				);
				const message =
					err instanceof Error
						? err.message
						: "An unknown error occurred";
				setError(message);
				setImages([]); // Clear images on error
				setTotalCount(0);
				setPageCursors({}); // Clear cursors on error
			} finally {
				setLoading(false);
			}
		},
		[pageCursors] // Keep pageCursors dependency for internal logic
	);

	// --- Effect to Reset Pagination on Search Change ---
	useEffect(() => {
		// Reset page to 1 ONLY when the debounced search term *actually* changes
		// This prevents resetting on initial load or if the term settles back to the same value
		console.log(
			"Debounced search term changed to:",
			debouncedSearchTerm,
			"Resetting page."
		);
		setCurrentPage(1);
		setPageCursors({}); // Clear cursors for the new search results
	}, [debouncedSearchTerm]); // Run only when debounced term changes

	// --- Effect to Fetch Data on Page or Debounced Search Change ---
	useEffect(() => {
		// Fetch ONLY when currentPage or the debouncedSearchTerm changes.
		// DO NOT include fetchImages here.
		console.log(
			`Effect triggered: Fetching page ${currentPage} for search "${debouncedSearchTerm}"`
		);
		fetchImages(currentPage, debouncedSearchTerm);
	}, [currentPage, debouncedSearchTerm]);

	// Calculate total pages AFTER totalCount is fetched
	const totalPage = totalCount > 0 ? Math.ceil(totalCount / 12) : 0;

	// --- Event Handlers ---

	const handlePageClick = (pageNum: number) => {
		if (pageNum === currentPage || loading) return;
		setCurrentPage(pageNum);
	};

	// handleImageDeleted depends on fetchImages, so fetchImages uses useCallback
	const handleImageDeleted = useCallback(() => {
		console.log(
			`Image deleted, re-fetching page ${currentPage} with search "${debouncedSearchTerm}"...`
		);
		
		fetchImages(currentPage, debouncedSearchTerm);
	}, [currentPage, debouncedSearchTerm, fetchImages]); // fetchImages needed here

	// --- Render Logic ---
	if (loading && images.length === 0)
		return (
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					height: "50vh",
				}}
			>
				<CircularProgress size={60} thickness={4} />
				<Typography variant="h6" sx={{ mt: 2 }}>
					Loading Images...
				</Typography>
			</Box>
		); // Show loading only on initial load
	if (error)
		return (
			<div className="text-center mt-8 text-red-500">Error: {error}</div>
		);

	return (
		<main className="flex items-center justify-center flex-col w-full h-[85vh]">
			{/* ... (heading - maybe update based on search?) ... */}
			<h2 className="text-2xl text-center mt-4 mb-2">
				{debouncedSearchTerm
					? `Results for "${debouncedSearchTerm}"`
					: ""}
			</h2>
			{/* Show "No images found" only when not loading and images array is empty */}
			{!loading && images.length === 0 && (
				<Typography variant="h6" sx={{ mt: 2, color: "red" }}>
					No images found
					{debouncedSearchTerm ? (
						` matching "${debouncedSearchTerm}"`
					) : (
						<CloudinaryUploader />
					)}
					.
				</Typography>
			)}

			{/* Image Grid - Only render if images exist */}
			{images.length > 0 && (
				<Box
					sx={{
						width: "90%",
						maxWidth: "1200px",
						maxHeight: "80vh",
						overflowY: "scroll",
						margin: "auto",
						padding: 2,
						"&::-webkit-scrollbar": {
							width: "4px",
						},
						"&::-webkit-scrollbar-track": {
							boxShadow: "inset 0 0 6px rgba(0,0,0,0.1)",
							borderRadius: "10px",
						},
						"&::-webkit-scrollbar-thumb": {
							backgroundColor: "rgba(0,0,0,.3)",
							borderRadius: "10px",
							outline: "1px solid slategrey",
						},
					}}
				>
					<ImageList variant="masonry" cols={columns} gap={8}>
						{images.map((img) => (
							<ImageListItem key={img.asset_id}>
								<ImageDialogProvider
									image={img}
									onDeleteSuccess={handleImageDeleted}
								/>
							</ImageListItem>
						))}
					</ImageList>
				</Box>
			)}

			{/* Pagination Controls - Only show if multiple pages exist */}
			{totalPage > 1 && (
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						padding: "16px",
					}}
				>
					{Array.from({ length: totalPage }, (_, index) => {
						const pageNum = index + 1;
						return (
							<button
								key={pageNum}
								onClick={() => handlePageClick(pageNum)}
								style={{
									margin: "0 4px",
									padding: "6px 12px",
									cursor: loading ? "not-allowed" : "pointer",
									fontWeight:
										currentPage === pageNum
											? "bold"
											: "normal",
									border: "1px solid #ccc",
									background:
										currentPage === pageNum
											? "#eee"
											: "white",
								}}
								disabled={loading}
							>
								{pageNum}
							</button>
						);
					})}
				</div>
			)}
		</main>
	);
}
