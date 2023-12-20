export interface getMembersResponse {
  usersInDifferentRooms: {
    image: string | null;
    email: string | null;
    name: string | null;
  }[];
  usersInSameRoom: {
    editors:
      | {
          image: string | null;
          email: string | null;
          name: string | null;
        }[]
      | undefined;
    owners:
      | {
          name: string | null;
          email: string | null;
          image: string | null;
        }[]
      | undefined;
  };
}
