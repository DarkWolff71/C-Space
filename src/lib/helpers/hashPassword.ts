import bcrypt from "bcrypt";

export function hashPassword(password: string): Promise<string> {
  return new Promise((res, rej) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        rej("Error occured while hashing");
      } else {
        res(hash);
      }
    });
  });
}
