import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { Link as RouterLink } from "react-router-dom"; // Updated to use RouterLink
import { Route, Routes, useNavigate } from "react-router-dom";
import logo from '../ImageCom/logo.jpg';
import ImagesMapping from '../HomePageComp/ImagesMapping';
import Footer from '../FooterComp/Footer';
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCog, faTachometerAlt, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import Slider from "../HomePageComp/Slider";
import Gallery from '../GalleryComp/Gallery';
import Catering from "../CateringCom/Catering";
import Order from '../OrderPageComp/Order';
import LinearProgress from '@mui/material/LinearProgress';
import BannerSection1 from '../HomePageComp/BannerSection1';
import BannerSection2 from '../HomePageComp/BannerSection2';
import BannerSection3 from '../HomePageComp/BannerSection3';
import BannerSectionCTA from '../HomePageComp/BannerSectionCTA';
import OurStory from '../HomePageComp/OurStory';

const pages = ["HOME", "ORDER ONLINE", "BANQUETS", "MENU", "CATERING","GALLERY", "LOCATION"];
const settings = [
  { name: "Profile", icon: faUser },
  { name: "Account", icon: faCog },
  { name: "Dashboard", icon: faTachometerAlt },
  { name: "Logout", icon: faSignOutAlt },
];

const storedId = localStorage.getItem("userId");

function MenuPage() {
  return <div>This is the Menu Page</div>;
}
function HeaderBar(){
  return <div>This is the Home Page</div>;
}
function Banquet(){
  return <div>This is the Home Page</div>;
}
function Headerbar() {
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // New loading state
  const [delayed, setDelayed] = useState(true); // New state for delay
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (page) => {
    setAnchorElNav(null);
    if (page === "MENU") {
      navigate("/menuPage");
    } else if (page === "HOME") {
      navigate("/headerHome");
    } 
    else if (page === "ORDER ONLINE") {
      navigate("/menuOrder"); // Add a route for ORDER ONLINE  
    }
    else if (page === "BANQUETS") {
      navigate("/banquetPage"); 
    } else if (page === "CATERING") {
      navigate("/cateringPage"); // Add a route for CATERING
    }
    else if (page === "GALLERY") {
      navigate("/galleryPage");
    }
    else if (page === "LOCATION") {
      navigate("/locationPage"); // Add a route for LOCATION
    }
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const logOut = () => {
    localStorage.clear("items");
    navigate("/login");
  };

  const UserProfile = () => {
    navigate("/userProfile");
  };

  useEffect(() => {
    axios.get(`https://guesthouse-api-dje8gvcwayfdfmbr.eastus-01.azurewebsites.net/api/Users/${storedId}`)
      .then((response) => {
        setUserData(response.data);
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
          setDelayed(false);
        }, 1000);
      });
  }, []);

  return (
    <div className="home-bg">
     {loading || delayed ? (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <img src={logo} alt="Logo" style={{ marginBottom: '10px', width: '150px', height: '150px' }} /> {/* Display the logo */}
           <Box sx={{ width: '110px'}}>
      <LinearProgress color="success" style={{height:'1px'}}/>
    </Box>
        </div>
      ) : (
        <>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "black",
          position: "sticky",
          top: "0",
          zIndex: "999",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component="a"
              href=""
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 600,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              <img
                src={logo}
                alt="Logo"
                style={{ height: "120px", width: "auto" }}
              />
            </Typography>
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "flex", md: "none" },
                justifyContent: "center",
              }}
            >
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page} onClick={() => handleCloseNavMenu(page)}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <Typography
              variant="h5"
              noWrap
              component="a"
              href=""
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              {/* <img
                src={logo}
                alt="Logo"
                style={{ height: "40px", width: "auto" }}
              /> */}
            </Typography>
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "none", md: "flex" },
                justifyContent: "center",
              }}
            >
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={() => handleCloseNavMenu(page)}
                  sx={{
                    my: 2,
                    color: "white",
                    display: "block",
                    fontSize: "14px",
                    lineHeight: "50px",
                    textTransform: "uppercase",
                    letterSpacing: "0.03em",
                    textDecoration: "none",
                    fontWeight: 600,
                    "&:hover": {
                      color: "#b99272",
                    },
                  }}
                >
                  {page}
                </Button>
              ))}
            </Box>
            <RouterLink
              to="/menuOrder" // Update to your route
              className="btn-epic"
              style={{ width: "12%" }}
            >
              <div>
                <span>ORDER NOW</span>
                <span>ORDER NOW</span>
              </div>
            </RouterLink>
            <Box sx={{ flexGrow: 0, ml: "20px" }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  {userData && (
                    <Typography sx={{ color: "white", marginRight: 1 }}>
                      {userData.firstName}
                    </Typography>
                  )}
                  <Avatar alt={userData ? userData.firstName : ""} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "68px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting.name}
                    onClick={() => {
                      handleCloseUserMenu();
                      if (setting.name === "Logout") {
                        logOut();
                      }
                      if (setting.name === "Profile") {
                        UserProfile();
                      }
                    }}
                  >
                    <FontAwesomeIcon
                      icon={setting.icon}
                      style={{ marginRight: "10px" }}
                    />
                    <Typography textAlign="center">{setting.name}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Slider />
      <BannerSection1/>
      <BannerSection2/>
      <BannerSection3/>
      <OurStory/>
      <BannerSectionCTA/>
      <ImagesMapping />
      <Footer />
</>
      )}
      {/* Define the Routes for your application */}
      <Routes>
      <Route path="/headerHome" element={<HeaderBar />} />
        <Route path="/menuPage" element={<menuPage />} />
        <Route path="/banquetPage" element={<Banquet />} />
        <Route path="/orderPage" element={<Order />} />
        <Route path="/cateringPage" element={Catering} />
        <Route path="/galleryPage" element={<Gallery />} />
        <Route path="/locationPage" element={Location} />
        {/* Add other routes here */}
      </Routes>

      
    </div>
  );
}

export default Headerbar;
