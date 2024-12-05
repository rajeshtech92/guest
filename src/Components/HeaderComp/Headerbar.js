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
import logo from "../ImageCom/logo.jpg";
import ImagesMapping from "../HomePageComp/ImagesMapping";
import Footer from "../FooterComp/Footer";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faCog,
  faTachometerAlt,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import Slider from "../HomePageComp/Slider";
import Gallery from "../GalleryComp/Gallery";
import Catering from "../CateringCom/Catering";
import Order from "../OrderPageComp/Order";
import LinearProgress from "@mui/material/LinearProgress";
import BannerSection1 from "../HomePageComp/BannerSection1";
import BannerSection2 from "../HomePageComp/BannerSection2";
import BannerSection3 from "../HomePageComp/BannerSection3";
import BannerSectionCTA from "../HomePageComp/BannerSectionCTA";
import OurStory from "../HomePageComp/OurStory";

const pages = [
  "HOME",
  "ORDER ONLINE",
  "BANQUETS",
  "MENU",
  "CATERING",
  "GALLERY",
  "LOCATION",
];
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
function HeaderBar() {
  return <div>This is the Home Page</div>;
}
function Banquet() {
  return <div>This is the Home Page</div>;
}
function Headerbar() {
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [activePage, setActivePage] = useState("");
  const [loading, setLoading] = useState(true);
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (page) => {
    setAnchorElNav(null);
    setActivePage(page);
    if (page === "MENU") {
      navigate("/menuPage");
    } else if (page === "HOME") {
      navigate("/Home");
    } else if (page === "ORDER ONLINE") {
      navigate("/menuOrder");
    } else if (page === "BANQUETS") {
      navigate("/banquetPage");
    } else if (page === "CATERING") {
      navigate("/cateringPage");
    } else if (page === "GALLERY") {
      navigate("/galleryPage");
    } else if (page === "LOCATION") {
      navigate("/locationPage");
    }
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const logOut = () => {
    localStorage.clear("items");
    navigate("/");
  };

  const UserProfile = () => {
    navigate("/userProfile");
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://guesthouse-api-dje8gvcwayfdfmbr.eastus-01.azurewebsites.net/api/Users/${storedId}`
        );
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="home-bg" style={{ overflow: "hidden" }}>
        {loading ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <img
              src={logo}
              alt="Logo"
              style={{ marginBottom: "10px", width: "150px", height: "150px" }}
            />
            {/* Display the logo */}
            <Box sx={{ width: "110px", overflowX: "hidden" }}>
              <LinearProgress color="success" style={{ height: "1px" }} />
            </Box>
          </div>
        ) : (
          <>
            <AppBar
              position="fixed"
              sx={{
                backgroundColor: "black",
                overflowX: "hidden",
                top: "0",
                zIndex: "999",
              }}
            >
              <Container maxWidth="xl" sx={{ overflowX: "hidden" }}>
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
                      fontSize: { xs: "12px", md: "16px" },
                    }}
                  >
                    <img
                      src={logo}
                      alt="Logo"
                      style={{ height: "120px", width: "auto" }}
                      className="logo-height"
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
                        flexGrow: 1,
                        display: { xs: "non", md: "flex" },
                        justifyContent: "center",
                      }}
                    >
                      {pages.map((page) => (
                        <MenuItem
                          key={page}
                          onClick={() => handleCloseNavMenu(page)}
                        >
                          <Typography textAlign="center" fontSize="12px">
                            {page}
                          </Typography>
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
                  ></Typography>
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
                          color: activePage === page ? "red" : "white",
                          display: "block",
                          fontSize: { xs: "12px", md: "14px" },
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
                    to="/cart"
                    className="btn-epic"
                    style={{
                      width: "100%",
                      maxWidth: "120px",
                      textAlign: "center",
                    }}
                  >
                    <div className="ORDER"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <span className="ORDER-NOW" style={{ fontSize: "12px" }}>ORDER NOW</span>
                      <span className="ORDER-NOW" style={{ fontSize: "12px" }}>ORDER NOW</span>
                    </div>
                  </RouterLink>
                  <Box sx={{ flexGrow: 0, ml: { xs: 1, md: "20px" } }}>
                    <Tooltip title="Open settings">
                      <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                        {userData && (
                          <Typography
                            sx={{
                              color: "white",
                              marginRight: 1,
                              fontSize: { xs: "12px", md: "14px" },
                            }}
                          >
                            {userData.firstName}
                          </Typography>
                        )}
                        <Avatar alt={userData ? userData.firstName : ""} />
                      </IconButton>
                    </Tooltip>
                    <Menu
                      sx={{ mt: { xs: "45px", md: "68px" } }}
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
                          <Typography textAlign="center" fontSize="12px">
                            {setting.name}
                          </Typography>
                        </MenuItem>
                      ))}
                    </Menu>
                  </Box>
                </Toolbar>
              </Container>
            </AppBar>
            <Slider setLoading={setLoading} />
            <h4
              className="Bring-people"
              style={{
                color: "white",
                textAlign: "center",
                paddingTop: "40px",
                fontFamily: "emoji",
              }}
            >
              Bring people together with great good
            </h4>
            <BannerSection1 setLoading={setLoading} />
            <BannerSection2 setLoading={setLoading} />
            {/* <BannerSection3 setLoading={setLoading}/>
            <OurStory setLoading={setLoading}/>
            <BannerSectionCTA setLoading={setLoading}/> */}
            <ImagesMapping setLoading={setLoading} />
            <Footer setLoading={setLoading} />
          </>
        )}
        {/* Define the Routes for your application */}
        <Routes>
          <Route path="/Home" element={<HeaderBar />} />
          <Route path="/menuPage" element={<menuPage />} />
          <Route path="/banquetPage" element={<Banquet />} />
          <Route path="/orderPage" element={<Order />} />
          <Route path="/cateringPage" element={Catering} />
          <Route path="/galleryPage" element={<Gallery />} />
          <Route path="/locationPage" element={Location} />
          {/* Add other routes here */}
        </Routes>
      </div>
    </>
  );
}

export default Headerbar;
