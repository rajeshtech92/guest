import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
  CircularProgress,
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

// Enum for Order Status
const OrderStatus = {
  Pending: 1,
  InProgress: 2,
  Delivered: 3,
};

const getStatusLabel = (status) => {
  switch (status) {
    case OrderStatus.Pending:
      return (
        <Typography
          style={{
            background: "red",
            color: "white",
            fontWeight: "600",
            fontSize: "12px",
            borderRadius: "30px",
            width: "130%",
            textAlign: "center",
          }}
        >
          Pending
        </Typography>
      );
    case OrderStatus.InProgress:
      return (
        <Typography
          style={{
            background: "orange",
            borderRadius: "30px",
            width: "130%",
            textAlign: "center",
          }}
        >
          In Progress
        </Typography>
      );
    case OrderStatus.Delivered:
      return (
        <Typography
          style={{
            background: "green",
            borderRadius: "30px",
            width: "130%",
            maxWidth: "100%",
            textAlign: "center",
          }}
        >
          Delivered
        </Typography>
      );
    default:
      return "Unknown";
  }
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

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  color: theme.palette.common.white,
  borderBottom: "2px solid gray",
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
  const [submenuPrices, setSubmenuPrices] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterInput, setFilterInput] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [gstRate, setGstRate] = useState(0.05); // 5% GST
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [ordersResponse, submenuPricesResponse, menuItemsResponse] =
          await Promise.all([
            axios.get(
              "https://guesthouse-api-dje8gvcwayfdfmbr.eastus-01.azurewebsites.net/api/Orders"
            ),
            axios.get(
              "https://guesthouse-api-dje8gvcwayfdfmbr.eastus-01.azurewebsites.net/api/SubmenuPrice"
            ),
            axios.get(
              "https://guesthouse-api-dje8gvcwayfdfmbr.eastus-01.azurewebsites.net/api/MenuItem"
            ),
          ]);
        setOrders(ordersResponse.data);
        setSubmenuPrices(submenuPricesResponse.data);
        setMenuItems(menuItemsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Merged data from orders, submenuPrices, and menuItems
  const mergedData = useMemo(() => {
    return orders.map((order) => {
      const submenu =
        submenuPrices.find((sub) => sub.menuItemId === order.orderId) || {};
      const menuItem =
        menuItems.find((item) => item.menuItemId === order.orderId) || {};
      return {
        ...order,
        quantity: submenu.quantity || ItemQuantity.Full, // Default to Full if no quantity is available
        price: submenu.price || "N/A",
        orderStatus: order.orderStatus || OrderStatus.Pending, // Default to 'Pending' if undefined
        menuItemName: menuItem.menuItemName || "Unknown Item", // Ensure menuItemName is added here
      };
    });
  }, [orders, submenuPrices, menuItems]);

  // Handle filter change for searching
  const handleFilterChange = (e) => {
    setFilterInput(e.target.value || "");
  };

  // Filtered data based on search input
  const filteredData = useMemo(() => {
    if (!filterInput) return mergedData;
    return mergedData.filter(
      (order) =>
        order.orderType.toLowerCase().includes(filterInput.toLowerCase()) ||
        getStatusLabel(order.orderStatus)
          .toLowerCase()
          .includes(filterInput.toLowerCase())
    );
  }, [filterInput, mergedData]);
  // Styled TableHead with background and text color for all headers
  const StyledTableHead = styled(TableHead)(({ theme }) => ({
    "& th": {
      backgroundColor: "#1976d2", // Global header background color
      color: "white", // Global header text color
      fontWeight: "bold", // Bold text for headers
      // textAlign: "center",
      padding: theme.spacing(1), // Padding for header cells
    },
    // borderBottom: "2px solid gray",
  }));
  const columns = useMemo(
    () => [
      {
        Header: "Order ID",
        accessor: "orderId",
        getHeaderProps: () => ({
          style: {
            backgroundColor: "darkblue", // Background color for the header
            color: "white", // Text color for the header
            fontWeight: "bold", // Optional: Make the text bold
            textAlign: "center", // Optional: Center the text
          },
        }),
        Cell: ({ value }) => {
          // Define color based on the orderId value
          const getOrderIdColor = (orderId) => {
            if (orderId % 2 === 0) return "purple"; // Even Order ID
            return "blue"; // Odd Order ID
          };

          return (
            <StyledTableCell style={{ color: getOrderIdColor(value) }}>
              {value}
            </StyledTableCell>
          );
        },
      },

      {
        Header: "Capacity",
        Cell: ({ row }) => {
          const quantityLabel =
            Object.keys(ItemQuantity).find(
              (key) => ItemQuantity[key] === row.original.quantity
            ) || "Full";

          // Define color based on quantity
          const getQuantityColor = (quantity) => {
            switch (quantity) {
              case "Full":
                return "green";
              case "Half":
                return "orange";
              case "Quarter":
                return "red";
              default:
                return "black";
            }
          };

          return (
            <StyledTableCell
              style={{ color: getQuantityColor(quantityLabel) }}
              onClick={() => handleRowClick(row.original)}
            >
              {quantityLabel}
            </StyledTableCell>
          );
        },
      },

      {
        Header: "Quantity",
        accessor: "quantity",
        Cell: ({ value }) => {
          // Define color based on the quantity value
          const getQuantityColor = (quantity) => {
            if (quantity === 1) return "green"; // Full quantity
            if (quantity === 2) return "orange"; // Half quantity
            if (quantity === 3) return "red"; // Quarter quantity
            return "black"; // Default for unknown quantities
          };

          return (
            <StyledTableCell
              style={{ color: getQuantityColor(value), paddingLeft: "15px" }}
            >
              {value}
            </StyledTableCell>
          );
        },
      },

      {
        Header: "Price",
        accessor: "price",
        Cell: ({ value }) => {
          // Define color based on the price value
          const getPriceColor = (price) => {
            if (price === "N/A") return "#cddc39"; // Default color for missing prices
            if (price < 20) return "green"; // Cheap price
            if (price >= 20 && price < 50) return "orange"; // Moderate price
            return "red"; // Expensive price
          };

          const priceValue = value !== "N/A" ? `₹${value.toFixed(2)}` : "N/A";

          return (
            <StyledTableCell style={{ color: getPriceColor(value) }}>
              {priceValue}
            </StyledTableCell>
          );
        },
      },

      {
        Header: "Order Status",
        accessor: "orderStatus",
        Cell: ({ value }) => (
          <StyledTableCell>{getStatusLabel(value)}</StyledTableCell>
        ),
      },
      {
        Header: "Order Date & Time",
        accessor: "orderCreateDate",
        Cell: ({ value }) => {
          const date = new Date(value);
          const now = new Date();

          // Check if the date is in the past or future
          const isFuture = date > now;

          // Define color based on whether the date is in the past or future
          const dateColor = isFuture ? "green" : "red";

          return isNaN(date.getTime()) ? (
            "Invalid Date"
          ) : (
            <StyledTableCell style={{ color: dateColor }}>
              {date.toLocaleString()}
            </StyledTableCell>
          );
        },
        sortType: (rowA, rowB) =>
          new Date(rowA.values.orderCreateDate) -
          new Date(rowB.values.orderCreateDate),
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
      initialState: { pageIndex: 0 },
    },
    useSortBy,
    usePagination
  );

  const handleCart = () => {
    navigate("/cart"); // Navigate to the cart page
  };

  const handleRowClick = (order) => {
    setSelectedOrder(order);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedOrder(null);
  };

  const handleSave = () => {
    // Handle save logic here
    // Example: updateOrders(selectedOrder);
    handleCloseModal();
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  if (!loading && mergedData.length === 0) {
    return <Typography>No orders found.</Typography>;
  }
  const calculateTotals = (row) => {
    const price = row.price !== "N/A" ? parseFloat(row.price) : 0;
    const gstAmount = price * gstRate; // Use gstRate from state
    const totalPrice = price + gstAmount;

    return { totalPrice, gstAmount };
  };

  const calculateGrandTotal = () => {
    const subtotal = filteredData.reduce((acc, row) => {
      const totals = calculateTotals(row);
      return acc + totals.totalPrice;
    }, 0);

    return subtotal; // totalGst calculation is not needed as it is included in the subtotal
  };

  // Get the grand total
  const grandTotal = calculateGrandTotal();

  return (
    <Paper sx={{ width: "100%", padding: 1 }}>
      <Box display="flex" alignItems="center" mb={1}>
        <Typography
          variant="h4"
          gutterBottom
          style={{
            fontSize: "1.5rem",
            fontFamily: "sans-serif",
            fontWeight: "600",
            marginLeft: "6px",
            color: "#1976d2",
          }}
        >
          Order Table managament
        </Typography>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={filterInput}
          onChange={handleFilterChange}
          style={{ marginLeft: "20px" }}
        />
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
            }}
          >
            Go to Cart
          </Button>
        </Box>
      </Box>

      <TableContainer>
        <Table {...getTableProps()} size="small">
          <StyledTableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <StyledTableCell
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                  >
                    {column.render("Header")}
                    {column.canSort ? (
                      <TableSortLabel
                        active={column.isSorted}
                        direction={column.isSortedDesc ? "desc" : "asc"}
                      />
                    ) : null}
                  </StyledTableCell>
                ))}
              </TableRow>
            ))}
          </StyledTableHead>
          <TableBody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <StyledTableRow {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <StyledTableCell {...cell.getCellProps()}>
                      {cell.render("Cell")}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
              );
            })}
          </TableBody>
          {/* Add Grand Total Row */}
          <TableRow>
            <TableCell colSpan={5} style={{ textAlign: "right", color: "red" }}>
              <strong>GRAND TOTAL: GST INCLUDED</strong>
            </TableCell>
            <TableCell style={{ color: "green" }}>
              <strong>₹{grandTotal.toFixed(2)}</strong>
            </TableCell>
          </TableRow>
        </Table>
      </TableContainer>

      <StyledPagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={data.length}
        rowsPerPage={pageSize}
        page={pageIndex}
        onPageChange={(event, newPage) => gotoPage(newPage)}
        onRowsPerPageChange={(event) => setPageSize(Number(event.target.value))}
      />
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle style={{ textAlign: "center", color: "red" }}>
          Item Details
        </DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box display="flex" flexDirection="column" alignItems="center">
              <Typography variant="h6" style={{ marginBottom: "16px" }}>
                Order ID:{" "}
                <span style={{ float: "right" }}>{selectedOrder.orderId}</span>
              </Typography>
              <Typography variant="body1" style={{ marginBottom: "8px" }}>
                <span style={{ color: "red" }}>Menu Item Name:</span>
                <span
                  style={{ float: "right", color: "green", marginLeft: "12px" }}
                >
                  {selectedOrder.menuItemName}
                </span>
              </Typography>
              <Typography
                variant="body1"
                style={{ marginBottom: "8px", marginLeft: "8px" }}
              >
                Quantity:
                <span style={{ float: "right", marginLeft: "8px" }}>
                  {Object.keys(ItemQuantity).find(
                    (key) => ItemQuantity[key] === selectedOrder.quantity
                  ) || "Full"}
                </span>
              </Typography>
              <Typography variant="body1" style={{ marginBottom: "8px" }}>
                Price:{" "}
                <span style={{ float: "right", marginLeft: "8px" }}>
                  {selectedOrder.price}
                </span>
              </Typography>
              <Typography variant="body1" style={{ marginBottom: "8px" }}>
                Order Status:{" "}
                <span style={{ float: "right", marginLeft: "8px" }}>
                  {getStatusLabel(selectedOrder.orderStatus)}
                </span>
              </Typography>
              {/* <Typography variant="body1" style={{ marginBottom: '8px' }}>
          Order Date & Time: <span style={{ float: "right" }}>
            {new Date(selectedOrder.orderCreateDate).toLocaleString()}
          </span>
        </Typography> */}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
          {/* <Button onClick={handleSave} color="primary">
      Save
    </Button> */}
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default MenuOrder;
