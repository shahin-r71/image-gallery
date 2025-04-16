import { v2 as cloudinary } from "cloudinary";
import { NextResponse, NextRequest } from "next/server";
import { revalidatePath } from "next/cache";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const max_results = parseInt(searchParams.get("max_results") || "12", 10);
  const next_cursor = searchParams.get("next_cursor");
  const searchValue = searchParams.get("search");


  try {
    let expression = "folder:gallery";
    if (searchValue) expression += ` AND ${searchValue}`;
    let search = cloudinary.search
      .expression(expression)
      .sort_by("created_at", "desc")
      .max_results(max_results);

    if (next_cursor) {
      search = search.next_cursor(next_cursor);
    }

    const results = await search.execute();
    if (results.next_cursor) {
        return NextResponse.json({
        resources: results.resources,
        next_cursor: results.next_cursor,
        total_count: results.total_count,
        });
    }
    return NextResponse.json({
        resources: results.resources,
        total_count: results.total_count
    })  
  } catch (error) {
    console.error("Error fetching images:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const { id } = await request.json();

  if (!id) {
    return NextResponse.json(
      { error: "Image ID is required" },
      { status: 400 }
    );
  }

  try {
    const result = await cloudinary.uploader.destroy(id, { invalidate: true });
    revalidatePath('/');
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}
