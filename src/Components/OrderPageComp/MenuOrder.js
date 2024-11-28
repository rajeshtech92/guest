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
  padding: theme.spacing(0.5),
  "& .MuiTablePagination-select": {
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(0.25),
  },
  "& .MuiTablePagination-actions": {
    "& .MuiIconButton-root": {
      color: theme.palette.primary.main,
      "&:disabled": {
        color: theme.palette.action.disabled,
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
        Header: "order ID",
        accessor: "orderID",
      },
      {
        Header: "menuItemName",
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
    <>
      <HeaderProfile />
      <Paper sx={{ width: "100%", padding: 0.8 }}>
        <Typography
          variant="h4"
          gutterBottom
          className="order_online"
          // style={{
          //   fontSize: "1.5rem",
          //   fontFamily: "sans-serif",
          //   fontWeight: "600",
          //   marginLeft: "20px",
          //   marginTop:"8px",

          //   color: "#1976d2",
          // }}
        >
          order online
        </Typography>
        <Box display="flex" alignItems="center" mb={1}>
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ marginLeft: "20px" }}
          />
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
            >
              <option value="all">All Orders</option>
              <option value="new">New Orders</option>
              <option value="old">Old Orders</option>
            </TextField>
          </Box>
          <Box ml="auto">
            {" "}
            {/* This box pushes the button to the right */}
            <Button
              variant="contained"
              color="primary"
              onClick={handleCart}
              style={{
                height: "50px",
                fontFamily: "sans-serif",
                fontWeight: "600",
                textTransform: "lowercase",
              }}
            >
              Order Item
            </Button>
          </Box>
        </Box>

        <TableContainer component={Paper}>
          <Table {...getTableProps()} aria-label="Order Table">
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
                  <StyledTableRow
                  // {...row.getRowProps()}
                  // onClick={() => handleRowClick(row.original)}
                  // style={{ cursor: "pointer" }}
                  >
                    {row.cells.map((cell) => (
                      <StyledTableCell {...cell.getCellProps()}>
                        {cell.render("Cell")}
                      </StyledTableCell>
                    ))}
                  </StyledTableRow>
                );
              })}
            </TableBody>
            <TableRow>
              <TableCell colSpan={5} style={{ textAlign: "right" }}>
                <strong>GRAND TOTAL: GST INCLUDED</strong>
              </TableCell>
              <TableCell style={{ color: "green" }}>
                <strong>₹{grandTotal.toFixed(2)}</strong>
              </TableCell>
            </TableRow>
          </Table>
        </TableContainer>

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
        {/* <Box display="flex" alignItems="center" mb={2}>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ marginRight: "20px" }}
        />
        <TextField
          select
          label="Filter Orders"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          variant="outlined"
          size="small"
          SelectProps={{
            native: true,
          }}
        >
          <option value="all">All Orders</option>
          <option value="new">New Orders</option>
          <option value="old">Old Orders</option>
        </TextField>
      </Box>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Menu Item Name</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Order Status</th>
            <th>Order Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((order) => (
            <tr key={order.orderItemID}>
              <td>{order.orderID}</td>
              <td>{order.menuItemName}</td>
              <td>{order.units}</td>
              <td>{order.itemTotal}</td>
              <td>{order.orderStatus}</td>
              <td>{new Date(order.orderCreateDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table> */}

        {/* Modal Dialog */}
        <Dialog open={openModal} onClose={handleCloseModal}>
          <DialogTitle>Order Details</DialogTitle>
          <DialogContent>
            {selectedOrder ? (
              <Box>
                <Typography variant="h6">
                  Order ID: {selectedOrder.orderID}
                </Typography>
                <Typography variant="body1" style={{ marginBottom: "8px" }}>
                  <span style={{ color: "red" }}>Menu Item Name:</span>
                  <span
                    style={{
                      float: "right",
                      color: "green",
                      marginLeft: "12px",
                    }}
                  >
                    {selectedOrder.menuItemName}
                  </span>
                </Typography>
                <Typography variant="body1">
                  Units: {selectedOrder.units}
                </Typography>
                <Typography variant="body1">
                  Total: {selectedOrder.itemTotal}
                </Typography>
                <Typography variant="body1" style={{ marginBottom: "8px" }}>
                  Order Status:{" "}
                  <span style={{ float: "right", marginLeft: "8px" }}>
                    {getStatusLabel(selectedOrder.orderStatus)}
                  </span>
                </Typography>
              </Box>
            ) : (
              <Typography>No order details available.</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </>
  );
};

export default MenuOrder;
