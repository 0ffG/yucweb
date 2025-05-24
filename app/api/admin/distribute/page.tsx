// /api/admin/distribute/route.ts
import prisma  from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { schoolId, amount, moneyDonationId } = await req.json();

  const distribution = await prisma.moneyDistribution.create({
    data: {
      amount,
      schoolId,
      moneyDonationId,
    },
  });

  return NextResponse.json(distribution);
}
