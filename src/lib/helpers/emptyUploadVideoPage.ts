import {
  categoryIdState,
  isThumbnailAlreadyPresent,
  isThumbnailFileChanged,
  isVideoAlreadyPresent,
  isVideoFileChanged,
  privacyStatusState,
  thumbnailFile,
  thumbnailFileUrl,
  videoDescription,
  videoFile,
  videoFileSize,
  videoFileType,
  videoId,
  videoTags,
  videoTitle,
  videoUploadPercentage,
} from "@/recoil-store/atoms/upload-video";
import { useSetRecoilState } from "recoil";

const setCategoryIdState = useSetRecoilState(categoryIdState);
const setPrivacyStatusState = useSetRecoilState(privacyStatusState);
const setVideoDescription = useSetRecoilState(videoDescription);
const setVideoTitle = useSetRecoilState(videoTitle);
const setVideoTags = useSetRecoilState(videoTags);
const setVideoId = useSetRecoilState(videoId);
const setVideoFile = useSetRecoilState(videoFile);
const setVideoFileSize = useSetRecoilState(videoFileSize);
const setVideoFileType = useSetRecoilState(videoFileType);
const setIsVideoFileChanged = useSetRecoilState(isVideoFileChanged);
const setThumbnailFile = useSetRecoilState(thumbnailFile);
const setThumbnailFileUrl = useSetRecoilState(thumbnailFileUrl);
const setIsThumbnailFileChanged = useSetRecoilState(isThumbnailFileChanged);
const setVideoUploadPercentage = useSetRecoilState(videoUploadPercentage);
const setIsThumbnailAlreadyPresent = useSetRecoilState(
  isThumbnailAlreadyPresent
);
const setIsVideoAlreadyPresent = useSetRecoilState(isVideoAlreadyPresent);

export function emptyUploadVideoPage() {
  setCategoryIdState("");
  setVideoTitle("");
  setVideoFileSize(null);
  setPrivacyStatusState("private");
  setVideoDescription("");
  setIsThumbnailFileChanged;
  setThumbnailFileUrl("");
  setVideoTags([]);
  setVideoFile(null);
  setIsVideoFileChanged(false);
  setVideoFileType(null);
  setThumbnailFile(null);
  setVideoId(null);
  setVideoUploadPercentage(0);
  setIsThumbnailAlreadyPresent(false);
  setIsVideoAlreadyPresent(false);
}
