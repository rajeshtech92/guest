import React, { useEffect, useState } from "react";
import axios from "axios";
import HeaderProfile from "../HeaderComp/HeaderProfile";
import Footer from "../FooterComp/Footer";
import { Grid, Typography } from "@mui/material";
import "./Banquet.css";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import logo from "../ImageCom/logo.jpg"; // Make sure to replace this with the correct path to your logo image
import BannerSection2 from "../HomePageComp/BannerSection2";

const Banquet = () => {
  const navigate = useNavigate();
  const [heading, setHeading] = useState("");
  const [text, setText] = useState("");
  const [heading1, setHeading1] = useState("");
  const [text1, setText1] = useState("");
  const [heading2, setHeading2] = useState("");
  const [text2, setText2] = useState("");
  const [images, setImages] = useState([]);
  const [img, setImage] = useState([]);
  const [text3, setText3] = useState("");
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get(
          "https://guesthouse-api-dje8gvcwayfdfmbr.eastus-01.azurewebsites.net/api/Contents"
        );
        const content = response.data;

        // Fetch images (if any) based on contentId 39
        const filteredImages = content.filter((image) =>
          [39, 88, 89].includes(image.contentId)
        );
        setImages(filteredImages);

        // Fetch other images based on specific contentIds
        const filteredImage = content.filter((image) =>
          [34, 35, 36].includes(image.contentId)
        );
        setImage(filteredImage);

        // Fetch heading and text based on contentId, pageId, sectionId, and controlId
        const filteredHeading = content.find(
          (item) =>
            item.contentId === 37 &&
            item.pageId === 1064 &&
            item.sectionId === 2019 &&
            item.controlId === 1
        );
        const filteredText = content.find(
          (item) =>
            item.contentId === 38 &&
            item.pageId === 1064 &&
            item.sectionId === 2019 &&
            item.controlId === 5
        );
        const filteredText3 = content.find(
          (item) =>
            item.contentId === 44 &&
            item.pageId === 1064 &&
            item.sectionId === 2022 &&
            item.controlId === 5
        );
        const filteredHeading1 = content.find(
          (item) =>
            item.contentId === 40 &&
            item.pageId === 1064 &&
            item.sectionId === 2021 &&
            item.controlId === 1
        );
        const filteredText1 = content.find(
          (item) =>
            item.contentId === 41 &&
            item.pageId === 1064 &&
            item.sectionId === 2021 &&
            item.controlId === 5
        );
        const filteredHeading2 = content.find(
          (item) =>
            item.contentId === 42 &&
            item.pageId === 1064 &&
            item.sectionId === 2021 &&
            item.controlId === 1
        );
        const filteredText2 = content.find(
          (item) =>
            item.contentId === 43 &&
            item.pageId === 1064 &&
            item.sectionId === 2021 &&
            item.controlId === 5
        );

        // Set state with the fetched data
        if (filteredHeading) setHeading(filteredHeading.contentData);
        if (filteredText) setText(filteredText.contentData);
        if (filteredText3) setText3(filteredText3.contentData);
        if (filteredHeading1) setHeading1(filteredHeading1.contentData);
        if (filteredText1) setText1(filteredText1.contentData);
        if (filteredHeading2) setHeading2(filteredHeading2.contentData);
        if (filteredText2) setText2(filteredText2.contentData);
      } catch (error) {
        console.error("Error fetching content:", error);
      } finally {
        setLoading(false); // Hide loader once the data is fetched
      }
    };

    fetchContent();
  }, []);

  const onHome = () => {
    navigate("/headerHome");
  };

  return (
    <div className="banquet-bg">
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
        // Show content only after loading is done
        <>
          <HeaderProfile />
          <Grid container spacing={4} className="banquet-content">
            <Grid item xs={12} style={{ marginTop: "5%" }}>
              <Typography variant="h4" className="banquet-heading">
                {heading}
              </Typography>
            </Grid>
            <Grid item xs={11}>
              <Typography variant="body1" className="banquet-text">
                {text}
              </Typography>
            </Grid>
            {/* Images */}
            <Grid item xs={12} style={{ marginTop: "20%" }}>
              <Typography variant="h4" className="banquet-heading">
                <div className="image-row">
                  {images.map((image, index) => (
                    <div key={index} className="grid-image">
                      <img
                        src={`data:image/jpeg;base64,${image.contentData}`}
                        alt={image.title || "Image"}
                        className="zoom-image"
                        onClick={() =>
                          window.scrollTo({ top: 0, behavior: "smooth" })
                        }
                      />
                      <div className="image-text">
                        <h3>{image.title}</h3>
                        <p>{image.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Typography>
            </Grid>

            <Grid container spacing={0} className="banquet-content">
              <Grid item xs={7}>
                <Typography variant="body1" className="banquet-text1">
                  {text3}
                </Typography>
              </Grid>
              {/* First Heading and Text */}
              <Grid item xs={12} onClick={() => onHome()}>
                <Typography
                  variant="h4"
                  className="banquet-heading1"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                >
                  {heading1}
                </Typography>
              </Grid>
              <Grid item xs={7}>
                <Typography variant="body1" className="banquet-text1">
                  {text1}
                </Typography>
              </Grid>

              {/* Second Heading and Text */}
              <Grid item xs={12} onClick={() => onHome()}>
                <Typography variant="h4" className="banquet-heading1">
                  {heading2}
                </Typography>
              </Grid>
              <Grid item xs={7}>
                <Typography variant="body1" className="banquet-text1">
                  {text2}
                </Typography>
              </Grid>
            </Grid>
            {/* <div className="image-grid">
                        {img.map((image, index) => (
                            <div key={index} className="grid-images">
                                <img
                                    src={`data:image/jpeg;base64,${image.contentData}`}
                                    alt={image.title}
                                />
                                <Typography>
                                    <h3>{image.title}</h3>
                                    <p>{image.description}</p>
                                </Typography>
                            </div>
                        ))}
                    </div> */}
          </Grid>
          <BannerSection2 setLoading={setLoading}></BannerSection2>
          <Footer setLoading={setLoading}/>
        </>
      )}
    </div>
  );
};

export default Banquet;
