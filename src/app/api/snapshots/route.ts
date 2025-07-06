import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/next-auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation schema for creating snapshots
const createSnapshotSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  contractAddress: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid contract address"),
  network: z.enum(["Monad", "Ethereum", "Base", "Abstract"]),
  totalOwners: z.number().int().positive(),
  totalTokens: z.number().int().positive(),
  tokenType: z.string(),
  collectionName: z.string().optional(),
  collectionSymbol: z.string().optional(),
  snapshotData: z.object({
    owners: z.array(z.any()),
    metadata: z
      .object({
        name: z.string().optional(),
        symbol: z.string().optional(),
        totalSupply: z.number().optional(),
        tokenType: z.string().optional(),
        contractDeployer: z.string().optional(),
        deployedBlockNumber: z.number().optional(),
      })
      .optional(),
  }),
});

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = createSnapshotSchema.parse(body);

    // Create snapshot in database
    const snapshot = await prisma.snapshot.create({
      data: {
        userId: session.user.id,
        name: validatedData.name,
        contractAddress: validatedData.contractAddress,
        network: validatedData.network,
        totalOwners: validatedData.totalOwners,
        totalTokens: validatedData.totalTokens,
        tokenType: validatedData.tokenType,
        collectionName: validatedData.collectionName,
        collectionSymbol: validatedData.collectionSymbol,
        snapshotData: validatedData.snapshotData,
      },
    });

    return NextResponse.json({
      success: true,
      data: snapshot,
    });
  } catch (error) {
    console.error("Error creating snapshot:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's snapshots
    const snapshots = await prisma.snapshot.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: snapshots,
    });
  } catch (error) {
    console.error("Error fetching snapshots:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
