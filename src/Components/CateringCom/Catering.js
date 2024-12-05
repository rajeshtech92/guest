import React, { useEffect, useState } from "react";
import axios from "axios";
import HeaderProfile from "../HeaderComp/HeaderProfile";
import Footer from "../FooterComp/Footer";
import { Grid, Typography, Button } from "@mui/material";
import "./Catering.css";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import logo from "../ImageCom/logo.jpg"; // Make sure to replace this with the correct path to your logo image
import BannerSection2 from "../HomePageComp/BannerSection2";

function Catering() {
  const [heading1, setHeading1] = useState("");
  const [heading2, setHeading2] = useState("");
  const [text1, setText1] = useState("");
  const [activeButton, setActiveButton] = useState(null);
  const [cateringImage, setCateringImage] = useState(null);
  const [partyImage, setPartyImage] = useState(null);
  const [img, setImage] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get(
          "https://guesthouse-api-dje8gvcwayfdfmbr.eastus-01.azurewebsites.net/api/Contents"
        );
        const content = response.data;

        // Filter the heading and text data
        const filteredHeading1 = content.find(
          (item) =>
            item.contentId === 62 &&
            item.pageId === 1064 &&
            item.sectionId === 2027 &&
            item.controlId === 1
        );
        const filteredHeading2 = content.find(
          (item) =>
            item.contentId === 63 &&
            item.pageId === 1064 &&
            item.sectionId === 2027 &&
            item.controlId === 1
        );
        const filteredText1 = content.find(
          (item) =>
            item.contentId === 64 &&
            item.pageId === 1064 &&
            item.sectionId === 2027 &&
            item.controlId === 5
        );

        if (filteredHeading1) setHeading1(filteredHeading1.contentData);
        if (filteredHeading2) setHeading2(filteredHeading2.contentData);
        if (filteredText1) setText1(filteredText1.contentData);

        // Fetch and filter the images based on contentId
        const filteredImages = content.filter(
          (item) =>
            item.contentId === 34 ||
            item.contentId === 35 ||
            item.contentId === 36
        );
        setImage(filteredImages);

        const cateringImg = content.find((item) => item.contentId === 65);
        const partyImg = content.find((item) => item.contentId === 66);

        setCateringImage(cateringImg);
        setPartyImage(partyImg);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Hide loader once the data is fetched
      }
    };

    fetchContent();
  }, []);

  const handleButtonClick = (buttonIndex) => {
    setActiveButton(buttonIndex);
  };

  const renderImage = (image) => {
    return (
      <Grid container spacing={2} justifyContent="center" paddingTop={"4%"}>
        {image && (
          <Grid item>
            <img
              src={`data:image/jpeg;base64,${image.contentData}`}
              alt={`content ${image.contentId}`}
              className="image-style"
            />
          </Grid>
        )}
      </Grid>
    );
  };

  return (
    <div className="catering-bg">
      {loading ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <img
            src={logo}
            alt="Logo"
            style={{ marginBottom: "10px", width: "110px", height: "120px" }}
          />
          <Box sx={{ width: "110px" }}>
            <LinearProgress color="success" style={{ height: "1px" }} />
          </Box>
        </div>
      ) : (
        <>
          <HeaderProfile />
          <Grid container spacing={2} className="content-grid">
            <Grid item xs={12} sm={6} md={10}>
              <div className="center">
                {/* <h6>{heading1}</h6> */}
                <h3>{heading2}</h3>
                <p>{text1}</p>
              </div>
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant="h4"
                className="buttons-button"
                style={{
                  padding: "unset",
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                <Button
                  className={`custom-button ${
                    activeButton === 1 ? "active" : ""
                  }`}
                  onClick={() => handleButtonClick(1)}
                >
                  CATERING PACKAGES
                </Button>
                <Button
                  className={`custom-button ${
                    activeButton === 2 ? "active" : ""
                  }`}
                  onClick={() => handleButtonClick(2)}
                >
                  PARTY TRAYS TO GO
                </Button>
              </Typography>
            </Grid>
            <Grid item xs={12}>
              {activeButton === 1 && renderImage(cateringImage)}
              {activeButton === 2 && renderImage(partyImage)}
            </Grid>
          </Grid>
          <BannerSection2 setLoading={setLoading} />
          <Footer setLoading={setLoading} />
        </>
      )}
    </div>
  );
}

export default Catering;
