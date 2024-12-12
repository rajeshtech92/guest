import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import HeaderProfile from "../HeaderComp/HeaderProfile";
import axios from "axios";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Button from "@mui/material/Button";
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  TableSortLabel,
  Paper,
  Typography,
  // LinearProgress,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useTable, usePagination, useSortBy } from "react-table";
import { styled } from "@mui/material/styles";
import "./MenuOrder.css";
import LinearProgress from "@mui/material/LinearProgress";
import logo from "../ImageCom/logo.jpg";
// Enum for Order Status
const OrderStatus = {
  Pending: 1,
  InProcess: 2,
  Delivered: 3,
};

const getStatusLabel = (status, quantity) => {
  let label = "";
  let style = {};

  switch (status) {
    case OrderStatus.Pending:
      label = "Pending";
      style = {
        background: "#000000d6",
        color: "white",
        fontWeight: "600",
        fontSize: "12px",
        borderRadius: "30px",
        width: "130%",
        textAlign: "center",
      };
      break;
    case OrderStatus.InProcess:
      label = "In Process";
      style = {
        background: "orange",
        color: "white",
        fontWeight: "600",
        fontSize: "12px",
        borderRadius: "30px",
        width: "104%",
        textAlign: "center",
      };
      break;
    case OrderStatus.Delivered:
      label = "Delivered";
      style = {
        background: "green",
        color: "white",
        fontWeight: "600",
        fontSize: "12px",
        borderRadius: "30px",
        width: "130%",
        textAlign: "center",
      };
      break;
    default:
      label = "Unknown";
      break;
  }

  // Modify based on quantity
  if (quantity === ItemQuantity.Full) {
    style.fontSize = "14px"; // Larger for full quantity
  } else if (quantity === ItemQuantity.Half) {
    style.fontSize = "12px"; // Medium for half quantity
  } else if (quantity === ItemQuantity.Quarter) {
    style.fontSize = "10px"; // Smaller for quarter quantity
  }

  return (
    <Typography style={style}>
      {label}{" "}
      {Object.keys(ItemQuantity).find((key) => ItemQuantity[key] === quantity)}
    </Typography>
  );
};

// Enum for Item Quantity
const ItemQuantity = {
  Full: 1,
  Half: 2,
  Quarter: 3,
};

// Styled components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(0.25),
  fontSize: "14px",
  color: theme.palette.text.primary,
  "&:first-of-type": {
    paddingLeft: theme.spacing(0.5),
  },
  "&:last-of-type": {
    paddingRight: theme.spacing(0.5),
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  height: "2.5rem",
  "&:nth-of-type(even)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
  },
}));

const StyledPagination = styled(TablePagination)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1), // Default padding for desktop

  "& .MuiTablePagination-select": {
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(0.5),
    fontSize: "14px", // Default font size for larger screens
  },

  "& .MuiTablePagination-actions": {
    display: "flex",
    justifyContent: "center", // Center action buttons (next, previous)
    alignItems: "center", // Align buttons vertically
    gap: "8px",
    "& .MuiIconButton-root": {
      color: theme.palette.primary.main,
      "&:disabled": {
        color: theme.palette.action.disabled,
      },
      padding: "8px", // Set padding for the buttons
    },
  },

  // Mobile-specific styles for 320px width
  "@media (max-width: 320px)": {
    padding: theme.spacing(0.5), // Reduce padding for mobile
    fontSize: "10px", // Reduce font size for mobile
    flexDirection: "column", // Stack pagination items vertically
    alignItems: "center", // Center-align everything
    textAlign: "center",

    "& .MuiTablePagination-toolbar": {
      flexDirection: "column", // Stack toolbar items
      alignItems: "center",
      gap: "4px", // Add spacing between elements
    },

    "& .MuiTablePagination-select": {
      fontSize: "10px", // Smaller font size for dropdown
      width: "80px", // Reduce width of dropdown for small screens
      textAlign: "center",
    },

    "& .MuiTablePagination-actions": {
      flexDirection: "row", // Keep action buttons in a row on mobile
      gap: "5px",
      "& .MuiIconButton-root": {
        margin: "0 5px", // Small margin between buttons
        padding: "6px", // Reduce padding for buttons
      },
    },
  },
}));

