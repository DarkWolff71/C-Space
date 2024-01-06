export interface GetMembersResponse {
  usersInDifferentRoomsAndRequestHasBeenSent: {
    name: string;
    email: string;
    image: string | null;
  }[];
  usersInDifferentRoomsAndRequestHasNotBeenSent: {
    name: string;
    email: string;
    image: string | null;
  }[];
  ownersInSameRoom:
    | {
        name: string;
        email: string;
        image: string | null;
      }[]
    | undefined;
  editorsInSameRoomAndRequestHasBeenSent:
    | {
        name: string;
        email: string;
        image: string | null;
      }[]
    | undefined;
  editorsInSameRoomAndRequestHasNotBeenSent:
    | {
        name: string;
        email: string;
        image: string | null;
      }[]
    | undefined;
}

export type GetRoomsResponse = {
  editorRooms: {
    name: string;
    _count: {
      owners: number;
      editors: number;
      unpublishedVideos: number;
      joinRequests: number;
    };
  }[];
  ownerRooms: {
    name: string;
    _count: {
      owners: number;
      editors: number;
      unpublishedVideos: number;
      joinRequests: number;
    };
  }[];
} | null;

export type GetRoomMembersResponse = {
  owners: {
    name: string;
    image: string | null;
    email: string;
  }[];
  editors: {
    name: string;
    image: string | null;
    email: string;
  }[];
} | null;

export type GetUnpublishedVideosResponse = {
  videos: (
    | {
        title: string | null;
        privacyStatus: $Enums.VideoPrivacyStatus;
        id: string;
        description: string | null;
        tags: string[];
        thumbnailSize: number | null;
        thumbnailType: string | null;
        videoType: string | null;
        videoFileSize: number | null;
        videoFileName: string | null;
        categoryId: string | null;
        isEditable: boolean;
        sentForApproval: boolean | null;
        isApproved: boolean;
        approvedByOwners: {
          name: string;
          email: string;
        }[];
        _count: {
          approvedByOwners: number;
        };
        thumbnailS3Key: string | null;
      }
    | {
        thumbnailUrl: string;
        title: string | null;
        privacyStatus: $Enums.VideoPrivacyStatus;
        id: string;
        description: string | null;
        tags: string[];
        thumbnailSize: number | null;
        thumbnailType: string | null;
        videoType: string | null;
        videoFileSize: number | null;
        videoFileName: string | null;
        categoryId: string | null;
        isEditable: boolean;
        sentForApproval: boolean | null;
        isApproved: boolean;
        approvedByOwners: {
          name: string;
          email: string;
        }[];
        _count: {
          approvedByOwners: number;
        };
        thumbnailS3Key: string | null;
      }
  )[];
};

export type GetReceivedRequestsResponse = {
  joinRequests: {
    id: string;
    role: $Enums.Role;
    fromRoom: {
      name: string;
      owners?: {
        name: string;
        email: string;
      }[];
      editors?: {
        name: string;
        email: string;
      }[];
    };
  }[];
  joinRoomApproveRequests?: {
    id: string;
    displayOwners: boolean;
    displayEditors: boolean;
    role: $Enums.Role;
    toUser: {
      name: string;
      email: string;
    };
  }[];
  removeFromRoomApproveRequests?: {
    id: string;
    toUser: {
      name: string;
      email: string;
    };
  }[];
};

export type GetSentRequestsResponse = {
  requests: {
    id: string;
    displayOwners: boolean;
    displayEditors: boolean;
    role: $Enums.Role;
    toUser: {
      name: string;
      email: string;
    };
  }[];
};
