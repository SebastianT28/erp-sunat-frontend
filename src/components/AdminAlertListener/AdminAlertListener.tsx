"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { API_BASE_URL } from "@/config/api";

interface SystemAlert {
  id: string;
  nivel: string;
  area: string;
  mensaje: string;
  timestamp: string;
}

export default function AdminAlertListener() {
  const lastAlertTimeRef = useRef<string | null>(null);

  useEffect(() => {
    // Check for alerts every 5 seconds
    const interval = setInterval(async () => {
      try {
        let url = `${API_BASE_URL}/api/admin/alertas/recientes`;
        if (lastAlertTimeRef.current) {
          url += `?since=${encodeURIComponent(lastAlertTimeRef.current)}`;
        }

        const response = await fetchWithAuth(url);

        if (response.ok) {
          const newAlerts: SystemAlert[] = await response.json();

          if (newAlerts.length > 0) {
            // Update the last checked time to the most recent alert
            const newestAlert = newAlerts.reduce((latest, current) => {
              return new Date(current.timestamp) > new Date(latest.timestamp) ? current : latest;
            });
            lastAlertTimeRef.current = newestAlert.timestamp;

            // Display sonner toast for each new alert
            newAlerts.forEach((alert) => {
              const toastMessage = `[${alert.area}] ${alert.mensaje}`;

              if (alert.nivel === "CRITICAL") {
                toast.error("⚠️ ALERTA CRÍTICA", {
                  description: toastMessage,
                  duration: 10000,
                  style: { background: "#ffebee", color: "#c62828", border: "1px solid #c62828" }
                });
              } else if (alert.nivel === "ERROR") {
                toast.error("🛑 Error del Sistema", {
                  description: toastMessage,
                  duration: 8000,
                });
              } else if (alert.nivel === "WARNING") {
                toast.warning("⚠️ Advertencia", {
                  description: toastMessage,
                  duration: 6000,
                });
              }
            });
          }
        }
      } catch (error) {
        console.error("Error fetching system alerts:", error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return null; // This component doesn't render any visible UI itself
}
