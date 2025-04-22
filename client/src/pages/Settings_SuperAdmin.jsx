import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Paper,
  Box,
} from "@mui/material";

const Settings = () => {
  const [superadmin, setSuperadmin] = useState({ name: "", email: "", role: "" });
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    const fetchSuperadmin = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/settings/credentials", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        setSuperadmin(data);
        setFormData({ name: data.name, email: data.email, password: "" });
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchSuperadmin();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    // Prepare the data to send to the backend
    let dataToSend = {
      name: formData.name,
      email: formData.email,
      password: formData.password.trim() === "" ? null : formData.password, // Send null for password if blank
    };

    try {
      const res = await fetch("http://localhost:5000/api/settings/credentials", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await res.json();
      if (res.ok) {
        setSuperadmin(prev => ({
          ...prev,
          name: formData.name,
          email: formData.email,
        }));
        setEditing(false);
      } else {
        alert(data.message || "Update failed");
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>Superadmin Settings</Typography>
      <Paper elevation={3} style={{ padding: "20px", maxWidth: "500px" }}>
        {!editing ? (
          <>
            <Typography><strong>Name:</strong> {superadmin.name}</Typography>
            <Typography><strong>Email:</strong> {superadmin.email}</Typography>
            <Typography><strong>Role:</strong> superadmin</Typography>
            <Button variant="contained" onClick={() => setEditing(true)} style={{ marginTop: "10px" }}>Edit</Button>
          </>
        ) : (
          <>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              type="password"
              fullWidth
              margin="normal"
            />
            <Typography mt={2}><strong>Role:</strong> superadmin</Typography>
            <Box mt={2}>
              <Button variant="contained" color="primary" onClick={handleSave}>Save</Button>
              <Button onClick={() => setEditing(false)} style={{ marginLeft: "10px" }}>Cancel</Button>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default Settings;
