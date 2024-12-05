
import React, { useState, useEffect } from 'react';
import {getAllContent} from '../../../src/Services/ApiService';
import '../HomePageStyles/BannerSectionStyle2.css';
import '../HomePageStyles/HomePageStyles.css';

const BannerSection2 = ({ setLoading }) => {
    const [images, setImages] = useState({
        imageLeft: "",
        imageCenter: "",
        imageRight: "",
    });
    useEffect(() => {
        const getImages = async () => {
            setLoading(true); // Start the loader
            const cachedImages = localStorage.getItem('bannerImages');
            if (cachedImages) {
                // If images are in localStorage, load them directly
                setImages(JSON.parse(cachedImages));
                setLoading(false); // Stop loader
            } else {
                // Otherwise, fetch images from API
                try {
                    const data = await getAllContent();
                    const imageMap = {
                        75: '',
                        76: '',
                        77: ''
                    };

                    data.forEach(image => {
                        if (imageMap.hasOwnProperty(image.contentId)) {
                            imageMap[image.contentId] = image.contentData;
                        }
                    });

                    const imagesToStore = {
                        imageLeft: imageMap[75] || '',
                        imageCenter: imageMap[76] || '',
                        imageRight: imageMap[77] || '',
                    };

                    setImages(imagesToStore);
                    // Store fetched images in localStorage for future use
                    localStorage.setItem('bannerImages', JSON.stringify(imagesToStore));
                } catch (error) {
                    console.error('Error fetching images:', error);
                } finally {
                    setLoading(false); // Stop the loader
                }
            }
        };

        getImages();
    }, [setLoading]);

    return (
        <section className="section kf-reservation kf-section-no-margin">
            <div className="kf-container">
                <div className="kf-reservation-form">
                    <div className="image-left">
                        <img src={`data:image/jpg;base64,${images.imageLeft}`} alt="Decoration" />
                    </div>
                    <div className="kf-titles align-center">
                        <div className="kf-subtitle">Fresh Curries &amp; Naan</div>
                        <img src={`data:image/jpg;base64,${images.imageCenter}`} alt="Curries and Naan" className="center-image" style={{width: 'inherit',height: '497px'}}/>
                    </div>
                    <div className="image-right">
                        <img src={`data:image/jpg;base64,${images.imageRight}`} alt="Dining area" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BannerSection2;
