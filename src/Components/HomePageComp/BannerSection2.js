
import React, { useState, useEffect } from 'react';
import {getAllContent} from '../../../src/Services/ApiService';
import '../HomePageStyles/BannerSectionStyle2.css';
import '../HomePageStyles/HomePageStyles.css';

const BannerSection2 = () => {
    const [images, setImages] = useState({
        imageLeft: "",
        imageCenter: "",
        imageRight: "",
    });

    useEffect(() => {
        const getImages = async () => {
            try {
                const data = await getAllContent();
            //    81,82,83
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

                setImages({
                    imageLeft: imageMap[75] || '',
                    imageCenter: imageMap[76] || '',
                    imageRight: imageMap[77] || '',
                });
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };

        getImages();
    }, []);

    return (
        <section className="section kf-reservation kf-section-no-margin">
            <div className="kf-container">
                <div className="kf-reservation-form">
                    <div className="image-left">
                        <img src={`data:image/jpg;base64,${images.imageLeft}`} alt="Decoration" />
                    </div>
                    <div className="kf-titles align-center">
                        <div className="kf-subtitle">Fresh Curries &amp; Naan</div>
                        <img src={`data:image/jpg;base64,${images.imageCenter}`} alt="Curries and Naan" style={{width: 'inherit',height: '497px'}}/>
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
