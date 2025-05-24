// /api/admin/material-donations/route.ts
import prisma  from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const donations = await prisma.materialDonation.findMany({
    include: {
      donor: {
        select: { name: true }
      },
      school: {
        select: { name: true }
      }
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(donations);
}
