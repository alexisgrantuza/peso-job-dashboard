import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Chip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useForm } from "react-hook-form";
import axios from "axios";

function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/jobs", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setJobs(response.data);
    } catch (error) {
      setError("Failed to fetch jobs");
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    reset();
    setError("");
  };

  const onSubmit = async (data) => {
    try {
      await axios.post("http://localhost:5000/api/jobs", data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchJobs();
      handleClose();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create job listing");
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

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "title", headerName: "Title", width: 200 },
    { field: "description", headerName: "Description", width: 300 },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === "approved"
              ? "success"
              : params.value === "declined"
              ? "error"
              : "warning"
          }
        />
      ),
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
            onClick={() => handleStatusChange(params.row.id, "approved")}
            disabled={params.row.status === "approved"}
          >
            Approve
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => handleStatusChange(params.row.id, "declined")}
            disabled={params.row.status === "declined"}
            sx={{ ml: 1 }}
          >
            Decline
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={() => handleEdit(params.row)}
            sx={{ ml: 1 }}
          >
            Edit
          </Button>
        </Box>
      ),
    },
  ];

  const handleEdit = async (job) => {
    // Implement edit functionality
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h4">Manage Job Listings</Typography>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Add Job Listing
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={jobs}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </Paper>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Job Listing</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Title"
              fullWidth
              {...register("title", { required: true })}
            />
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              multiline
              rows={4}
              {...register("description", { required: true })}
            />
            <TextField
              margin="dense"
              label="Requirements"
              fullWidth
              multiline
              rows={4}
              {...register("requirements", { required: true })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              Add Job Listing
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

export default ManageJobs;
