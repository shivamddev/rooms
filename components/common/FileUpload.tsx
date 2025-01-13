"use client";
import { UploadDropzone } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css";
import { X } from "lucide-react";
import Image from "next/image";

interface FileUploadProps {
  endPoint: "messageFile" | "serverImage";
  value: string;
  onChange: (url?: string) => void;
}

const FileUpload = ({ endPoint, value, onChange }: FileUploadProps) => {
  console.log(`value`, value);
  const fileType = value?.split(".").pop();

  if (value && fileType !== "pdf") {
    return (
      <div className="relative size-20 ">
        <Image
          src={value}
          alt="server image"
          fill
          priority
          className="rounded-full"
        />
        <button 
        onClick={() => onChange("")}
        className="bg-red-500 cursor-pointer absolute top-0 right-0 rounded-full p-1 shadow-sm text-white">
            <X className="size-4"/>
        </button>
      </div>
    );
  }
  return (
    <UploadDropzone
      endpoint={endPoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
      }}
      onUploadError={(error: Error) => {
        console.log(`error=> `, error);
      }}
    />
  );
};

export default FileUpload;
