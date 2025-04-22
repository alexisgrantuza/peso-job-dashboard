import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useTheme } from "@mui/material/styles";
import * as XLSX from "xlsx";

const ManageApplicants = () => {
  const theme = useTheme();
  const [applicants, setApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchApplicants();
  }, []);

  useEffect(() => {
    let data = [...applicants];
    if (searchTerm) {
      data = data.filter(
        (item) =>
          item.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter) {
      data = data.filter((item) => item.status.toLowerCase() === statusFilter);
    }
    setFilteredApplicants(data);
  }, [searchTerm, statusFilter, applicants]);

  const fetchApplicants = async () => {
    try {
      const token = localStorage.getItem("token"); // Ensure token is saved in localStorage after login

      const response = await axios.get(
        "http://localhost:5000/api/applicants",
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach token to the Authorization header
          },
        }
      );
      const applicantsWithId = response.data.map((app, index) => ({
        ...app,
        id: app.application_id,
      }));
      setApplicants(applicantsWithId);
    } catch (error) {
      setError("Failed to fetch applicants.");
    }
  };

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredApplicants);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Applicants");
    XLSX.writeFile(workbook, "Applicants.xlsx");
  };

  const columns = [
    { field: "application_id", headerName: "Application ID", width: 120 },
    { field: "first_name", headerName: "First Name", width: 150 },
    { field: "last_name", headerName: "Last Name", width: 150 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "job_title", headerName: "Job Title", width: 200 },
    {
      field: "status",
      headerName: "Status",
      width: 140,
      renderCell: (params) => {
        const status = params.value.toLowerCase(); // Make sure to convert to lowercase
        let color, bgColor;
        switch (status) {
          case "pending":
            color = theme.palette.warning.main;
            bgColor = theme.palette.warning.light;
            break;
          case "approved":
            color = theme.palette.success.main;
            bgColor = theme.palette.success.light;
            break;
          case "declined":
            color = theme.palette.error.main;
            bgColor = theme.palette.error.light;
            break;
          default:
            color = theme.palette.grey[800];
            bgColor = theme.palette.grey[300];
        }
        return (
          <Box
            sx={{
              px: 1,
              py: 0.1,
              borderRadius: "12px",
              fontWeight: 500,
              fontSize: "0.8rem",
              bgcolor: bgColor,
              color: "#fff",
              textTransform: "capitalize", // Capitalize the text
              width: "fit-content",
            }}
          >
            {status}
          </Box>
        );
      },
    },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
         Applicants Record
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          label="Search by Name or Email"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Status"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="declined">Declined</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" onClick={handleExport}>
          Export to Excel
        </Button>
      </Box>

      <Paper sx={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={filteredApplicants}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </Paper>
    </Box>
  );
};

export default ManageApplicants;
