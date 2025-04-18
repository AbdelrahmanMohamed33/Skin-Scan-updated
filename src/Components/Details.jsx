import axios from "axios";
import { useEffect, useState } from "react";
import { useParams,Link } from "react-router-dom";
import { getToken } from "../Helper/Tokens";
import load from "../assets/img/load.jpg";
import Domain from "../Constans/Domain";
const LoadingIcon = () => (
  <div
    className="loader flex justify-center items-center h-screen"
    style={{ paddingBottom: "150px" }}
  >
    <img src={load} className="w-16 h-16" alt="Loading..." />
  </div>
);
export default function Details() {
  const { id } = useParams();
  const [nameRes, setNameRes] = useState("");
  const [descriptionRes, setDescriptionRes] = useState("");
  const [preventionsRes, setPreventionsRes] = useState([]);
  const [imageRes, setImageRes] = useState("");
  const [riskRes, setRiskRes] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await axios.get(
          `${Domain.resoureseUrl()}/api/Wound/get-id?id=${id}`,
          {
            headers: {
              Authorization: `Bearer ${getToken("access")}`,
            },

          }
        );
        console.log(response.data);
        if (response.status === 200) {
          const data = response.data.data;
          setDescriptionRes(data["description"]);
          setNameRes(data["name"]);
          setPreventionsRes(data["preventions"]);
          setImageRes(data["image"]);
          setRiskRes(data["risk"]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const getImageType = (base64String) => {
    if (base64String.startsWith("/9j/")) {
      return "jpeg"; 
    } else if (base64String.startsWith("iVBORw0K")) {
      return "png"; 
    } else if (base64String.startsWith("R0lGOD")) {
      return "gif"; // GIF image
    }
    return "jpeg"; // Default fallback to JPEG
  };

  return (
    <>
      {loading ? (
        <LoadingIcon />
      ) : (
        <div className="container mx-auto p-4 pt-40">
          <h1 className="text-4xl font-semibold text-center lg:text-start mb-8 text-blue-800">
           More Details...
          </h1>
          <div className="p-10 bg-gray-100 rounded-md">
            <p>
              <strong className="text-blue-500">Name:</strong> {nameRes}
            </p>
            <p>
              <strong className="text-blue-500">Description:</strong> {descriptionRes}
            </p>
            <p>
              <strong className="text-blue-500">Risk:</strong> {riskRes}
            </p>
            {imageRes && (
              <img
                src={`data:image/${getImageType(imageRes)};base64,${imageRes}`}
                alt="Burn Image"
                className="mt-2 w-48 h-48 object-cover rounded-md"
              />
            )}
            <div className="mt-4 ">
              <strong className="text-blue-500" >Preventions:</strong>
              <ul className="list-disc ml-4">
                {preventionsRes.map((prevention, idx) => (
                  <li key={idx}>{prevention}</li>
                ))}
              </ul>
            </div>
            <div className="mt-10 text-center mb-10">
            <Link to="/doctors" className="text-blue-900 hover:underline rounded py-2 px-4 bg-green-500" style={{marginTop:"150px"}}>
              Ask a Doctor
           </Link>
           <Link to="/blogs" className="text-black hover:underline rounded py-2 px-4 text-blue-400" style={{marginTop:"150px"}}>
              Describe More...
           </Link>
           </div>
          </div>

        </div>
      )}
    </>
  );
}
