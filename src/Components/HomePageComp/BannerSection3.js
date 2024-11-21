import React, { useEffect, useState } from "react";
import "../HomePageStyles/BannerSectionStyle3.css";
import '../HomePageStyles/HomePageStyles.css';
import category_bg from '../ImageCom/category_bg.jpg';
import { getAllContent } from '../../../src/Services/ApiService';

function BannerSection3({ setLoading }) {
    const [content, setContent] = useState({
        images: [],
        heading1: '',
        heading2: '',
        cardHeadings: [],
        paragraph1: '',
        paragraph2: '',
        paragraph3: '',
        paragraph4: '',
        paragraph5: '',
    });
    useEffect(() => {
        const fetchContent = async () => {
            setLoading(true); // Start the loader

            // Check if data is already in localStorage
            const cachedContent = localStorage.getItem('contentData');
            if (cachedContent) {
                setContent(JSON.parse(cachedContent));
                setLoading(false); // Stop the loader if data is from cache
                return;
            }

            try {
                const data = await getAllContent();
                const imageIds = [1032, 1033, 1034, 1035];
                const cardHeadingIds = [1037, 1038, 1039, 1040];
                const cardParagraphIds = [1042, 1043, 1044, 1045];
                const headingIDS = {
                    headingId1: 1029,
                    headingId2: 1036,
                };
                const paragraphIds = {
                    paragraphId1: 1041,
                };

                // Filter images by specific contentIds
                const filteredImages = data
                    .filter(item => imageIds.includes(item.contentId))
                    .map(item => ({
                        src: `data:image/jpg;base64,${item.contentData}`,
                        id: item.contentId
                    }));

                // Get filtered headings
                const filteredHeadings = cardHeadingIds.map(headingId => {
                    const heading = data.find(item => item.contentId === headingId);
                    return heading ? heading.contentData : '';
                });

                // Get filtered paragraphs
                const filteredParagraphs = cardParagraphIds.map(paragraphId => {
                    const paragraph = data.find(item => item.contentId === paragraphId);
                    return paragraph ? paragraph.contentData : '';
                });

                // Get specific headings and paragraph
                const heading1 = data.find(item => item.contentId === headingIDS.headingId1)?.contentData || '';
                const heading2 = data.find(item => item.contentId === headingIDS.headingId2)?.contentData || '';
                const paragraph1 = data.find(item => item.contentId === paragraphIds.paragraphId1)?.contentData || '';

                const newContent = {
                    images: filteredImages,
                    heading1,
                    heading2,
                    cardHeadings: filteredHeadings,
                    cardParagraph: filteredParagraphs,
                    paragraph1
                };

                setContent(newContent);
                // Store the fetched content in localStorage
                localStorage.setItem('contentData', JSON.stringify(newContent));

            } catch (error) {
                console.error('There was an error fetching the data!', error);
            } finally {
                setLoading(false); // Stop the loader after fetching data
            }
        };

        fetchContent();
    }, [setLoading]); 

    return (
        <section className="banner3-section kf-about-2" style={{ backgroundImage: `url(${category_bg})` }}>
    
            {/* <div className="container">
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-5 align-self-center">
                        <div className="kf-titles">
                            <div className="kf-subtitle element-anim-1 animate__active" data-animate="active">
                                {content.heading1}
                            </div>
                            <h3 className="kf-title element-anim-1 animate__active" data-animate="active">
                                {content.heading2}
                            </h3>
                        </div>
                        <div className="kf-text element-anim-1 animate__active" data-animate="active">
                            <p>
                                {content.paragraph1}
                                    </p>
                        </div>
                        <button className="btn-35"><span>SEE MENU<i className="fas fa-chevron-right"></i></span></button>
                    </div>

                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-6 offset-lg-1 align-self-center">
                        <div className="kf-services-items-2 row">
                            {content.images.map((image, index) => (
                                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6" key={index}>
                                    <div className="kf-services-item-2 element-anim-1 scroll-animate animate__active animate__animated" data-animate="active" style={{ visibility: 'visible' }}>
                                        <div className="image">
                                            <img src={image.src} alt={`service_image_${index}`} />
                                        </div>
                                        <div className="desc">
                                            <h5 className="name">{content.cardHeadings[index]}</h5>
                                            <div className="subname">{content.cardParagraph[index]}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div> */}

        </section>
    );
}

export default BannerSection3;

