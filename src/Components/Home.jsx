import React, { useState } from "react";
import About from './About';
import Blogs from './Blogs';
import Doctors from './Doctors';
import Feedback from './Feedback';
import Footer from './Footer';
import History from "./History";
import load from "../assets/img/load.jpg";

const LoadingIcon = () => (
  <div
    className="loader flex justify-center items-center h-screen"
    style={{ paddingBottom: "150px" }}
  >
    <img src={load} className="w-16 h-16" alt="Loading..." />
  </div>
);

const Home = () => {
  const [hasHistoryData, setHasHistoryData] = useState(false);
  const [loading, setLoading] = useState(false); // Initialize loading state

  const handleHistoryDataChange = (data) => {
    setHasHistoryData(data.length > 0);
    setLoading(false); // Set loading to false when data is received
  };

  // Function to show loading icon when data is being fetched
  const showLoading = () => {
    if (!hasHistoryData && loading) {
      return <LoadingIcon />;
    }
    return null;
  };
  return (
    <>
      {showLoading()}
      {!hasHistoryData && !loading && (
        <div className="min-h-screen flex flex-col justify-center lg:px-32 px-5 text-white bg-[url('assets/img/blog3.jpg')] bg-no-repeat bg-cover opacity-90">
          <div className="w-full lg:w-4/5 space-y-5 mt-10">
            <h1 className="text-5xl font-bold leading-tight">
              Empowering Health Choices for a Vibrant Life...
            </h1>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam magnam
              omnis natus accusantium quos. Reprehenderit incidunt expedita
              molestiae impedit at sequi dolorem iste sit culpa, optio voluptates
              fugiat vero consequatur?
            </p>
          </div>
        </div>
      )}
      <History onHistoryDataChange={handleHistoryDataChange} />
      <About />
      <Blogs />
      <Doctors />
      <Feedback />
      <Footer />
    </>
  );
};

export default Home;