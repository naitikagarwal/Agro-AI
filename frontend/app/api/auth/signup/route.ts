import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  return NextResponse.redirect(
    new URL("/api/auth/signup", process.env.NEXTAUTH_URL),
  );
}

export async function POST(request: Request) {
  const body = await request.json();
  const { fullName, username, email, password } = body;

  if (!fullName || !username || !email || !password) {
    return new NextResponse("Missing fields", { status: 400 });
  }

  const existingUserByUsername = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (existingUserByUsername) {
    return new NextResponse("Username already exists", { status: 400 });
  }

  const existingUserByEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUserByEmail) {
    return new NextResponse("Email id already exists", { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      fullName,
      username,
      email,
      password: hashedPassword,
    },
  });

  return NextResponse.json(user);
}
