import { NextResponse } from "next/server";
import  prisma  from "@/lib/prisma";

export async function GET() {
  const distributions = await prisma.moneyDistribution.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      school: { select: { name: true } },
      moneyDonation: { select: { amount: true, donorId: true } },
    },
  });

  return NextResponse.json(distributions);
}
