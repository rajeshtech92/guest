import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import { FreeMode, Pagination } from 'swiper/modules';
import "../HomePageStyles/OurStory.css";
import "../HomePageStyles/Swipper.css";
import '../HomePageStyles/HomePageStyles.css';
import testimonials_bg2 from '../ImageCom/testimonials_bg2.jpg';
import google from '../ImageCom/google.jpg';
import { getAllContent } from '../../../src/Services/ApiService';


function OurStory() {



    useEffect(() => {
        const fetchContent = async () => {
            try{
                const data  = await getAllContent();
                const textIds = [2029,2030,2031,2302,2033,2034];
                const nameIds = []; 

            }
            catch(error){
                console.error('There was an error fetching the data!', error);
 
            }
        };
    });


    const testimonials = [
        {
            image:google,
            rating: 5,
            text: "We did our daughter’s Sangeet ceremony last week. We had a blast. Food was catered by them and it was amazing. We are vegetarians and they offered very good choices and suggested to go with fantastic appetizers. Staff very helpful and it was a very good experience.",
            name: "Amar Gm"
        },
        {
            image:google,
            rating: 5,
            text: "Really amazing food! This place is great if your looking for authentic Indian food while also getting hints of Chinese cuisine. They're buffet is amazing with a great variety of foods and at an amazing price. The staff is also very friendly and helpful.",
            name: "Mrs. V"
        },
        {
            image:google,
            rating: 5,
            text: "I knew that Guru Palace did big events like sweet sixteens and wedding parties, but I hadn't realized it was also a regular restaurant. I went there before going to a movie at Regal Cinema and it was GREAT. I'm super picky and was delighted that the food was so good.",
            name: "Bonnie"
        },
        {
            image:google,
            rating: 5,
            text: "Went for food tasting for an upcoming event there. Great food and service!! Lots of parking up front and nice restaurant with a range of attached banquet halls for events.",
            name: "Pranay Gandhi"
        },
        {
            image:google,
            rating: 5,
            text: "Delicious entrees (spinach kofta is unique and a must-try) and naan are some of the best. If you’re dining in, end the meal with their signature mango kulfis!",
            name: "Amrita Kaur"
        },
        {
            image:google,
            rating: 5,
            text: "Highly recommend this place if you want a banquet hall with good atmosphere, great food, and awesome service. Great management and their servers are super helpful.",
            name: "Serwaa Akoto Bonsu"
        }
    ];

    return (
        <section className="section kf-testimonials kf-testimonials-2 section-bg" style={{ backgroundImage: `url(${testimonials_bg2})` }}>
            <div>
                <div className="kf-titles align-center">
                    <div className="kf-subtitle element-anim-1" data-animate="active" style={{ visibility: 'visible' }}>
                        Customer Feedback
                    </div>
                    <h3 className="kf-title element-anim-1" data-animate="active" style={{ visibility: 'visible' }}>
                        What Our Clients Say
                    </h3>
                </div>
                <div className="kf-testimonials-carousel">
                    <Swiper
                        slidesPerView={4}
                        spaceBetween={150}
                        freeMode={true}
                        pagination={{
                            clickable: true,
                        }}
                        modules={[FreeMode, Pagination]}
                        className="mySwiper"
                    >
                        {testimonials.map((testimonial, index) => (
                            <SwiperSlide key={index}  style={{width:350}}>
                                <div className="slide-item element-anim-1">
                                    <div className="image">
                                        <img src={testimonial.image} alt="Google Reviews" />
                                    </div>
                                    <div className="desc">
                                        <div className="stars">
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                <i className="fas fa-star" key={i}></i>
                                            ))}
                                        </div>
                                        <div className="text">
                                            {testimonial.text}
                                        </div>
                                        <h5 className="name"><em>{testimonial.name}</em></h5>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
}

export default OurStory;
