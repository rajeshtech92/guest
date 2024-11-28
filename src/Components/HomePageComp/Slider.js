import React, { useEffect, useState } from "react";
import { Carousel, Spinner } from "react-bootstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Slider.css";

const Slider = ({ setLoading }) => {
  const [images, setImages] = useState([]);

    //  const [data, setdata]= useState ([])

  useEffect(() => {
    setLoading(true);
    const storedImages = localStorage.getItem("fetchedImages");

    if (storedImages) {
      console.log("Loaded images from local storage");
    
      try {
        const parsedImages = JSON.parse(storedImages);
        if (Array.isArray(parsedImages)) {
          setImages(parsedImages);
        } else {
          setImages([]); // Fallback if data is not an array
        }
      } catch (e) {
        console.error("Error parsing images from localStorage", e);
        setImages([]); // Fallback in case of parsing error
      }
      setLoading(false);
    } else {
      axios
        .get(
          "https://guesthouse-api-dje8gvcwayfdfmbr.eastus-01.azurewebsites.net/api/Contents"
        )
        .then((response) => {
          console.log("API Response:", response);
          const filteredImages = response.data.filter((image) =>
            [95, 96, 97].includes(image.contentId)
          
          );
          if (Array.isArray(filteredImages)) {
            setImages(filteredImages);
          } else {
            setImages([]); // Fallback if data is not an array
          }
          console.log("API Response:", filteredImages);
          console.log("API Response:", response.data);
        
          localStorage.setItem("fetchedImages", JSON.stringify(filteredImages));
        })
        .catch((error) => {
          console.error("There was an error fetching the images!", error);
          setImages([]); // Set empty array in case of error
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [setLoading]);

    // useEffect(()=>{
    //   fetchdata()
    // },[])
    //  const fetchdata = async()=>{
    //    try{

    //      let resp = await axios.get("https://guesthouse-api-dje8gvcwayfdfmbr.eastus-01.azurewebsites.net/api/Contents")
    //      setdata(resp.data)
          
    //    } catch{
    //       console.log("error")
    //    }
    //  }
  if (images.length === 0) {
    // Display a message if no images are found
    return (
      <div
        className="no-images-container"
        style={{ textAlign: "center", marginTop: "20%" }}
      >
        <p>No images available at the moment.</p>
      </div>
    );
  }

  return (
    <div
      className="slider-container"
      style={{ padding: 0, margin: 0, marginTop: "8%" }}
    >
      <Carousel>
        {Array.isArray(images) && images.length > 0 ? (
          images.map((image, index) => (
            <Carousel.Item key={index}>
              <img
                className="d-block w-100"
                style={{ objectFit: "cover", height: "550px" }}
                src={`data:image/jpeg;base64,${image.contentData}`} // Assuming base64 data
                alt={image.title || `Slide ${index + 1}`}
              />
              <Carousel.Caption>
                <h3
                  style={{
                    fontFamily: "Oswald",
                    fontSize: "90px",
                    lineWeight: "1.2",
                    color: "#fff",
                    fontWeight: 500,
                  }}
                >
                  {image.title || `Fast Food Festival`}
                </h3>
                <p
                  style={{
                    fontFamily: "Oswald",
                    fontSize: "50px",
                    lineWeight: "1.2",
                    color: "#fff",
                    fontWeight: 500,
                    padding: "100px",
                  }}
                >
                  {image.description || `Stacked Happiness !`}
                </p>
              </Carousel.Caption>
            </Carousel.Item>
          ))
        ) : (
          <div>No images available</div>
        )}
      </Carousel>
    </div>
  );
};

export default Slider;