const MenuOrder = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [gstRate, setGstRate] = useState(0.05); // 5% GST
  const [orderDate, setOrderDate] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const ordersResponse = await axios.get(
          "https://guesthouse-api-dje8gvcwayfdfmbr.eastus-01.azurewebsites.net/api/Orders/OrderItem"
        );
        setOrders(ordersResponse.data);
        console.log(ordersResponse.data);
        const menuItemsResponse = await axios.get(
          "https://guesthouse-api-dje8gvcwayfdfmbr.eastus-01.azurewebsites.net/api/MenuItem"
        );
        setMenuItems(menuItemsResponse.data);
        const orderResponse = await axios.get(
          "https://guesthouse-api-dje8gvcwayfdfmbr.eastus-01.azurewebsites.net/api/Orders"
        );
        //  setOrders(orderResponse.data);
        const fetchedOrders = orderResponse.data;
        const sortedOrders = fetchedOrders.sort(
          (a, b) => new Date(b.orderCreateDate) - new Date(a.orderCreateDate)
        );
        setOrderDate(sortedOrders);
        setOrderDate(orderResponse.data.map((date) => date.orderCreateDate));
        console.log("Fetched order date data:", orderResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const mergedData = useMemo(() => {
    return orders
      .slice()
      .reverse()
      .map((order, index) => {
        const menuItem =
          menuItems.find((item) => item.menuItemId === order.menuItemId) || {};
        return {
          ...order,
          orderItemID: order.orderItemID,
          quantity: order.quantity || ItemQuantity.Full,
          price: order.price || "0",
          orderStatus: order.quantity || OrderStatus.Pending,
          orderCreateDate: orderDate[index] || order.orderCreateDate,
          menuItemName: menuItem.menuItemName || "Unknown Item",
        };
      });
  }, [orders, menuItems, orderDate]);
  const filteredData = useMemo(() => {
    let data = [...mergedData];

    const today = new Date();
    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    const yesterdayEnd = todayStart;

    // Apply filtering logic
    if (filterType === "new") {
      // Filter for today's data
      data = data.filter(
        (order) =>
          new Date(order.orderCreateDate) >= todayStart &&
          new Date(order.orderCreateDate) < todayEnd
      );
    } else if (filterType === "old") {
      // Filter for yesterday's data
      data = data.filter(
        (order) =>
          new Date(order.orderCreateDate) >= yesterdayStart &&
          new Date(order.orderCreateDate) < yesterdayEnd
      );
    }

    // Apply search query
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      data = data.filter((order) => {
        const orderID = order.orderID?.toString()?.toLowerCase() || "";
        const menuItemName = order.menuItemName?.toLowerCase() || "";
        const itemTotal = order.itemTotal?.toString()?.toLowerCase() || "";
        const quantity = order.quantity?.toString()?.toLowerCase() || "";

        return (
          orderID.includes(lowerQuery) ||
          menuItemName.includes(lowerQuery) ||
          itemTotal.includes(lowerQuery) ||
          quantity.includes(lowerQuery)
        );
      });
    }

    return data;
  }, [searchQuery, filterType, mergedData]);
  const handleRowClick = (order) => {
    // Find the menuItem for the selected order
    const menuItem = menuItems.find(
      (item) => item.menuItemId === order.menuItemId
    );

    // Set selected order and menu item name
    setSelectedOrder({
      ...order,
      menuItemName: menuItem ? menuItem.menuItemName : "Unknown Item", // Set menuItemName
    });

    setOpenModal(true);
  };

  // const filteredData = useMemo(() => {
  //   if (!searchQuery) return mergedData;

  //   return mergedData.filter((order) => {
  //     const lowerQuery = searchQuery.toLowerCase();

  //     const orderStatusInfo = getStatusLabel(
  //       order.orderStatus || OrderStatus.Pending,
  //       order.units || ItemQuantity.Full
  //     );
  //     const orderStatusLabel = orderStatusInfo.label
  //       ? orderStatusInfo.label.toLowerCase()
  //       : "";
  //     const orderID = order.orderID?.toString()?.toLowerCase() || "";
  //     const menuItemName = order.menuItemName?.toLowerCase() || "";
  //     const itemTotal = order.itemTotal?.toString()?.toLowerCase() || "";
  //     const quantity = order.quantity?.toString()?.toLowerCase() || "";

  //     return (
  //       orderID.includes(lowerQuery) ||
  //       menuItemName.includes(lowerQuery) ||
  //       itemTotal.includes(lowerQuery) ||
  //       orderStatusLabel.includes(lowerQuery) ||
  //       quantity.includes(lowerQuery)
  //     );
  //   });
  // }, [searchQuery, mergedData]);

  const columns = useMemo(
    () => [
      {
        Header: "Order ID",
        accessor: "orderID",
      },
      {
        Header: "MenuItemName",
        accessor: "menuItemName",
      },
      {
        Header: "Capacity",
        Cell: ({ row }) => (
          <StyledTableCell
          // onClick={() => handleRowClick(row.original)}
          // style={{ cursor: "pointer" }}
          >
            {Object.keys(ItemQuantity).find(
              (key) => ItemQuantity[key] === row.original.quantity
            ) || "Full"}
          </StyledTableCell>
        ),
      },
      // {
      //   Header: "Quantity",
      //   accessor: "quantity",
      // },
      {
        Header: "Units",
        accessor: "units",
      },
      {
        Header: "Total", // Correctly bind and display price here
        Cell: ({ row }) => (
          <StyledTableCell>
            ₹{parseFloat(row.original.itemTotal).toFixed(2)}{" "}
            {/* Display price with 2 decimal places */}
          </StyledTableCell>
        ),
      },
      {
        Header: "Order Status",
        accessor: "orderStatus",
        Cell: ({ row }) => (
          <StyledTableCell>
            {getStatusLabel(row.original.quantity)}
          </StyledTableCell>
        ),
      },

      {
        Header: "Order Date & Time",
        accessor: "orderCreateDate",
        Cell: ({ value }) => {
          const date = new Date(value);
          return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleString(); // Render date or "Invalid Date"
        },
        sortType: (rowA, rowB) => {
          const dateA = new Date(rowA.values.orderCreateDate);
          const dateB = new Date(rowB.values.orderCreateDate);
          return dateA - dateB; // Sort dates
        },
      },
      {
        Header: "Action",
        Cell: ({ row }) => (
          <StyledTableCell
            onClick={() => handleRowClick(row.original)}
            style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
          >
            <VisibilityIcon />
          </StyledTableCell>
        ),
      },
    ],
    [filteredData]
  );

  const data = useMemo(() => filteredData, [filteredData]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageIndex: 0,
        sortBy: [{ id: "orderCreateDate", desc: true }],
      },
    },
    useSortBy,
    usePagination
  );

  const handleCart = () => {
    navigate("/cart"); // Navigate to the cart page
  };

  // const handleRowClick = (order) => {
  //   setSelectedOrder(order);
  //   setOpenModal(true);
  // };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedOrder(null);
  };

  if (loading) {
    return (
      <div
        className="loader"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "#121212",
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
    );
  }

  if (!loading && mergedData.length === 0) {
    return <Typography>No orders found.</Typography>;
  }

  const calculateGrandTotal = () => {
    return filteredData.reduce((acc, row) => {
      // Ensure valid price and units
      const price =
        row.price !== "N/A" && !isNaN(row.price) ? parseFloat(row.price) : 0;
      const units = row.units && !isNaN(row.units) ? parseInt(row.units) : 0;

      // Calculate GST amount and subtotal
      const itemTotal = price * units;
      const gstAmount = itemTotal * gstRate;

      // Add to accumulator
      return acc + itemTotal + gstAmount;
    }, 0);
  };

  const grandTotal = calculateGrandTotal();

  return (
    <div className="top">
      <HeaderProfile />
      {/* <Paper sx={{ width: "100%", padding: 0.8 }}> */}
      <Typography
        variant="h4"
        gutterBottom
        className="order_online"
        style={{ fontSize: window.innerWidth < 320 ? "1.5rem" : "1.2rem" }}
      >
        order online
      </Typography>
      <Box display="flex" alignItems="center" mb={1}>
        <TextField
          type="text"
          className="TextField-Search"
          variant="outlined"
          size="small"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            marginLeft: "14px",
            width: window.innerWidth < 320 ? "100%" : "auto",
          }}
        ></TextField>
        <Box
          display="flex"
          alignItems="center"
          mb={1}
          style={{ marginLeft: "15px", marginTop: "8px" }}
        >
          <TextField
            select
            label="Search"
            variant="outlined"
            size="small"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            SelectProps={{
              native: true,
            }}
            className="custom-select"
            style={{ marginRight: "9px" }}
          >
            <option value="all" className="New-Old">
              All Orders
            </option>
            <option value="new" className="New-Old">
              New Orders
            </option>
            <option value="old" className="New-Old">
              Old Orders
            </option>
          </TextField>
        </Box>
        <Box ml="auto">
          {" "}
          <Button
            className="OrderItem"
            variant="contained"
            color="primary"
            onClick={handleCart}
            style={{
              height: "50px",
              fontFamily: "sans-serif",
              fontWeight: "600",
              textTransform: "capitalize",
              marginLeft: "4px",
            }}
          >
            Order Item
          </Button>
        </Box>
      </Box>

      <TableContainer>
        <Table {...getTableProps()} aria-label="Order Table" className="Table">
          <TableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <StyledTableCell
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    sortDirection={
                      column.isSorted
                        ? column.isSortedDesc
                          ? "desc"
                          : "asc"
                        : false
                    }
                  >
                    <TableSortLabel
                      active={column.isSorted}
                      direction={column.isSortedDesc ? "desc" : "asc"}
                    >
                      {column.render("Header")}
                    </TableSortLabel>
                  </StyledTableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>

          <TableBody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <StyledTableRow>
                  {row.cells.map((cell) => (
                    <StyledTableCell
                      {...cell.getCellProps()}
                      data-label={cell.column.Header}
                    >
                      {cell.render("Cell")}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
              );
            })}
          </TableBody>
          <TableRow className="GRAND-TOTAL">
            <TableCell
              colSpan={5}
              className="grand-total-text"
              style={{ textAlign: "right" }}
            >
              <strong>GRAND TOTAL: GST INCLUDED</strong>{" "}
              <strong style={{ color: "green" }}>
                ₹{grandTotal.toFixed(2)}
              </strong>
            </TableCell>
          </TableRow>
        </Table>
        <div
          className="pagination-container"
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <StyledPagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredData.length}
            rowsPerPage={pageSize}
            page={pageIndex}
            onPageChange={(e, newPage) => gotoPage(newPage)}
            onRowsPerPageChange={(e) => {
              setPageSize(Number(e.target.value));
              gotoPage(0);
            }}
          />
        </div>
      </TableContainer>

      {/* Modal Dialog */}
      <div className="Dialog_Box">
        <Dialog
          open={openModal}
          onClose={handleCloseModal}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            style: { margin: "8px", width: "100%" },
          }}
        >
          <DialogTitle>Order Details</DialogTitle>
          <div
            className="Dialog_Box"
            style={{
              textAlign: "center",
              fontSize: "16px",
              fontFamily: "sans-serif",
              fontWeight: " 700",
            }}
          >
            <DialogContent>
              {selectedOrder ? (
                <Box>
                  <Typography variant="h6">
                    <span
                      style={{
                        fontSize: "16px",
                        fontFamily: "sans-serif",
                        fontWeight: " 700",
                      }}
                    >
                      Order ID:{" "}
                    </span>
                    <span
                      style={{
                        fontSize: "16px",
                        fontFamily: "sans-serif",
                        fontWeight: " 700",
                      }}
                    >
                      {selectedOrder.orderID}
                    </span>
                    <br></br>
                    <br></br>
                  </Typography>
                  <Typography variant="body1" style={{ marginBottom: "8px" }}>
                    <span
                      style={{
                        // color: "red",
                        fontSize: "16px",
                        fontFamily: "sans-serif",
                        fontWeight: " 700",
                      }}
                    >
                      Menu Item Name:
                    </span>
                    <span
                      style={{
                        float: "right",
                        color: "green",
                        marginRight: "20px",
                        fontSize: "16px",
                        fontFamily: "sans-serif",
                        fontWeight: " 700",
                      }}
                    >
                      <span>{selectedOrder.menuItemName}</span>
                    </span>
                  </Typography>

                  <Typography variant="body1">
                    <span
                      style={{
                        marginLeft: "68px",
                        fontSize: "16px",
                        fontFamily: "sans-serif",
                        fontWeight: " 700",
                      }}
                    >
                      Units:
                    </span>{" "}
                    <span
                      style={{
                        float: "right",
                        marginRight: "20px",
                        fontSize: "16px",
                        fontFamily: "sans-serif",
                        fontWeight: " 700",
                      }}
                    >
                      {selectedOrder.units}
                    </span>
                    <br></br>
                    <br></br>
                  </Typography>
                  <Typography variant="body1">
                    <span
                      style={{
                        marginLeft: "83px",
                        fontSize: "16px",
                        fontFamily: "sans-serif",
                        fontWeight: " 700",
                      }}
                    >
                      Total:
                    </span>{" "}
                    <span
                      style={{
                        float: "right",
                        marginRight: "20px",
                        fontSize: "16px",
                        fontFamily: "sans-serif",
                        fontWeight: " 700",
                      }}
                    >
                      {selectedOrder.itemTotal}
                    </span>
                    <br></br>
                    <br></br>
                  </Typography>
                  <Typography variant="body1" style={{ marginBottom: "8px" }}>
                    <span
                      style={{
                        marginLeft: "48px",
                        fontSize: "16px",
                        fontFamily: "sans-serif",
                        fontWeight: " 700",
                      }}
                    >
                      Order Status:{" "}
                    </span>

                    <span
                      style={{
                        float: "right",
                        marginLeft: "8px",
                        fontSize: "16px",
                        fontFamily: "sans-serif",
                        fontWeight: " 700",
                      }}
                    >
                      <span>{getStatusLabel(selectedOrder.orderStatus)}</span>
                    </span>
                  </Typography>
                </Box>
              ) : (
                <Typography>No order details available.</Typography>
              )}
            </DialogContent>
          </div>
          <DialogActions>
            <Button
              onClick={handleCloseModal}
              color="primary"
              style={{
                fontSize: "16px",
                fontFamily: "sans-serif",
                fontWeight: " 700",
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      {/* </Paper> */}
    </div>
  );
};

export default MenuOrder;
