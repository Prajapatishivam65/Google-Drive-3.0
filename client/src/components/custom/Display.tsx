import React, { useState } from "react";

type Props = {
  contract: any;
  account: string;
};

const Display: React.FC<Props> = ({ contract, account }) => {
  // State to store retrieved file data
  const [data, setData] = useState("");

  /**
   * Retrieves files from the contract based on the provided address or user's account
   */
  const getFiles = async () => {
    try {
      // Initialize dataArray variable to store contract response
      let dataArray;

      // Get the address input element and its value
      const addressInput = document.querySelector(
        ".address"
      ) as HTMLInputElement;

      // Check if addressInput exists before accessing its value
      const otherAddress = addressInput?.value;

      // Logic was inverted. If otherAddress has a value, use it
      if (otherAddress) {
        // Fetch data for the entered address
        dataArray = await contract.display(otherAddress);
        console.log("Data from entered address:", dataArray);
      } else {
        // If no address is entered, use the connected account
        dataArray = await contract.display(account);
        console.log("Data from user account:", dataArray);
      }

      //Fixed typo in variable name (isEmpyty → isEmpty)
      const isEmpty = dataArray.length === 0;

      if (!isEmpty) {
        // Convert array to string and split by commas
        const str = dataArray.toString();
        const str_array = str.split(",");

        // Log the data arrays
        console.log("Parsed array:", str_array);
        console.log("Raw string:", str);

        // Bug fix: Actually update the state with the retrieved data
        setData(str);
      } else {
        alert("No Files To Display");
      }
    } catch (error) {
      // Bug fix: Add error handling
      console.error("Error fetching files:", error);
      alert("Error retrieving files. Check console for details.");
    }
  };

  return (
    <div>
      <h1>Image Display</h1>
      {/* Bug fix: Added missing class name to match the selector in getFiles */}
      <input type="text" className="address" placeholder="Enter Address" />

      <button onClick={getFiles}>
        <span>Get Files</span>
      </button>

      {/* Bug fix: Added actual display of the retrieved data */}
      {data && (
        <div className="display-container">
          <h3>Retrieved Files</h3>
          <p>{data}</p>
        </div>
      )}
    </div>
  );
};

export default Display;
