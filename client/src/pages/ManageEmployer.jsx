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

const ManageEmployer = () => {
  const theme = useTheme();
  const [employers, setEmployers] = useState([]);
  const [filteredEmployers, setFilteredEmployers] = useState([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchEmployers();
  }, []);

  useEffect(() => {
    let data = [...employers];
    if (searchTerm) {
      data = data.filter((employer) =>
        employer.business_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter) {
      data = data.filter((employer) => employer.status === statusFilter);
    }
    setFilteredEmployers(data);
  }, [searchTerm, statusFilter, employers]);

  const fetchEmployers = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token provided. Please log in.");
      return;
    }

    try {
      const response = await axios.get("http://localhost:5000/api/employers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const employersWithId = response.data.map((employer) => ({
        ...employer,
        id: employer.employer_id, // Make sure to assign a unique ID
      }));
      setEmployers(employersWithId);
    } catch (error) {
      console.error("Error fetching employers:", error);
      setError(
        error.response ? error.response.data.message : "An unexpected error occurred."
      );
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token provided. Please log in.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/employers/${id}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchEmployers();
    } catch (error) {
      console.error("Error updating employer status:", error);
      setError(
        error.response ? error.response.data.message : "Failed to update employer status."
      );
    }
  };

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredEmployers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employers");
    XLSX.writeFile(workbook, "Employers.xlsx");
  };

  const columns = [
    { field: "employer_id", headerName: "Employer ID", width: 70 },
    { field: "business_name", headerName: "Business Name", width: 200 },
    { field: "location", headerName: "Location", width: 200 },
    { field: "job_type", headerName: "Job Type", width: 150 },
    { field: "salary", headerName: "Salary", width: 150 },
    { field: "education_level", headerName: "Education Level", width: 180 },
    { field: "industry", headerName: "Industry", width: 180 },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => {
        const status = params.value;
        let color, bgColor;
        switch (status) {
          case "APPROVED":
            color = theme.palette.success.main;
            bgColor = theme.palette.success.light;
            break;
          case "PENDING":
            color = theme.palette.warning.main;
            bgColor = theme.palette.warning.light;
            break;
          case "DECLINED":
            color = theme.palette.error.main;
            bgColor = theme.palette.error.light;
            break;
          default:
            color = theme.palette.text.primary;
            bgColor = theme.palette.grey[200];
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
              color: "#ffffff",
              textTransform: "uppercase",
              width: "fit-content",
            }}
          >
            {status}
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 300,
      renderCell: (params) => (
        <Box>
          <Button
            variant="outlined"
            color="success"
            size="small"
            onClick={() => handleStatusChange(params.row.employer_id, "APPROVED")}
            disabled={params.row.status === "APPROVED"}
            sx={{ color: theme.palette.success.main }}
          >
            Approve
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => handleStatusChange(params.row.employer_id, "DECLINED")}
            disabled={params.row.status === "DECLINED"}
            sx={{ ml: 1, color: theme.palette.error.main }}
          >
            Decline
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleStatusChange(params.row.employer_id, "PENDING")}
            disabled={params.row.status === "PENDING"}
            sx={{
              ml: 1,
              color: theme.palette.warning.main,
              borderColor: theme.palette.warning.main,
            }}
          >
            Set Pending
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
        Manage Employer Listings
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          label="Search by Business Name"
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
            <MenuItem value="">ALL</MenuItem>
            <MenuItem value="APPROVED">APPROVED</MenuItem>
            <MenuItem value="PENDING">PENDING</MenuItem>
            <MenuItem value="DECLINED">DECLINED</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" onClick={handleExport}>
          Export to Excel
        </Button>
      </Box>

      <Paper sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={filteredEmployers}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          getRowId={(row) => row.employer_id} 
        />
      </Paper>
    </Box>
  );
};

export default ManageEmployer;
