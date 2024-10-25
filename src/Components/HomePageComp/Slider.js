import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Slider.css';

const Slider = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    // Fetching images from the API
    axios.get('https://guesthouse-api-dje8gvcwayfdfmbr.eastus-01.azurewebsites.net/api/Contents')
      .then(response => {
         // Filtering images based on contentId (e.g., contentId 17, 18, 19)
         const filteredImages = response.data.filter(image => 
          image.contentId === 4 || image.contentId === 5 || image.contentId === 6
        );
        setImages(filteredImages);
        console.log(response);
      })
      .catch(error => {
        console.error("There was an error fetching the images!", error);
      });
  }, []);

  return (
    <div className="slider-container" style={{ padding: 0, margin: 0 }}>
      <Carousel>
        {images.map((image, index) => (
          <Carousel.Item key={index}>
            <img
              className="d-block w-100"
              style={{ objectFit: 'cover', height: '550px' }}
              src={`data:image/jpeg;base64,${image.contentData}`} // Assuming base64 data
              alt={image.title}
            />
            <Carousel.Caption>
              <h3>{image.title}</h3>
              <p>{image.description}</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default Slider;
