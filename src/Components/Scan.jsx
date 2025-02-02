import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import img from "../assets/img/upload.jpg";
import load from "../assets/img/load.jpg";
import { isTokenExpired, getToken } from "../Helper/Tokens";

const Scan = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [precessImage, setPrecessImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);
  const navigate = useNavigate();

  // Server response
  const [nameRes, setNameRes] = useState("");
  const [descriptionRes, setDescriptionRes] = useState("");
  const [preventionsRes, setPreventionsRes] = useState([]);
  const [imageRes, setImageRes] = useState("");
  const [riskRes, setRiskRes] = useState("");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setPrecessImage(file);
    const imageUrl = URL.createObjectURL(file);
    setUploadedImage(imageUrl);
  };

  const handleUpload = async () => {
    setIsLoading(true);
    if (isTokenExpired(getToken("access"))) {
      navigate("/login");
      return;
    }

    if (!selectedModel) {
      setErrorMessage("Please select a model to upload.");
      setIsLoading(false);
      return;
    }

    const urlMap = {
      Burn: "https://gp-backend-api.onrender.com/api/Wound/upload-burn",
      Type: "https://gp-backend-api.onrender.com/api/Wound/upload-type",
      SkinDisease: "https://gp-backend-api.onrender.com/api/Wound/upload-skin"
    };

    try {
      const formData = new FormData();
      formData.append("file", precessImage, "image.jpg");
      const url = urlMap[selectedModel];
      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${getToken("access")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        const data = response.data.data || {};
        setNameRes(data.name || "No name available");
        setDescriptionRes(data.description || "No description available");
        setPreventionsRes(data.preventions || []);
        setImageRes(data.image || "");
        setRiskRes(data.risk || "No risk data available");

        // Check if the response indicates no valid data
        if (
          data.name === "No name available" &&
          data.description === "No description available" &&
          data.preventions.length === 0 &&
          data.risk === "No risk data available"
        ) {
          setErrorMessage("Please choose a disease image and select the suitable model.");
        } else {
          setErrorMessage(null); // Clear any previous error message
        }
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setErrorMessage(error.response?.data?.data?.message || error.message || "An error occurred");
    }
  };

  useEffect(() => {
    if (isTokenExpired(getToken("access"))) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row justify-between items-center lg:px-32 px-5 gap-5">
      <div className="w-full lg:w-2/5 space-y-6 p-5 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-semibold text-center lg:text-left mb-4">Scan Your Disease</h1>

        {!uploadedImage ? (
          <div className="flex flex-col items-center">
            <label
              htmlFor="file-upload"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer mt-4"
            >
              Choose image...
            </label>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        ) : (
          ""
        )}

        {uploadedImage && (
          <div className="mt-4">
            <button
              onClick={handleUpload}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded cursor-pointer mt-2"
            >
              Upload
            </button>
            <div className="mt-4">
              <h2 className="text-lg font-semibold">Select Model:</h2>
              <div className="flex gap-2 mt-2">
                {["Burn", "Type", "Skin Disease"].map((model) => (
                  <button
                    key={model}
                    onClick={() => setSelectedModel(model)}
                    className={`py-2 px-4 rounded ${selectedModel === model ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                  >
                    {model} Model
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="mt-4 text-red-500 text-center">{errorMessage}</div>
        )}
      </div>

      <div className="w-full lg:w-2/5 p-5">
        {uploadedImage ? (
          <img
            className="rounded-lg transition-transform duration-300 ease-in-out transform hover:scale-105"
            style={{ width: "100%", height: "auto" }}
            src={uploadedImage}
            alt="Uploaded"
          />
        ) : (
          <img className="rounded-lg" src={img} alt="Default" style={{ width: "100%", height: "auto" }} />
        )}
      </div>

      {/* Centered content for results */}
      <div className="flex justify-center items-center min-h-[200px] p-8 lg:w-1/5">
        <div className="text-center w-full">
          {isLoading ? (
            <div>
              <img width={200} height={200} src={load} alt="Loading" />
            </div>
          ) : (
            <div className="space-y-4 bg-gray-200 px-4 py-4 rounded mt-4">
              {uploadedImage && !nameRes && (
                <h5 className="">Upload to show details</h5>
              )}
              {nameRes && (
                <>
                  <h2 className="text-2xl font-semibold text-blue-600 ">Name: {nameRes || "No name available"}</h2>
                  <p className="text-lg">{descriptionRes || "No description available"}</p>
                  <div>
                    <h3 className="text-xl font-semibold text-blue-600">Preventions</h3>
                    <ul className="list-disc list-inside">
                      {preventionsRes.length > 0 ? (
                        preventionsRes.map((prevention, index) => (
                          <li key={index}>{prevention}</li>
                        ))
                      ) : (
                        <li>No preventions available</li>
                      )}
                    </ul>
                  </div>
                  <h3 className="text-xl font-semibold text-blue-600">Risk Level</h3>
                  <p className="text-lg">Risk Level: {riskRes || "No risk data available"}</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Scan;