import React, { useState, useEffect } from "react";
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
  IconButton,
  Input,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useForm } from "react-hook-form";
import axios from "axios";
import { v4 as uuidv4 } from "uuid"; // Optional, to generate a unique id for the image preview

const ManageAnnouncement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]); // To store filtered announcements based on search
  const [searchTerm, setSearchTerm] = useState(""); // To store search term
  const [open, setOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState(null); // For image preview
  const [imageId, setImageId] = useState(null); // For generating unique ID for the image preview

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  useEffect(() => {
    // Filter announcements when the search term changes
    if (searchTerm) {
      setFilteredAnnouncements(
        announcements.filter((announcement) =>
          announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          announcement.content.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredAnnouncements(announcements);
    }
  }, [searchTerm, announcements]);

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/announcements", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setAnnouncements(response.data);
      setFilteredAnnouncements(response.data); // Initialize filteredAnnouncements with all announcements
    } catch (error) {
      setError("Failed to fetch announcements");
    }
  };

  const handleOpen = (announcement = null) => {
    setSelectedAnnouncement(announcement);
    reset(announcement || {});
    setImagePreview(null); // Reset image preview on open
    setImageId(null); // Reset the image ID
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedAnnouncement(null);
    reset();
    setImagePreview(null);
    setError("");
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        title: data.title,
        content: data.content,
        created_at: data.created_at,
        image: imagePreview, // Add image URL to payload if you want to persist it
      };

      if (selectedAnnouncement) {
        // Update existing announcement
        await axios.put(
          `http://localhost:5000/api/announcements/${selectedAnnouncement.id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setError("Announcement updated successfully");
      } else {
        // Add new announcement
        await axios.post("http://localhost:5000/api/announcements", payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setError("Announcement added successfully");
      }

      fetchAnnouncements();
      handleClose();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create or update announcement");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file)); // Show preview of selected image
      setImageId(uuidv4()); // Generate a unique ID for the image
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/announcements/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchAnnouncements();
    } catch (error) {
      setError("Failed to delete announcement");
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "title", headerName: "Title", width: 200 },
    { field: "content", headerName: "Content", width: 300 },
    { field: "created_at", headerName: "Date Created", width: 200 },
    {
      field: "picture",
      headerName: "Picture",
      renderCell: (params) => (
        params.row.image ? (
          <img
            src={params.row.image}
            alt="Preview"
            style={{
              width: 50,
              height: 50,
              objectFit: "cover",
              borderRadius: 8,
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
          />
        ) : (
          <Typography>No Image</Typography>
        )
      ),
      width: 100,
    },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => (
        <Box>
          <Button
            variant="contained"
            style={{
              backgroundColor: 'gray', // Gray color for Edit button
              color: 'white',
              marginRight: 8,
            }}
            onClick={() => handleOpen(params.row)}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            style={{
              backgroundColor: 'red', // Red color for Delete button
              color: 'white',
            }}
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
        Manage Announcements
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}

      {/* Search Bar */}
      <Box marginBottom={2}>
        <TextField
          fullWidth
          label="Search Announcements"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      {/* Add Announcement Button on the right */}
      <Box display="flex" justifyContent="flex-end" marginBottom={2}>
        <Button
          onClick={() => handleOpen()}
          variant="contained"
          color="primary"
        >
          Add Announcement
        </Button>
      </Box>

      <Paper>
        <DataGrid rows={filteredAnnouncements} columns={columns} pageSize={5} />
      </Paper>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{selectedAnnouncement ? "Edit Announcement" : "Add Announcement"}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              {...register("title")}
              label="Title"
              fullWidth
              margin="normal"
              required
            />
            <TextField
              {...register("content")}
              label="Content"
              fullWidth
              margin="normal"
              required
            />
            {/* Image upload input */}
            <Box marginTop={2}>
              <Input
                type="file"
                inputProps={{ accept: "image/*" }}
                onChange={handleImageChange}
                fullWidth
                margin="normal"
              />
            </Box>
            {/* Image preview */}
            {imagePreview && (
              <Box marginTop={2} textAlign="center">
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    width: "100%",
                    maxHeight: 300,
                    objectFit: "cover",
                    borderRadius: 8,
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  }}
                />
              </Box>
            )}
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit">
                {selectedAnnouncement ? "Update" : "Create"}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ManageAnnouncement;
