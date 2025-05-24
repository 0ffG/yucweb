// /api/admin/money-donations/route.ts
import  prisma  from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const donations = await prisma.moneyDonation.findMany({
    include: {
      donor: {
        select: { name: true }
      },
      distributions: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(donations);
}
