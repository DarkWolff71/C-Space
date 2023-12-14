"use client";
import axios from "axios";
import { ChangeEvent } from "react";
import { AxiosRequestConfig } from "axios";

async function uploadToS3(e: ChangeEvent<HTMLFormElement>) {
  const formData = new FormData(e.target);

  const file = formData.get("file");

  if (!file) {
    return null;
  }

  //   @ts-ignore
  const fileType = encodeURIComponent(file.type);

  const { data } = await axios.get(`/api/test-aws?fileType=${fileType}`);

  const { uploadUrl, key } = data;
  console.log("line 20");

  const config: AxiosRequestConfig = {
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent?.total ?? 100
      );
      console.log(`Upload progress: ${percentCompleted}%`);
      // You can update your UI with the upload progress if needed
    },
  };

  await axios.put(uploadUrl, file, config);
  console.log("line 23");

  return key;
}

export default function Upload() {
  async function handleSubmit(e: ChangeEvent<HTMLFormElement>) {
    e.preventDefault();

    const key = await uploadToS3(e);
  }

  return (
    <>
      <p>Please select file to upload</p>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="video/*,.mkv" name="file" />
        <button type="submit" className="bg-slate-500 rounded p-5 ">
          Upload
        </button>
      </form>
    </>
  );
}
