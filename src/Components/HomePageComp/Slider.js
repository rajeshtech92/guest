import React, { useEffect, useState } from "react";
import { Carousel, Spinner } from "react-bootstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Slider.css";

const Slider = ({ setLoading }) => {
  const [images, setImages] = useState([]);

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
          const filteredImages = response.data.filter((image) =>
            [4, 5, 6].includes(image.contentId)
          );
          if (Array.isArray(filteredImages)) {
            setImages(filteredImages);
          } else {
            setImages([]); // Fallback if data is not an array
          }
          console.log("API Response:", filteredImages);
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
    <div className="slider-container" style={{ padding: 0, margin: 0 }}>
      <Carousel>
        {Array.isArray(images) && images.length > 0 ? (
          images.map((image, index) => (
            <Carousel.Item key={index}>
              <img
                className="d-block w-100"
                style={{ objectFit: "cover", height: "550px" }}
                src={`data:image/jpeg;base64,${image.contentData}`} // Assuming base64 data
                alt={image.title}
              />
              <Carousel.Caption>
                <h3>{image.title}</h3>
                <p>{image.description}</p>
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
