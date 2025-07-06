import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/next-auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Await params to get the id
    const { id: snapshotId } = await params;
    
    if (!snapshotId) {
      return NextResponse.json(
        { error: "Snapshot ID is required" },
        { status: 400 }
      );
    }

    // Check if snapshot exists and belongs to the user
    const snapshot = await prisma.snapshot.findFirst({
      where: {
        id: snapshotId,
        userId: session.user.id,
      },
    });

    if (!snapshot) {
      return NextResponse.json(
        { error: "Snapshot not found" },
        { status: 404 }
      );
    }

    // Delete the snapshot
    await prisma.snapshot.delete({
      where: {
        id: snapshotId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Snapshot deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting snapshot:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
