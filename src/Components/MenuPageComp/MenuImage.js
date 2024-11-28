import React, { useState, useEffect } from "react";
import HeaderProfile from "../HeaderComp/HeaderProfile";
import Footer from "../FooterComp/Footer";
import "../MenuPageComp/MenuImage.css";
import "../HomePageStyles/HomePageStyles.css";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import axios from "axios";
import BannerSection2 from "../HomePageComp/BannerSection2";
import logo from "../ImageCom/logo.jpg";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import TextField from "@mui/material/TextField";

function MenuImage() {
  const [activeLink, setActiveLink] = useState(null);
  const [menuData, setMenuData] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [submenuPrices, setSubmenuPrices] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [page, setPage] = useState(0); // For pagination
  const [rowsPerPage, setRowsPerPage] = useState(5); // Rows per page for pagination
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  // Fetch menu data from the API
  useEffect(() => {
    setLoading(true);
    axios
      .get(
        "https://guesthouse-api-dje8gvcwayfdfmbr.eastus-01.azurewebsites.net/api/Menu"
      )
      .then((response) => {
        setMenuData(response.data);
        setLoading(false);

        if (response.data.length > 0) {
          setActiveLink(response.data[0].menuId);
        }
      })
      .catch((error) => {
        console.error("Error fetching menu data:", error);
        setLoading(false);
      });
  }, []);

  // Fetch menu items and submenu prices when activeLink changes
  useEffect(() => {
    if (activeLink) {
      // Fetch menu items
      axios
        .get(
          "https://guesthouse-api-dje8gvcwayfdfmbr.eastus-01.azurewebsites.net/api/MenuItem"
        )
        .then((response) => {
          const filteredItems = response.data.filter(
            (item) => item.menuId === activeLink
          );
          setMenuItems(filteredItems);
        })
        .catch((error) => {
          console.error("Error fetching menu data:", error);
          setLoading(false);
        });

      // Fetch submenu prices
      axios
        .get(
          "https://guesthouse-api-dje8gvcwayfdfmbr.eastus-01.azurewebsites.net/api/SubmenuPrice"
        )
        .then((response) => {
          const filteredPrices = response.data.filter(
            (price) => price.menuId === activeLink
          );
          setSubmenuPrices(filteredPrices);
        })
        .catch((error) => {
          console.error("Error fetching menu data:", error);
          setLoading(false);
        });
    }
  }, [activeLink]);

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filtered menu items based on search query
  const filteredItems = menuItems.filter((item) =>
    item.menuItemName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    console.log(`Sorting by ${key}, direction: ${direction}`);
    setSortConfig({ key, direction });
  };

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (!sortConfig.key) return 0; // No sorting if no key is selected
    const valueA = typeof a[sortConfig.key] === "string" 
      ? a[sortConfig.key].toLowerCase() 
      : a[sortConfig.key];
    const valueB = typeof b[sortConfig.key] === "string" 
      ? b[sortConfig.key].toLowerCase() 
      : b[sortConfig.key];
  
    if (valueA < valueB) return sortConfig.direction === "asc" ? -1 : 1;
    if (valueA > valueB) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });
  

  return (
    <div className="menu-bg">
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
            style={{ marginBottom: "10px", width: "110px", height: "120px" }}
          />
          <Box sx={{ width: "110px" }}>
            <LinearProgress color="success" style={{ height: "1px" }} />
          </Box>
        </div>
      ) : (
        <>
          <HeaderProfile />
          <section className="section-kf-menu kf-menu-tabs">
            <div className="kf-menu-container">
              <div className="align-center kf-titles">
                <div className="kf-subtitle">Guru Palace</div>
                <h3 className="kf-title">TakeOut & Delivery Menu</h3>
                <div className="kf-filter kf-filter-menu">
                  <div className="kf-filter" style={{ visibility: "visible" }}>
                    {menuData.map((menu) => (
                      <a
                        key={menu.menuId}
                        href="#"
                        className={activeLink === menu.menuId ? "active" : ""}
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveLink(menu.menuId);
                        }}
                      >
                        {menu.menuName}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div
              className="kf-menu-items"
              style={{ backgroundColor: "black", color: "white" }}
            >
              <div className="row">
                {activeLink && menuItems.length > 0 ? (
                  <>
                    {/* Search Bar */}
                    <div className="search-container">
                      <TextField
                        id="search-bar"
                        variant="outlined"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        fullWidth
                        margin="normal"
                        placeholder="Search Menu Items..."
                        className="custom-search-input"
                      />
                    </div>

                    {/* Table */}
                    <div className="card">
                      <TableContainer
                        // component={Paper}
                        style={{ background: "#333333", color: "white" }}
                      >
                        <Table>
                          <TableHead style={{ background: "white" }}>
                            <TableRow>
                              <TableCell
                                className="TableHead-color"
                                style={{
                                 
                                  color: "#000000ad",
                                  fontWeight: "bold",
                                  padding: "5px", // Reduced padding
                                  fontSize: "14px", // Smaller font size
                                  textAlign: "center",
                                }}
                              >
                                S No
                              </TableCell>
                              <TableCell onClick={() => handleSort("menuItemName")}
                                className="TableHead-color"
                                style={{
                                
                                  color: "#000000ad",
                                  fontWeight: "bold",
                                  padding: "5px", // Reduced padding
                                  fontSize: "14px", // Smaller font size
                                  textAlign: "center",
                                  cursor:"pointer",

                                }}
                              >
                                Menu Item
                                {sortConfig.key === "menuItemName" &&
                                  (sortConfig.direction === "asc" ? " ↑" : " ↓")}
                              </TableCell>
                              <TableCell  onClick={() => handleSort("menuDesc")}
                                className="TableHead-color"
                                style={{
                                 
                                  color: "#000000ad",
                                  fontWeight: "bold",
                                  padding: "5px", // Reduced padding
                                  fontSize: "14px", // Smaller font size
                                  textAlign: "center",
                                  cursor:"pointer"
                                }}
                              >
                                Description
                                {sortConfig.key === "menuDesc" &&
                                  (sortConfig.direction === "asc" ? " ↑" : " ↓")}
                              </TableCell>
                              <TableCell onClick={() => handleSort("quantity")}
                                className="TableHead-color"
                                style={{
                                 
                                  color: "#000000ad",
                                  fontWeight: "bold",
                                  padding: "5px", // Reduced padding
                                  fontSize: "14px", // Smaller font size
                                  textAlign: "center",
                                  cursor:"pointer"
                                }}
                              >
                                Quantity
                                {sortConfig.key === "quantity" &&
                                  (sortConfig.direction === "asc" ? " ↑" : " ↓")}
                              </TableCell>
                              <TableCell onClick={() => handleSort("price")}
                                className="TableHead-color"
                                style={{
                                  color: "#000000ad",
                                  fontWeight: "bold",
                                  padding: "5px", // Reduced padding
                                  fontSize: "14px", // Smaller font size
                                  textAlign: "center",
                                  cursor:"pointer"
                                }}
                              >
                                Price
                                {sortConfig.key === "price" &&
                                  (sortConfig.direction === "asc" ? " ↑" : " ↓")}
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {sortedItems
                              .reverse()
                              .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                              )
                              .map((item, index) => {
                                const priceData = submenuPrices.find(
                                  (price) =>
                                    price.menuItemId === item.menuItemId
                                );
                                const isEvenRow = index % 2 === 0;
                                return (
                                  <TableRow
                                    key={item.menuItemId}
                                    style={{
                                      background: isEvenRow
                                        ? "#fff"
                                        : "#f4f4f4",
                                      cursor: "pointer",
                                    }}
                                    onMouseEnter={(e) =>
                                      (e.currentTarget.style.background =
                                        "#d3d3d3")
                                    }
                                    onMouseLeave={(e) =>
                                      (e.currentTarget.style.background =
                                        isEvenRow ? "#f4f4f4" : "#fcfcfc")
                                    }
                                  >
                                    <TableCell
                                      style={{
                                        textAlign: "center",
                                        padding: "5px", // Reduced padding
                                        fontSize: "14px", // Smaller font size
                                        height:"35px"
                                      }}
                                    >
                                      {page * rowsPerPage + index + 1}
                                    </TableCell>
                                    <TableCell
                                      style={{
                                        textAlign: "center",
                                        padding: "5px", // Reduced padding
                                        fontSize: "14px", // Smaller font size
                                      }}
                                    >
                                      {item.menuItemName}
                                    </TableCell>
                                    <TableCell
                                      style={{
                                        textAlign: "center",
                                        padding: "5px", // Reduced padding
                                        fontSize: "14px", // Smaller font size
                                      }}
                                    >
                                      {item.menuDesc}
                                    </TableCell>
                                    <TableCell
                                      style={{
                                        textAlign: "center",
                                        padding: "5px", // Reduced padding
                                        fontSize: "14px", // Smaller font size
                                      }}
                                    >
                                      {priceData ? priceData.quantity : "N/A"}
                                    </TableCell>
                                    <TableCell
                                      style={{
                                        textAlign: "center",
                                        padding: "5px", // Reduced padding
                                        fontSize: "14px", // Smaller font size
                                      }}
                                    >
                                      {priceData ? priceData.price : "N/A"}
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={filteredItems.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        style={{
                          backgroundColor: "rgb(221, 221, 221);", // Blue background to match the table head
                          color: "black", // White text color for contrast
                          borderTop: "1px solid #ddd", // Border at the top
                          display: "flex", // Flexbox layout for alignment
                          justifyContent: "end", // Even spacing for elements
                        }}
                        classes={{
                          actions: {
                            color: "black", // White icons for page navigation
                          },
                        }}
                        labelRowsPerPage={
                          <span style={{ color: "black" }}>Rows per page:</span>
                        }
                        labelDisplayedRows={({ from, to, count }) => (
                          <span style={{ color: "black" }}>
                            {from}-{to} of{" "}
                            {count !== -1 ? count : `more than ${to}`}
                          </span>
                        )}
                      />
                    </div>
                  </>
                ) : (
                  <p style={{ color: "white", textAlign: "center" }}>
                    No menu items available.
                  </p>
                )}
              </div>
            </div>
          </section>
          <h4 style={{color:"white", marginLeft:"33px", marginBottom:"50px"}}>Our Food items</h4>
          <BannerSection2 setLoading={setLoading} />
          <Footer setLoading={setLoading} />
        </>
      )}
    </div>
  );
}

export default MenuImage;
