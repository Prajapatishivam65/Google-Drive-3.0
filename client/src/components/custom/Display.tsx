import React, { useState } from "react";

type Props = {
  contract: any;
  account: string;
};

type FileType = "image" | "video" | "audio" | "pdf" | "text" | "other";

const Display: React.FC<Props> = ({ contract, account }) => {
  // State to store retrieved files
  const [files, setFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  /**
   * Determines the file type based on the IPFS hash or URL
   */
  const getFileType = (ipfsUrl: string): FileType => {
    // Extract file extension if possible
    const hasExtension = ipfsUrl.includes(".");
    if (!hasExtension) return "other";

    const extension = ipfsUrl.split(".").pop()?.toLowerCase() || "";

    // Determine file type based on extension
    if (
      ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"].includes(extension)
    ) {
      return "image";
    } else if (["mp4", "webm", "ogg", "mov"].includes(extension)) {
      return "video";
    } else if (["mp3", "wav", "ogg", "m4a"].includes(extension)) {
      return "audio";
    } else if (extension === "pdf") {
      return "pdf";
    } else if (
      ["txt", "md", "json", "csv", "html", "js", "css", "ts"].includes(
        extension
      )
    ) {
      return "text";
    } else {
      return "other";
    }
  };

  /**
   * Retrieves files from the contract based on the provided address or user's account
   */
  const getFiles = async () => {
    try {
      setLoading(true);

      // Get the address input element and its value
      const addressInput = document.querySelector(
        ".address"
      ) as HTMLInputElement;

      // Check if addressInput exists and has a value
      const otherAddress = addressInput?.value.trim();

      // Use the provided address or default to the connected account
      const targetAddress = otherAddress || account;
      console.log(`Fetching files for address: ${targetAddress}`);

      // Fetch data from the contract
      const dataArray = await contract.display(targetAddress);
      console.log("Raw data from contract:", dataArray);

      // Check if the array is empty
      const isEmpty = dataArray.length === 0;

      if (!isEmpty) {
        // Convert array to string and split by commas
        const str = dataArray.toString();
        const str_array = str.split(",");
        console.log("Parsed array:", str_array);

        // Set the files array in state
        setFiles(str_array);
      } else {
        alert("No Files To Display");
        setFiles([]);
      }
    } catch (error) {
      console.error("Error fetching files:", error);
      alert("Error retrieving files. Check console for details.");
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Renders a preview component based on file type
   */
  const renderFilePreview = (fileUrl: string, index: number) => {
    // Format the IPFS gateway URL
    const gatewayUrl = fileUrl.startsWith("ipfs://")
      ? `https://gateway.pinata.cloud/ipfs/${fileUrl.substring(7)}`
      : fileUrl;

    const fileType = getFileType(fileUrl);

    return (
      <div className="relative pt-[75%] bg-gray-100 overflow-hidden">
        {fileType === "image" && (
          <img
            src={gatewayUrl}
            alt={`File ${index + 1}`}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://via.placeholder.com/300x225?text=Image+Preview+Failed";
            }}
          />
        )}

        {fileType === "video" && (
          <video
            src={gatewayUrl}
            className="absolute inset-0 w-full h-full object-cover"
            controls
            onError={(e) => {
              const target = e.target as HTMLElement;
              target.outerHTML = `<div class="absolute inset-0 flex items-center justify-center bg-gray-200"><div class="text-gray-500 text-center p-4">Video Preview Unavailable</div></div>`;
            }}
          />
        )}

        {fileType === "audio" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200 p-4">
            <div className="text-4xl text-gray-500 mb-2">🎵</div>
            <audio
              src={gatewayUrl}
              controls
              className="w-full max-w-xs"
              onError={(e) => {
                const target = e.target as HTMLElement;
                target.outerHTML = `<div class="text-gray-500 text-center">Audio Preview Unavailable</div>`;
              }}
            />
          </div>
        )}

        {fileType === "pdf" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200">
            <div className="text-4xl text-red-500 mb-2">📄</div>
            <div className="text-sm text-center">PDF Document</div>
          </div>
        )}

        {fileType === "text" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200">
            <div className="text-4xl text-blue-500 mb-2">📝</div>
            <div className="text-sm text-center">Text File</div>
          </div>
        )}

        {fileType === "other" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200">
            <div className="text-4xl text-gray-500 mb-2">📁</div>
            <div className="text-sm text-center">File</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        File Gallery
      </h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
          type="text"
          className="address flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter Address (or leave empty for your files)"
        />

        <button
          onClick={getFiles}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors duration-200 disabled:bg-blue-400"
        >
          {loading ? "Loading..." : "Get Files"}
        </button>
      </div>

      {files.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Files ({files.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {files.map((item, index) => (
              <a
                href={
                  item.startsWith("ipfs://")
                    ? `https://gateway.pinata.cloud/ipfs/${item.substring(7)}`
                    : item
                }
                key={index}
                target="_blank"
                rel="noopener noreferrer"
                className="block overflow-hidden rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                {renderFilePreview(item, index)}
                <div className="p-3 bg-white">
                  <p className="text-sm text-gray-600 truncate">
                    {item.split("/").pop() || item}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 truncate">{item}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading files...</p>
        </div>
      )}

      {!loading && files.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">
            No files to display. Enter an address and click "Get Files".
          </p>
        </div>
      )}
    </div>
  );
};

export default Display;
