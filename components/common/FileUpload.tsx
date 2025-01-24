"use client";
import { UploadDropzone } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css";
import { FileIcon, FilesIcon, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface FileUploadProps {
  endPoint: "messageFile" | "serverImage";
  value: string;
  onChange: (url?: string) => void;
}

const FileUpload = ({ endPoint, value, onChange }: FileUploadProps) => {
  console.log(`value=***`, value);
  const fileType = value?.split("-");
  console.log(`fileType==`, fileType);
  const [type, setType] = useState("");
  console.log(`new file type`, type);

  if (value && type !== "pdf") {
    console.log(`if block-`);
    return (
      <div className="relative size-20 ">
        <Image
          src={fileType[0]}
          alt="server image"
          fill
          priority
          className="rounded-full"
        />
        <button
          onClick={() => {
            onChange(""), setType("");
          }}
          className="bg-red-500 cursor-pointer absolute top-0 right-0 rounded-full p-1 shadow-sm text-white"
        >
          <X className="size-4" />
        </button>
      </div>
    );
  }

  if (value && type === "pdf") {
    console.log(`else block`);
    console.log(`here---`, type);
    return (
      <div className="  flex   items-center p-2 mt-2 rounded-md relative bg-background/10 ">
        <FilesIcon className="size-10 fill-indigo-200 stroke-indigo-400" />
        <a
          href={fileType[0]}
          target="_blank"
          className="ml-2  !text-wrap text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
          rel="noopener noreferrer"
        >
          <p className="text-wrap overflow-hidden">
            {value.length > 50 ? value.slice(0, 50) + "..." : fileType[0]}
          </p>
        </a>
        <button
          onClick={() => {
            onChange("");
            setType("");
          }}
          className="bg-red-500 cursor-pointer absolute -top-2 -right-2 rounded-full p-1 shadow-sm text-white"
        >
          <X className="size-4" />
        </button>
      </div>
    );
  }
  return (
    <UploadDropzone
      endpoint={endPoint}
      onClientUploadComplete={(res) => {
        console.log(`fileType====`, res?.[0])
        let typee = res?.[0].type;
        let chunkType = typee.split("/");
        console.log(`chunkType == `, chunkType);
        setType(chunkType[1]);
        // console.log(`uploadthing res == `, res?.[0]);
        onChange(`${res?.[0].url}-${chunkType[1]}`);
      }}
      onUploadError={(error: Error) => {
        console.log(`error=> `, error);
      }}
    />
  );
};

export default FileUpload;
