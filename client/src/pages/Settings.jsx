import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { useForm } from "react-hook-form";

function Settings() {
  const [settings, setSettings] = useState({
    systemName: "Peso Kopal",
    emailNotifications: true,
    maintenanceMode: false,
  });

  const { register, handleSubmit, setValue } = useForm({
    defaultValues: settings,
  });

  useEffect(() => {
    // Fetch current settings
    const fetchSettings = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/settings");
        const data = await response.json();
        setSettings(data);
        // Update form values
        Object.keys(data).forEach((key) => {
          setValue(key, data[key]);
        });
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

    fetchSettings();
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      const response = await fetch("http://localhost:5000/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        setSettings(data);
      }
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="System Name"
                {...register("systemName")}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    {...register("emailNotifications")}
                    defaultChecked={settings.emailNotifications}
                  />
                }
                label="Enable Email Notifications"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    {...register("maintenanceMode")}
                    defaultChecked={settings.maintenanceMode}
                  />
                }
                label="Maintenance Mode"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
              >
                Save Settings
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}

export default Settings;
