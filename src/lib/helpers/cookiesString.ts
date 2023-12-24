import { cookies } from "next/headers";

export function getCookiesString() {
  const cookieString = cookies()
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  return cookieString;
}
