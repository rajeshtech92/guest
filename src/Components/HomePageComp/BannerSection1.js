// src/components/BannerSection1.js
import React, { useEffect, useState } from 'react';
import { getAllContent } from '../../../src/Services/ApiService';
import '../HomePageStyles/BannerSectionStyle1.css';
import '../HomePageStyles/HomePageStyles.css';
import category_bg from '../ImageCom/category_bg.jpg';
const BannerSection1 = ({ setLoading }) => {
    const [content, setContent] = useState({
        images: [],
        heading1: '',
        heading2: '',
        paragraph1: ''
    });

useEffect(() => {
    const fetchContent = async () => {
        
        try {
            setLoading(true);
            const storedContent = localStorage.getItem('bannerContent');
                if (storedContent) {
                    const parsedContent = JSON.parse(storedContent);
                    setContent(parsedContent);
                    console.log('Loaded content from local storage');
                } else {
                 
                    const data = await getAllContent();
                    console.log('API Response:', data);

                    // IDs to include for images, headings, and paragraphs
                    const imageIds = [98, 75, 76, 77 ];
                    const headingId1 = 78;
                    const headingId2 = 79;
                    const paragraphId1 = 80;

                    // Filtering data
                    const filteredImages = data
                        .filter(item => imageIds.includes(item.contentId))
                        .map(item => ({
                            src: `data:image/jpg;base64,${item.contentData}`,
                            id: item.contentId
                        }));

                    const heading1 = data.find(item => item.contentId === headingId1)?.contentData || '';
                    const heading2 = data.find(item => item.contentId === headingId2)?.contentData || '';
                    const paragraph1 = data.find(item => item.contentId === paragraphId1)?.contentData || '';

                    const contentData = {
                        images: filteredImages,
                        heading1,
                        heading2,
                        paragraph1
                    };

                    // Save the fetched content in local storage
                    localStorage.setItem('bannerContent', JSON.stringify(contentData));
                    setContent(contentData);
                    console.log('API data fetched and stored in local storage');
                }
            } catch (error) {
                console.error('Error fetching content:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, [setLoading]);
    // Defined static menu names associated with specific images
    const menuNames = [
        { id: 98, name: 'Special Dish' },
        { id: 75, name: 'Appetizers' },
        { id: 76, name: 'Naan' },
        { id: 77, name: 'Pani Puri' },
         
    ];

    return (
        <section className="section kf-category" style={{ backgroundImage: `url(${category_bg})` }}>
      
            <div className="">
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <div className="grid-container">
                            {content.images.map((image, index) => {
                                const menuName = menuNames.find(menu => menu.id === image.id);
                                console.log('Image Data:', image);
                                console.log('Menu Name:', menuName);
                                console.log('data:', content);

                                return (
                                    <div key={index} className="grid-item">
                                        <img
                                            src={image.src}
                                            alt={menuName ? menuName.name : 'Unknown'}
                                            className={`image grid-image-${index}`}
                                        />
                                        <div className="overlay">
                                            <div className="text">{menuName ? menuName.name : 'Unknown'}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-5 col-lg-6 col-md-12 offset-lg-1 align-self-center">
                        <div className="kf-titles">
                            <div className="main-heading" data-animate="active" style={{ visibility: 'visible' }}>
                                <h4>{content.heading1}</h4>
                            </div>
                            <h3 className="kf-titles-h2" data-animate="active" style={{ visibility: 'visible' }}>
                                {content.heading2}
                            </h3>
                        </div>
                        <div className="kf-titles-para" data-animate="active" style={{ visibility: 'visible' }}>
                            <p>
                                {content.paragraph1}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        
    </section>
    );
};

export default BannerSection1;
