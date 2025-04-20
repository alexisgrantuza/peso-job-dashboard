// pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Card, CardContent, Typography, Grid } from "@mui/material";

const Dashboard = () => {
  const [totalAdmins, setTotalAdmins] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/dashboard/stats", {
          headers: {
            Authorization: `Bearer ${token}`, // Only if protected
          },
        });
        setTotalAdmins(res.data.totalAdmins);
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Admins</Typography>
              <Typography variant="h4" color="primary">
                {totalAdmins}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
