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

const ManageJobs = () => {
  const theme = useTheme();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    let data = [...jobs];
    if (searchTerm) {
      data = data.filter((job) =>
        job.business_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter) {
      data = data.filter((job) => job.status === statusFilter);
    }
    setFilteredJobs(data);
  }, [searchTerm, statusFilter, jobs]);

  const fetchJobs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/jobs", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const jobsWithId = response.data.map((job) => ({
        ...job,
        id: job.job_id,
      }));
      setJobs(jobsWithId);
    } catch (error) {
      setError("Failed to fetch jobs");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/jobs/${id}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchJobs();
    } catch (error) {
      setError("Failed to update job status");
    }
  };

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredJobs);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Jobs");
    XLSX.writeFile(workbook, "Jobs.xlsx");
  };

  const columns = [
    { field: "job_id", headerName: "Job ID", width: 70 },
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
              borderRadius: "12px",  // Changed to 50px for an oval shape
              fontWeight: 500,  // Bold text
              fontSize: "0.8rem",
              bgcolor: bgColor,
              color: "#ffffff",  // White font color
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
            onClick={() => handleStatusChange(params.row.job_id, "APPROVED")}
            disabled={params.row.status === "APPROVED"}
            sx={{ color: theme.palette.success.main }}
          >
            Approve
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => handleStatusChange(params.row.job_id, "DECLINED")}
            disabled={params.row.status === "DECLINED"}
            sx={{ ml: 1, color: theme.palette.error.main }}
          >
            Decline
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleStatusChange(params.row.job_id, "PENDING")}
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
      Manage Job Listings
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
          rows={filteredJobs}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </Paper>
    </Box>
  );
};

export default ManageJobs;
