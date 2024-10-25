
import React from 'react';
import '../HomePageStyles/BannerSectionCTA.css';
import '../HomePageStyles/HomePageStyles.css';

const BannerSectionCTA = () => {
    return (
        <section className="kf-numbers-2 section-bg-cta">
            <div className='cta-container'>
                <div className="kf-numbers-items-2 row-cta">
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-3">
                        <div
                            className="kf-numbers-item-2 element-anim-1 " >
                            <div className="icon-cta">
                            <i className="las la-gem"></i>
                            </div>
                            <div className="num">5000+</div>
                            <div className="desc">
                                <h5 className="name">Premium Clients</h5>
                            </div>
                        </div>
                    </div>

                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-3">
                        <div
                            className="kf-numbers-item-2 element-anim-1 "
                            data-animate="active"
                            style={{ visibility: 'visible' }}
                        >
                            <div className="icon-cta">
                                <i className="las la-user-tie"></i>
                            </div>
                            <div className="num">10+</div>
                            <div className="desc">
                                <h5 className="name">Professional Chefs</h5>
                            </div>
                        </div>
                    </div>

                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-3">
                        <div
                            className="kf-numbers-item-2 element-anim-1 "
                            data-animate="active"
                            style={{ visibility: 'visible' }}
                        >
                            <div className="icon-cta">
                                <i className="las la-trophy"></i>
                            </div>
                            <div className="num">10+</div>
                            <div className="desc">
                                <h5 className="name">Winning Awards</h5>
                            </div>
                        </div>
                    </div>

                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-3">
                        <div
                            className="kf-numbers-item-2 element-anim-1 "
                            data-animate="active"
                            style={{ visibility: 'visible' }}
                        >
                            <div className="icon-cta">
                                <i className="lar la-grin-stars"/>
                            </div>
                            <div className="num">600+</div>
                            <div className="desc">
                                <h5 className="name">5 Star Reviews</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BannerSectionCTA;
