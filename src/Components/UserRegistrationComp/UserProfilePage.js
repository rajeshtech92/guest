import React, { useState, useEffect } from "react";
import "./UserProfilePage.css";
import { useNavigate, useParams } from "react-router-dom";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";
import axios from "axios";
import profilePic from "../ImageCom/profile-pic.png";
import HeaderProfile from "../HeaderComp/HeaderProfile";
import Footer from "../FooterComp/Footer";

const OrderStatus = {
  Pending: 1,
  InProgress: 2,
  Delivered: 3,
};

function UserProfilePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [submenuPrices, setSubmenuPrices] = useState([]);
  const [gstRate, setGstRate] = useState(0.05); // 5% GST
  const storedId = localStorage.getItem("userId");

  useEffect(() => {
    // Fetch user data
    axios
      .get(`https://guesthouse-api-dje8gvcwayfdfmbr.eastus-01.azurewebsites.net/api/Users/${storedId}`)
      .then((response) => {
        setUserData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setError(error);
        setLoading(false);
      });

    // Fetch orders
    axios
      .get(`https://guesthouse-api-dje8gvcwayfdfmbr.eastus-01.azurewebsites.net/api/Orders`)
      .then((response) => {
        setOrders(response.data);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });

    // Fetch submenu prices
    axios
      .get(`https://guesthouse-api-dje8gvcwayfdfmbr.eastus-01.azurewebsites.net/api/SubmenuPrice`)
      .then((response) => {
        setSubmenuPrices(response.data);
      })
      .catch((error) => {
        console.error("Error fetching submenu prices:", error);
      });
  }, [storedId]);

  function LogOut() {
    navigate("/login");
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    handleClose();
  };

  const calculateGrandTotal = () => {
    const total = submenuPrices.reduce((acc, item) => acc + item.price, 0); // Assume submenuPrices has a price property
    return total + total * gstRate; // Total plus GST
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading user data</div>;

  return (
    <div className="background-Color">
      <HeaderProfile />
      <div className="main-body">
        <nav aria-label="breadcrumb" className="main-breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/headerHome">Home</a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              User Profile
            </li>
          </ol>
        </nav>
        <div className="row gutters-sm">
          <div className="col-md-4 mb-3">
            <div className="cards">
              <div className="cards-body" style={{marginTop:"30px"}}>
                <div className="d-flex flex-column align-items-center text-center">
                  <img
                    src={profilePic}
                    alt="Admin"
                    className="rounded-circle"
                    width="150"
                  />
                  <div className="mt-3">
                    <h4>
                      {userData.firstName} {userData.lastName}
                    </h4>
                    <p className="text-secondary mb-1"></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-8">
            <div className="cards mb-3">
              <div className="cards-body">
                {/* User information rendering */}
                <div className="row">
                  <div className="col-sm-3">
                    <h6 className="mb-0">Full Name</h6>
                  </div>
                  <div className="col-sm-9 text-secondary">
                    {userData.firstName} {userData.lastName}
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-3">
                    <h6 className="mb-0">Email</h6>
                  </div>
                  <div className="col-sm-9 text-secondary">
                    {userData.email}
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-3">
                    <h6 className="mb-0">Phone</h6>
                  </div>
                  <div className="col-sm-9 text-secondary">
                    {userData.phoneNumber}
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-3">
                    <h6 className="mb-0">Address</h6>
                  </div>
                  <div className="col-sm-9 text-secondary">
                    {userData.address}
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-12">
                    <button
                      className="btn btn-info"
                      onClick={handleClickOpen}
                    >
                      Edit
                    </button>
                    <Dialog open={open} onClose={handleClose}>
                      <DialogTitle>Edit User Profile</DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          To edit your user profile, please modify the fields
                          below and click save.
                        </DialogContentText>
                        <TextField
                          autoFocus
                          margin="dense"
                          id="name"
                          label="Full Name"
                          type="text"
                          fullWidth
                          defaultValue={`${userData.firstName} ${userData.lastName}`}
                        />
                        <TextField
                          margin="dense"
                          id="email"
                          label="Email Address"
                          type="email"
                          fullWidth
                          defaultValue={userData.email}
                        />
                        <TextField
                          margin="dense"
                          id="phone"
                          label="Phone Number"
                          type="tel"
                          fullWidth
                          defaultValue={userData.phoneNumber}
                        />
                        <TextField
                          margin="dense"
                          id="address"
                          label="Address"
                          type="text"
                          fullWidth
                          defaultValue={userData.address}
                        />
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleClose} color="primary">
                          Cancel
                        </Button>
                        <Button onClick={handleSave} color="primary">
                          Save
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Orders Section */}
          {/* <div className="cards mt-3">
            <div className="cards-body">
              <h5>Your Orders</h5>
              <div className="order-table">
                <div className="order-row header">
                  <div className="order-cell">Order ID</div>
                  <div className="order-cell">Date</div>
                  <div className="order-cell">Status</div>
                </div>
                {orders.map((order, index) => (
                  <div className="order-row" key={index}>
                    <div className="order-cell">Order : {order.orderId}</div>
                    <div className="order-cell">
                      {new Date(order.orderCreateDate).toLocaleString()}
                    </div>
                    <div className="order-cell">
                      {Object.keys(OrderStatus).find(
                        (key) => OrderStatus[key] === order.orderStatus
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <h6 style={{ float: "right", color:"red" }}>
                Grand Total: <span style={{ color: "green" }}>${calculateGrandTotal().toFixed(2)}</span> (GST
                included)
              </h6>
            </div>
          </div> */}
        </div>
      </div>
      <Footer setLoading={setLoading}/>
    </div>
  );
}

export default UserProfilePage;
