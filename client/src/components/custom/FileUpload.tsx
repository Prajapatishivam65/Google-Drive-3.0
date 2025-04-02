import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Upload, FileText, Check } from "lucide-react";
import axios from "axios";
import Display from "./Display";

type Props = {
  contract: any;
  account: string;
  provider: any;
};

const FileUpload = ({ contract, account, provider }: Props) => {
  const [fileName, setFileName] = useState<string>("No Files Selected");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !contract || !provider) {
      alert(
        "Please select a file and ensure the contract and provider are available."
      );
      return;
    }
    //* Logic to handle file upload using contract and provider

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const resultFile = await axios({
        method: "POST",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: formData,
        headers: {
          pinata_api_key: "b0e21816a551f6c904a8",
          pinata_secret_api_key:
            "bb7e96820a70540dca7e1cf16ab84dfbdd399a6696199a5a5c066b015af3b029",
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Uploading file:", fileName);
      console.log("File uploaded successfully:", resultFile.data.IpfsHash);

      const Filehash = `ipfs://${resultFile.data.IpfsHash}`;

      contract.add(account, Filehash);
      setFileName("No Files Selected");
      setFile(null);
      setUploading(false);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file. Please try again.");
      setUploading(false);
    }
  };

  const retrieveFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    console.log("Selected file:", selectedFile);
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(selectedFile as Blob);
    reader.onloadend = () => {
      setFile(e.target.files?.[0] || null);
    };
    setFileName(e.target.files?.[0]?.name || "No Files Selected");
    console.log("File name:", e.target.files?.[0]?.name);
    e.preventDefault();
  };

  return (
    <>
      <Card className="max-w-md mx-auto mt-10 shadow-lg border border-gray-200">
        <CardHeader className="bg-gray-50 border-b border-gray-200">
          <CardTitle className="text-center text-xl font-semibold flex items-center justify-center gap-2">
            <Upload size={20} />
            File Upload
          </CardTitle>
          <CardDescription className="text-center text-gray-500">
            Upload your files to IPFS and blockchain
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <Input
                type="file"
                disabled={!account || uploading}
                onChange={retrieveFile}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="flex flex-col items-center justify-center gap-2">
                  {file ? (
                    <FileText size={40} className="text-blue-500" />
                  ) : (
                    <Upload size={40} className="text-gray-400" />
                  )}
                  <span className="text-sm font-medium">
                    {!account
                      ? "Connect wallet to upload"
                      : file
                      ? "File selected"
                      : "Click to select a file"}
                  </span>
                  <span className="text-xs text-gray-500 mt-1 break-all max-w-full">
                    {fileName !== "No Files Selected"
                      ? fileName
                      : "Supported formats: All file types"}
                  </span>
                </div>
              </label>
            </div>
            <Button
              type="submit"
              disabled={!account || !file || uploading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition-colors"
            >
              {uploading ? (
                <div className="flex items-center justify-center gap-2">
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  <span>Uploading...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  {file ? <Check size={16} /> : <Upload size={16} />}
                  <span>{file ? "Upload to IPFS" : "Select a file first"}</span>
                </div>
              )}
            </Button>
            {!account && (
              <p className="text-xs text-center text-red-500">
                Please connect your wallet to upload files
              </p>
            )}
          </form>
        </CardContent>
      </Card>
      <Display contract={contract} account={account} />
    </>
  );
};

export default FileUpload;
