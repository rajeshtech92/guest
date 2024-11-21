import React, { useEffect, useState } from 'react';
import axios from 'axios';
import HeaderProfile from '../HeaderComp/HeaderProfile';
import Footer from '../FooterComp/Footer';
import './Gallery.css';
import { Grid, Typography, Box, Modal, Button } from "@mui/material";
import LinearProgress from '@mui/material/LinearProgress';
import logo from '../ImageCom/logo.jpg'; // Make sure to replace this with the correct path to your logo image
import BannerSection2 from '../HomePageComp/BannerSection2';

function Gallery() {
  const [contentData, setHeading] = useState('');
  const [PhotoHeading, setPhoto] = useState('');
  const [images, setImages] = useState([]);
  const [activeButton, setActiveButton] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [img, setImage] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [dishesImages, setDishesImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('https://guesthouse-api-dje8gvcwayfdfmbr.eastus-01.azurewebsites.net/api/Contents')
      .then(response => {
        const data = response.data;

        // Filter heading and photo heading
        const filteredHeading = data.find(
          (item) => 
            item.contentId === 45 && 
            item.pageId === 1064 && 
            item.sectionId === 2023 && 
            item.controlId === 1
        );

        const photoHeading = data.find(
          (item) => 
            item.contentId === 46 && 
            item.pageId === 1064 && 
            item.sectionId === 2024 && 
            item.controlId === 1
        );

        // Filter images by contentId 34, 35, 36
        const filteredImage = data.filter(
          image => image.contentId === 34 || image.contentId === 35 || image.contentId === 36
        );
        setImage(filteredImage);

        // Filter gallery images and dishes images
        const filteredGalleryImages = data.filter(
          (image) =>
            [47, 48, 49, 50, 51, 52, 53, 54, 55].includes(image.contentId)
        );
        const filteredDishesImages = data.filter(
          (image) =>
            [56, 57, 58, 59, 60, 61].includes(image.contentId)
        );

        // Set state for headings
        if (filteredHeading) {
          setPhoto(filteredHeading.contentData);
        }

        if (photoHeading) {
          setHeading(photoHeading.contentData);
        }

        // Set state for gallery images
        setGalleryImages(filteredGalleryImages);
        setDishesImages(filteredDishesImages);
        setImages(filteredGalleryImages);  // Initially set to galleryImages
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      })
      .finally(() => {
        setLoading(false); // Hide loader once the data is fetched
      });
  }, []);

  const handleButtonClick = (buttonIndex) => {
    setActiveButton(buttonIndex);
    if (buttonIndex === 1) {
      setImages([...galleryImages, ...dishesImages]);
    } else if (buttonIndex === 2) {
      setImages(galleryImages);
    } else if (buttonIndex === 3) {
      setImages(dishesImages);
    }
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedImage(null);
  };

  return (
    <div className='Bg-Gallery'>
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <img src={logo} alt="Logo" style={{ marginBottom: '10px', width: '110px', height: '120px' }} />
          <Box sx={{ width: '110px' }}>
            <LinearProgress color="success" style={{ height: '1px' }} />
          </Box>
        </div>
      ) : (
        <>
          <HeaderProfile />
          <Grid container spacing={4} className="gallery-content">
            <Grid item xs={12}>
              <Typography variant="h4" className="gallery">
                {PhotoHeading}
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={0} className="gallery-content">
            <Grid item xs={12}>
              <Typography variant="h5" className="OurPhoto-Gallery">
                <span>Our Photo Gallery</span>
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" className="gallery-heading">
                {contentData}
              </Typography>
            </Grid>
          </Grid>
          <br /><br />
          <Grid item xs={12}>
            <Typography variant="h4" className="button-gallery" style={{ textAlign: "center" }}>
              <Button
                className={`custom-buttons ${activeButton === 1 ? 'active' : ''}`}
                onClick={() => handleButtonClick(1)}
              >
                View all
              </Button>
              <Button
                className={`custom-buttons ${activeButton === 2 ? 'active' : ''}`}
                onClick={() => handleButtonClick(2)}
              >
                Banquets
              </Button>
              <Button
                className={`custom-buttons ${activeButton === 3 ? 'active' : ''}`}
                onClick={() => handleButtonClick(3)}
              >
                Dishes
              </Button>
            </Typography>
            <div className="image-grid">
              <Grid container spacing={1}>
                {images.map((image, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <div className="grid-images" onClick={() => handleImageClick(image)} style={{width:'100%'}}>
                      <img
                        src={`data:image/jpeg;base64,${image.contentData}`}
                        alt={image.title}
                      />
                      <Typography>
                        <h3>{image.title}</h3>
                        <p>{image.description}</p>
                      </Typography>
                    </div>
                  </Grid>
                ))}
              </Grid>
            </div>
            {selectedImage && (
              <Modal
                open={modalOpen}
                onClose={handleCloseModal}
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '8%', paddingLeft: '8%' }}
              >
                <Box sx={{ outline: 'none', height: '80%', width: '100%' }}>
                  <img
                    src={`data:image/jpeg;base64,${selectedImage.contentData}`}
                    alt={selectedImage.title}
                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                  />
                </Box>
              </Modal>
            )}
          </Grid>

          {/* Displaying images filtered by contentId 34, 35, 36 */}
          {/* <div className="image-grid">
            {img.map((image, index) => (
              <div key={index} className="grid-image">
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
          <BannerSection2 setLoading={setLoading}/>
          <Footer setLoading={setLoading}/>
        </>
      )}
    </div>
  );
}

export default Gallery;
