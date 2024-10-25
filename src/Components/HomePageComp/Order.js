import React from 'react';
import { Grid, Typography } from '@mui/material';
import Images from '../ImageCom/bgColor.jpg';
import './Order.css'; // Assuming you place your CSS here
import { Link } from "@mui/material";
function Order() {
  return (
    <div>
      <section
        className="section kf-cta kf-parallax"
        style={{ 
          backgroundImage: `url(${Images})`, 
          color: '#f5f5f5',
          padding: '50px 0'
        }}
      >
        <div className="container" style={{backgroundColor:'black'}}>
          <Grid container spacing={3} alignItems="center">
            {/* Left side: Headings */}
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom style={{color:'#b99272'}}>
                Order for pickup or delivery
              </Typography>
              <Typography variant="h4">
                SKIP THE LINE ORDER ONLINE
              </Typography>
            </Grid>
            
            {/* Right side: Button */}
            <Grid item xs={12} md={4} container justifyContent="flex-end">
            <Link
              to=""
              target=""
              rel="noopener noreferrer"
              className="btn-epic"
              style={{ width: "40%" }}
            >
              <div>
                <span>ORDER NOW <i className="fas fa-chevron-right" style={{ marginLeft: '8px' }}></i></span>
                <span>ORDER NOW <i className="fas fa-chevron-right" style={{ marginLeft: '8px' }}></i></span>
              </div>
            </Link>
            </Grid>
          </Grid>
        </div>
      </section>
    </div>
  );
}

export default Order;
