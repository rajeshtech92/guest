import React, { useEffect, useState } from 'react';
import { Grid, Box} from '@mui/material';
import axios from 'axios';
import InstagramIcon from '@mui/icons-material/Instagram'; 
import './ImagesMapping.css'

function ImagesMapping() {
  const [images, setImages] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Check if data is in local storage
        const cachedImages = localStorage.getItem('images');
        if (cachedImages) {
          // If data is found in local storage, use it
          setImages(JSON.parse(cachedImages));
        } else {
          // If no data in local storage, fetch from API
          const response = await axios.get(
            'https://guesthouse-api-dje8gvcwayfdfmbr.eastus-01.azurewebsites.net/api/Contents'
          );
          const filteredImages = response.data.filter((image) =>
            [23, 24, 25, 26].includes(image.contentId)
          );
          
          // Save the fetched data to local storage
          localStorage.setItem('images', JSON.stringify(filteredImages));
          
          setImages(filteredImages);
        }
      } catch (error) {
        console.error('There was an error fetching the images!', error);
      } finally {
        setLoading(false); // Stop loader regardless of success or error
      }
    };

    fetchData(); // Call the fetch function
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  const handleOpen = (image) => {
    setSelectedImage(image);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImage(null);
  };

  return (
    <div>
      <Grid container spacing={0}>
        {images.map((image) => (
          <Grid item key={image.contentId} xs={3}>
            <Box
              className="img-hover-zoom--slowmo"
              sx={{
                position: 'relative',
                width: '100%',
                height: '100%',
                overflow: 'hidden',
              }}
            >
              <Box
                component="img"
                src={`data:image/jpeg;base64,${image.contentData}`}
                alt={image.title}
                onClick={() => handleOpen(image)}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 5s, filter 3s ease-in-out',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: Dark overlay
                  opacity: 0,
                  transition: 'opacity 0.3s',
                  zIndex: 1,
                }}
                className="overlay"
              >
                <InstagramIcon
                  sx={{
                    color: 'white',
                    fontSize: '3rem',
                  }}
                />
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    {/* )} */}
    </div>
  );
}

export default ImagesMapping;
