import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma";
import { signupRequestValidator } from "@/validators/authenticationValidators";
import { hashPassword } from "@/lib/helpers/hashPassword";

export async function POST(req: NextRequest) {
  let parsedRequest = signupRequestValidator.safeParse(await req.json());

  if (!parsedRequest.success) {
    console.log(parsedRequest.error);
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  let { name, userName, email, password } = parsedRequest.data;

  let prisma = getPrismaClient();
  let dbQueryResult = await prisma.user.findFirst({
    where: {
      OR: [{ userName: userName }, { email: email }],
    },
    select: {
      userName: true,
      email: true,
    },
  });

  if (dbQueryResult) {
    let errorMessage: string;
    if (dbQueryResult.email == email) {
      errorMessage = "User already exists.";
    } else {
      errorMessage =
        "Username is already taken. Try with a different username.";
    }
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
  let hashedPassword: string;
  try {
    hashedPassword = await hashPassword(password);
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }

  await prisma.user.create({
    data: {
      userName: userName,
      email: email,
      name: name,
      password: hashedPassword,
    },
  });

  return NextResponse.json({ message: "Succefully created user" });
}
