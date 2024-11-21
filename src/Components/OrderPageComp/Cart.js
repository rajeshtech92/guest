import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOrder } from "./OrderContext";
import { v4 as uuidv4 } from "uuid";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Card from "@mui/material/Card";
import "./Cart.css";

const Cart = () => {
  const navigate = useNavigate();
  const { addToOrder } = useOrder();
  // Enum for Item Quantity
  const ItemQuantity = {
    Full: 1,
    Half: 2,
    Quarter: 3,
  };
  // Function to get the quantity label for each item based on menuItemId
  const getQuantityLabel = (quantity) => {
    switch (quantity) {
      case ItemQuantity.Full:
        return "Full";
      case ItemQuantity.Half:
        return "Half";
      case ItemQuantity.Quarter:
        return "Quarter";
      default:
        return "Unknown";
    }
  };
  const [menus, setMenus] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [subMenuPrices, setSubMenuPrices] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState([]);
  const [inputRows, setInputRows] = useState([
    { id: uuidv4(), menuItemId: "", unit: 1 },
  ]);
  const [gstRate, setGstRate] = useState(0.05); // 5% GST
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const res = await fetch(
          "https://guesthouse-api-dje8gvcwayfdfmbr.eastus-01.azurewebsites.net/api/Menu"
        );
        const data = await res.json();
        setMenus(data);
        console.log("All menus:", data);
      } catch (error) {
        console.error("Error fetching menu data:", error);
      }
    };
    fetchMenus();
  }, []);

  useEffect(() => {
    if (selectedMenu) {
      const fetchData = async () => {
        try {
          const menuItemRes = await fetch(
            "https://guesthouse-api-dje8gvcwayfdfmbr.eastus-01.azurewebsites.net/api/MenuItem"
          );
          const menuItemData = await menuItemRes.json();
          setMenuItems(menuItemData);
          console.log("All menu items:", menuItemData);

          const subMenuPriceRes = await fetch(
            "https://guesthouse-api-dje8gvcwayfdfmbr.eastus-01.azurewebsites.net/api/SubmenuPrice"
          );
          const subMenuPriceData = await subMenuPriceRes.json();
          setSubMenuPrices(subMenuPriceData);
          console.log("All submenu prices:", subMenuPriceData);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }
  }, [selectedMenu]);

  // const handleMenuChange = (event) => {
  //   setSelectedMenu(event.target.value);
  // };
  const handleMenuChange = (event) => {
    const {
      target: { value },
    } = event;

    // Ensure value is always an array
    setSelectedMenu(typeof value === "string" ? value.split(",") : value);
  };

  const handleMenuItemChange = (event, rowId) => {
    const [menuItemId, price, quantity] = event.target.value.split("-");

    const updatedRows = inputRows.map((row) => {
      if (row.id === rowId) {
        return {
          ...row,
          menuItemId,
          price: parseFloat(price),
          quantity,
          // Keep quantity unchanged
        };
      }
      return row;
    });

    setInputRows(updatedRows);
  };

  //  const handleMenuItemChange = (event, rowId) => {
  //   const updatedRows = inputRows.map((row) => {
  //     if (row.id === rowId) {
  //       return { ...row, menuItemId: event.target.value };
  //     }
  //     return row;
  //   });
  //   setInputRows(updatedRows);
  // };

  const handleQuantityChange = (newQuantity, rowId) => {
    const updatedRows = inputRows.map((row) => {
      if (row.id === rowId) {
        const unit = Math.max(newQuantity, 0); // Ensure the quantity doesn't go below 0
        const totalPrice = parseFloat(row.price) * newQuantity; // Recalculate total price
        const gstRate = 0.05; // GST rate (5%)
        const gstAmount = totalPrice * gstRate; // Recalculate GST amount
        const grandTotal = totalPrice + gstAmount;
        return {
          ...row,
          unit, // Update quantity
          totalPrice, // Update total price
          gstAmount, // Update GST amount
          grandTotal,
        };
      }
      return row;
    });

    setInputRows(updatedRows); // Update state with the new data
  };

  const handleAddRow = () => {
    setInputRows([...inputRows, { id: uuidv4(), menuItemId: "", unit: 0 }]);
  };

  const handleRemoveRow = (id) => {
    if (inputRows.length > 1) {
      setInputRows(inputRows.filter((row) => row.id !== id));
    }
  };

  const calculateTotals = (row) => {
    const subMenuPrice = subMenuPrices.find(
      (item) => item.menuItemId === row.menuItemId
    );
    const rowPrice = subMenuPrice ? subMenuPrice.price : 0;
    const rowTotalPrice = rowPrice * row.unit;
    const gstAmount = rowTotalPrice * gstRate;

    return {
      price: rowPrice,
      totalPrice: rowTotalPrice,
      gstAmount: gstAmount,
    };
  };
  const handleAddToOrder = async () => {
    navigate("/menuOrder");
    const newOrderId = 0;
    console.log(selectedMenu);
    console.log(inputRows);

    const orderItems = [];

    // Iterate over each menuId in selectedMenu
    selectedMenu.forEach((menuId, index) => {
      // Create an order item for each row in inputRows
      // Only use the first menuId for each menuItemId
      if (index < inputRows.length) {
        const row = inputRows[index]; // Ensure you only access existing rows
        orderItems.push({
          orderItemID: 0, // Adjust according to your API requirements
          orderID: newOrderId,
          menuId: parseInt(menuId), // Current menuId from selectedMenu
          menuItemId: parseInt(row.menuItemId),
          quantity: parseInt(row.quantity),
          price: parseFloat(row.price),
        });
      }
    });

    try {
      console.log(orderItems);
      const response = await fetch(
        "https://guesthouse-api-dje8gvcwayfdfmbr.eastus-01.azurewebsites.net/api/Orders",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: newOrderId,
            orderType: 1, // Adjust according to your needs
            orderStatus: 1, // Adjust according to your needs
            orderCreateDate: new Date().toISOString(), // Current date-time
            totalAmount: 0, // Total amount of the order including GST
            isActive: true,
            orderItem: orderItems,
          }),
        }
      );

      // Handle the response here if needed

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error posting order:", errorText);
        return;
      }

      const result = await response.json();
      console.log("Order Posted:", result);

      // Save to localStorage
      localStorage.setItem("order", JSON.stringify(result));

      // Add to order context
      inputRows.forEach((row) => {
        const menuItem = menuItems.find(
          (item) => item.menuItemId === row.menuItemId
        );
        const totals = calculateTotals(row);
        addToOrder({
          menuItemName: menuItem?.menuItemName,
          itemQuantity: row.quantity,
          price: row.price,
          totalPrice: totals.totalPrice,
          gstAmount: totals.gstAmount,
          // Remove finalTotal
        });
      });
    } catch (error) {
      console.error("Error posting order:", error);
    }
  };

  const calculateGrandTotal = () => {
    const subtotal = inputRows.reduce((acc, row) => {
      const totals = calculateTotals(row);
      return acc + totals.totalPrice;
    }, 0);

    const totalGst = inputRows.reduce((acc, row) => {
      const totals = calculateTotals(row);
      return acc + totals.gstAmount;
    }, 0);

    return subtotal + totalGst;
  };

  const grandTotal = calculateGrandTotal();
  return (
    <div>
      <h4 className="pageTitle">ordering standard</h4>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: "20px",
          marginLeft: "auto",
          marginRight: "22px",
        }}
      >
        <div>Select Your Menu</div>
        <Select
          multiple
          value={selectedMenu} // Ensure this is an array
          onChange={handleMenuChange}
          displayEmpty
          sx={{
            width: "225px",
            height: "40px",
            marginTop: "20px",
            marginBottom: "20px",
          }}
          renderValue={(selected) => {
            if (selected.length === 0) {
              return <em>Select Menu</em>;
            }
            return menus
              .filter((menu) => selected.includes(menu.menuId))
              .map((menu) => menu.menuName)
              .join(", ");
          }}
        >
          <MenuItem value="" disabled>
            Select Menu
          </MenuItem>
          {menus.map((menu) => (
            <MenuItem key={menu.menuId} value={menu.menuId}>
              {menu.menuName}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <TableContainer>
        <Card sx={{ maxWidth: 1400, marginLeft: "20px", marginBottom: "20px" }}>
          <Table>
            <TableHead className="back-ground">
              <TableRow>
                <TableCell className="texts-color">Sno</TableCell>
                <TableCell className="texts-color">Menu Item</TableCell>
                <TableCell className="texts-color">Unit</TableCell>
                <TableCell className="texts-color">Price</TableCell>
                <TableCell className="texts-color">Total</TableCell>
                <TableCell className="texts-color">GST (5%)</TableCell>
                {/* Remove Final Total Column */}
                <TableCell className="texts-color">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inputRows.map((row, index) => {
                const totals = calculateTotals(row);

                return (
                  <TableRow key={row.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Select
                        value={
                          row.menuItemId
                            ? `${row.menuItemId}-${row.price}-${row.quantity}`
                            : ""
                        }
                        onChange={(event) =>
                          handleMenuItemChange(event, row.id)
                        }
                        displayEmpty
                        sx={{ width: "340px", height: "40px" }}
                      >
                        <MenuItem value="" disabled>
                          Select Menu Item
                        </MenuItem>
                        {menuItems
                          .filter((item) => selectedMenu.includes(item.menuId))
                          .map((item) =>
                            subMenuPrices
                              .filter(
                                (subMenu) =>
                                  subMenu.menuItemId === item.menuItemId
                              )
                              .map((subMenu) => (
                                <MenuItem
                                  key={`${item.menuItemId}-${subMenu.price}-${subMenu.quantity}`}
                                  value={`${subMenu.menuItemId}-${subMenu.price}-${subMenu.quantity}`}
                                >
                                  {item.menuItemName} -{" "}
                                  {getQuantityLabel(subMenu.quantity)}
                                </MenuItem>
                              ))
                          )}
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginRight: "70%",
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faMinusCircle}
                          style={{
                            fontSize: 30,
                            cursor:
                              row.unit <= 0 || !row.menuItemId
                                ? "not-allowed"
                                : "pointer",
                          }}
                          onClick={() => {
                            if (row.menuItemId && row.unit > 0) {
                              handleQuantityChange(row.unit - 1, row.id);
                            }
                          }}
                          color={row.unit <= 3 ? "#e53935" : "grey"}
                          disabled={!row.menuItemId || row.unit <= 0}
                        />

                        <input
                          type="text"
                          value={row.unit}
                          readOnly
                          style={{
                            width: "50px",
                            height: "30px",
                            textAlign: "center",
                            lineHeight: "30px",
                            margin: "0 15px",
                            background: "#fafafa",
                            color: "black",
                            paddingLeft: "5px",
                            fontSize: "12px",
                          }}
                        />
                        <FontAwesomeIcon
                          icon={faPlusCircle}
                          style={{
                            fontSize: 30,
                            cursor:
                              row.unit >= 20 || !row.menuItemId
                                ? "not-allowed"
                                : "pointer",
                          }}
                          onClick={() => {
                            if (row.menuItemId && row.unit < 20) {
                              handleQuantityChange(row.unit + 1, row.id);
                            }
                          }}
                          color={row.unit < 4 ? "green" : "black"}
                          disabled={!row.menuItemId || row.unit >= 3}
                        />
                      </div>
                    </TableCell>

                    <TableCell>
                      ₹{row.price ? row.price.toFixed(2) : "0.00"}
                    </TableCell>
                    <TableCell>
                      ₹{row.totalPrice ? row.totalPrice.toFixed(2) : "0.00"}
                    </TableCell>
                    <TableCell>
                      ₹{row.gstAmount ? row.gstAmount.toFixed(2) : "0.00"}
                    </TableCell>
                    <TableCell>
                      <Grid container spacing={1} justifyContent="center">
                        <Grid item>
                          {index === inputRows.length - 1 && (
                            <IconButton
                              className="icon-add"
                              onClick={handleAddRow}
                              style={{
                                background: "green",
                                color: "white",
                                width: "30px",
                                height: "30px",
                                fontSize: 30,
                              }}
                            >
                              <AddIcon />
                            </IconButton>
                          )}
                          {inputRows.length > 1 && (
                            <IconButton
                              className="icon-btn-minus"
                              onClick={() => handleRemoveRow(row.id)}
                              style={{
                                background: "#e53935",
                                color: "white",
                                width: "30px",
                                height: "30px",
                                fontSize: 30,
                                marginLeft: "3px",
                              }}
                            >
                              <RemoveIcon />
                            </IconButton>
                          )}
                        </Grid>
                      </Grid>
                    </TableCell>
                  </TableRow>
                );
              })}

              <TableRow>
                <TableCell
                  colSpan={5}
                  style={{ textAlign: "right", color: "red" }}
                >
                  <strong>GRAND TOTAL: GST INCLUDED</strong>
                </TableCell>
                <TableCell style={{ color: "green" }}>
                  <strong>
                    ₹
                    {inputRows
                      .reduce((sum, row) => sum + (row.grandTotal || 0), 0)
                      .toFixed(2)}
                  </strong>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
        <Box sx={{ textAlign: "center", marginTop: "20px" }}>
          <Button
            variant="contained"
            onClick={handleAddToOrder}
            style={{
              height: "50px",
              background: "#5c6bc0",
              fontFamily: "sans-serif",
              fontWeight: "600",
              float: "right",
              marginRight: "18px",
              textTransform: "lowercase",
              marginBottom: "8px",
            }}
          >
            Place Order
          </Button>
        </Box>
      </TableContainer>
    </div>
  );
};

export default Cart;
