// Dosya: app/api/admin/pending-schools/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const pendingSchools = await prisma.user.findMany({
    where: {
      role: "school",
      emailVerified: true,
      adminApproved: false,
    },
  });

  return NextResponse.json(pendingSchools);
}
