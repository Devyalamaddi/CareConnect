"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  MapPin,
  Phone,
  Clock,
  Star,
  Navigation,
  Filter,
  Search,
  Ambulance,
  Download,
  Wifi,
  WifiOff,
  Route,
} from "lucide-react"
import { PatientLayout } from "@/components/patient/patient-layout"
import { useLanguage } from "@/components/language/language-provider"
import { usePWA } from "@/components/pwa/pwa-provider"
import { toast } from "@/hooks/use-toast"

interface HospitalData {
  id: string
  name: string
  address: string
  phone: string
  distance: number
  rating: number
  specialties: string[]
  emergencyServices: boolean
  availability: "open" | "closed" | "emergency-only"
  coordinates: {
    lat: number
    lng: number
  }
  waitTime?: string
  beds?: {
    total: number
    available: number
  }
  lastUpdated?: string
}

interface OfflineRoute {
  distance: number
  duration: number
  instructions: string[]
  coordinates: [number, number][]
}

export default function HospitalsPage() {
  const { t } = useLanguage()
  const { isOffline } = usePWA()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterSpecialty, setFilterSpecialty] = useState("all")
  const [sortBy, setSortBy] = useState("distance")
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [offlineMapReady, setOfflineMapReady] = useState(false)
  const [downloadingMaps, setDownloadingMaps] = useState(false)
  const [cachedHospitals, setCachedHospitals] = useState<HospitalData[]>([])
  const [selectedRoute, setSelectedRoute] = useState<OfflineRoute | null>(null)
  const [showOfflineRoute, setShowOfflineRoute] = useState(false)
  const mapRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])

  // Enhanced hospital data with offline capabilities - Telangana Hospitals
  const mockHospitals: HospitalData[] = [
    // HYDERABAD
    {
      id: "1",
      name: "Apollo Hospitals Hyderabad",
      address: "Jubilee Hills, Hyderabad, Telangana",
      phone: "+91-40-2360-7777",
      distance: 1.5,
      rating: 4.7,
      specialties: ["Cardiology", "Neurology", "Emergency"],
      emergencyServices: true,
      availability: "open",
      coordinates: { lat: 17.4239, lng: 78.4483 },
      waitTime: "20 mins",
      beds: { total: 500, available: 60 },
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Yashoda Hospitals Secunderabad",
      address: "Alexander Road, Hyderabad, Telangana",
      phone: "+91-40-2771-3333",
      distance: 3.2,
      rating: 4.5,
      specialties: ["Oncology", "Cardiology", "Emergency"],
      emergencyServices: true,
      availability: "open",
      coordinates: { lat: 17.4411, lng: 78.4867 },
      waitTime: "15 mins",
      beds: { total: 450, available: 40 },
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "3",
      name: "Rainbow Children's Hospital",
      address: "Banjara Hills, Hyderabad, Telangana",
      phone: "+91-40-4466-9999",
      distance: 2.5,
      rating: 4.6,
      specialties: ["Pediatrics", "Neonatology", "Emergency"],
      emergencyServices: true,
      availability: "open",
      coordinates: { lat: 17.4156, lng: 78.4378 },
      waitTime: "10 mins",
      beds: { total: 200, available: 25 },
      lastUpdated: new Date().toISOString(),
    },

    // KHAMMAM
    {
      id: "4",
      name: "MGM Hospital Khammam",
      address: "Yellandu Cross Road, Khammam, Telangana",
      phone: "+91-8742-255344",
      distance: 2.3,
      rating: 4.3,
      specialties: ["General Medicine", "Emergency", "Surgery"],
      emergencyServices: true,
      availability: "open",
      coordinates: { lat: 17.2473, lng: 80.1514 },
      waitTime: "10 mins",
      beds: { total: 300, available: 35 },
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "5",
      name: "Sree Venkateshwara Hospital",
      address: "Wyra Road, Khammam, Telangana",
      phone: "+91-8742-274511",
      distance: 1.9,
      rating: 4.0,
      specialties: ["Orthopedics", "Gynecology"],
      emergencyServices: false,
      availability: "open",
      coordinates: { lat: 17.2528, lng: 80.1483 },
      waitTime: "12 mins",
      beds: { total: 120, available: 18 },
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "6",
      name: "Prashanthi Hospital",
      address: "Kothagudem Road, Khammam, Telangana",
      phone: "+91-8742-289000",
      distance: 2.6,
      rating: 4.1,
      specialties: ["Diabetology", "Cardiology"],
      emergencyServices: true,
      availability: "emergency-only",
      coordinates: { lat: 17.2469, lng: 80.157 },
      waitTime: "7 mins",
      beds: { total: 100, available: 15 },
      lastUpdated: new Date().toISOString(),
    },

    // NIZAMABAD
    {
      id: "7",
      name: "Care Hospital Nizamabad",
      address: "Bodhan Road, Nizamabad, Telangana",
      phone: "+91-8462-224477",
      distance: 1.8,
      rating: 4.1,
      specialties: ["Orthopedics", "Gynecology", "Emergency"],
      emergencyServices: true,
      availability: "emergency-only",
      coordinates: { lat: 18.6725, lng: 78.0941 },
      waitTime: "8 mins",
      beds: { total: 150, available: 20 },
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "8",
      name: "Sunshine Hospital Nizamabad",
      address: "Armoor Road, Nizamabad, Telangana",
      phone: "+91-8462-233344",
      distance: 2.0,
      rating: 4.2,
      specialties: ["General Medicine", "Surgery", "Pediatrics"],
      emergencyServices: true,
      availability: "open",
      coordinates: { lat: 18.6789, lng: 78.1021 },
      waitTime: "9 mins",
      beds: { total: 180, available: 30 },
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "9",
      name: "Life Care Hospital",
      address: "Tilak Garden, Nizamabad, Telangana",
      phone: "+91-8462-225566",
      distance: 2.4,
      rating: 4.0,
      specialties: ["ENT", "Orthopedics"],
      emergencyServices: false,
      availability: "open",
      coordinates: { lat: 18.6695, lng: 78.0918 },
      waitTime: "11 mins",
      beds: { total: 90, available: 12 },
      lastUpdated: new Date().toISOString(),
    },
  ]

  useEffect(() => {
    initializeOfflineData()
    getCurrentLocation()
  }, [])

  useEffect(() => {
    if (userLocation) {
      loadMap()
    }
  }, [userLocation, isOffline])

  const initializeOfflineData = async () => {
    try {
      // Load cached hospitals from localStorage
      const cached = localStorage.getItem("cachedHospitals")
      if (cached) {
        setCachedHospitals(JSON.parse(cached))
      }

      // Check if offline maps are available
      const offlineReady = localStorage.getItem("offlineMapReady")
      setOfflineMapReady(offlineReady === "true")

      // Cache current hospital data
      localStorage.setItem("cachedHospitals", JSON.stringify(mockHospitals))
      setCachedHospitals(mockHospitals)
    } catch (error) {
      console.error("Error initializing offline data:", error)
    }
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setUserLocation(location)
          // Cache user location for offline use
          localStorage.setItem("lastKnownLocation", JSON.stringify(location))
        },
        (error) => {
          console.error("Error getting location:", error)
          // Try to use cached location
          const cachedLocation = localStorage.getItem("lastKnownLocation")
          if (cachedLocation) {
            setUserLocation(JSON.parse(cachedLocation))
          } else {
            // Use default location (Hyderabad, Telangana)
            setUserLocation({ lat: 17.4239, lng: 78.4483 })
          }
        },
      )
    }
  }

  const downloadOfflineMaps = async () => {
    if (!userLocation) return

    setDownloadingMaps(true)
    try {
      // Calculate bounding box for map tiles (5km radius)
      const radius = 0.045 // approximately 5km in degrees
      const bounds = {
        north: userLocation.lat + radius,
        south: userLocation.lat - radius,
        east: userLocation.lng + radius,
        west: userLocation.lng - radius,
      }

      // Pre-cache map tiles for offline use
      const tilesToCache = []
      const zoomLevels = [10, 11, 12, 13, 14, 15] // Different zoom levels

      for (const zoom of zoomLevels) {
        const tileSize = 256
        const n = Math.pow(2, zoom)

        const minTileX = Math.floor(((bounds.west + 180) / 360) * n)
        const maxTileX = Math.floor(((bounds.east + 180) / 360) * n)
        const minTileY = Math.floor(
          ((1 -
            Math.log(Math.tan((bounds.north * Math.PI) / 180) + 1 / Math.cos((bounds.north * Math.PI) / 180)) /
              Math.PI) /
            2) *
            n,
        )
        const maxTileY = Math.floor(
          ((1 -
            Math.log(Math.tan((bounds.south * Math.PI) / 180) + 1 / Math.cos((bounds.south * Math.PI) / 180)) /
              Math.PI) /
            2) *
            n,
        )

        for (let x = minTileX; x <= maxTileX; x++) {
          for (let y = minTileY; y <= maxTileY; y++) {
            tilesToCache.push(`https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`)
          }
        }
      }

      // Cache tiles using service worker
      if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: "CACHE_TILES",
          tiles: tilesToCache.slice(0, 200), // Limit to prevent excessive caching
        })
      }

      // Store offline map metadata
      localStorage.setItem("offlineMapBounds", JSON.stringify(bounds))
      localStorage.setItem("offlineMapReady", "true")
      localStorage.setItem("offlineMapTimestamp", new Date().toISOString())

      setOfflineMapReady(true)
      toast({
        title: t("offlineMapDownloaded"),
        description: t("offlineMapDownloadedDesc"),
      })
    } catch (error) {
      console.error("Error downloading offline maps:", error)
      toast({
        title: t("offlineMapError"),
        description: t("offlineMapErrorDesc"),
        variant: "destructive",
      })
    } finally {
      setDownloadingMaps(false)
    }
  }

  const loadMap = async () => {
    try {
      const L = (await import("leaflet")).default

      // Import Leaflet CSS
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        document.head.appendChild(link)
      }

      // Clear existing map
      if (mapRef.current) {
        mapRef.current.remove()
      }

      // Initialize map
      const map = L.map("hospital-map").setView([userLocation!.lat, userLocation!.lng], 13)
      mapRef.current = map

      // Choose tile layer based on online/offline status
      let tileLayer
      if (isOffline && offlineMapReady) {
        // Use cached tiles for offline mode
        tileLayer = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors (Offline Mode)",
          className: "offline-tiles",
        })
      } else {
        // Use online tiles
        tileLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
        })
      }

      tileLayer.addTo(map)

      // Add user location marker with enhanced styling
      const userIcon = L.divIcon({
        html: `
          <div style="
            background-color: #3b82f6; 
            width: 16px; 
            height: 16px; 
            border-radius: 50%; 
            border: 3px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            position: relative;
          ">
            <div style="
              position: absolute;
              top: -8px;
              left: -8px;
              width: 32px;
              height: 32px;
              border: 2px solid #3b82f6;
              border-radius: 50%;
              animation: pulse 2s infinite;
              opacity: 0.3;
            "></div>
          </div>
        `,
        iconSize: [22, 22],
        className: "user-location-marker",
      })

      const userMarker = L.marker([userLocation!.lat, userLocation!.lng], { icon: userIcon })
        .addTo(map)
        .bindPopup(`
          <div style="text-align: center;">
            <strong>${t("yourLocation")}</strong><br>
            <small>${isOffline ? t("offlineMode") : t("onlineMode")}</small>
          </div>
        `)

      // Clear existing markers
      markersRef.current.forEach((marker) => map.removeLayer(marker))
      markersRef.current = []

      // Add hospital markers with enhanced functionality
      const hospitalsToShow = isOffline ? cachedHospitals : mockHospitals
      hospitalsToShow.forEach((hospital) => {
        const hospitalIcon = L.divIcon({
          html: `
            <div style="
              background-color: ${hospital.emergencyServices ? "#ef4444" : "#10b981"}; 
              color: white; 
              width: 28px; 
              height: 28px; 
              border-radius: 50%; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              font-size: 14px; 
              font-weight: bold;
              border: 2px solid white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            ">H</div>
          `,
          iconSize: [32, 32],
          className: "hospital-marker",
        })

        const marker = L.marker([hospital.coordinates.lat, hospital.coordinates.lng], { icon: hospitalIcon })
          .addTo(map)
          .bindPopup(`
            <div style="min-width: 200px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${hospital.name}</h3>
              <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">📍 ${hospital.address}</p>
              <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">📞 ${hospital.phone}</p>
              <p style="margin: 0 0 8px 0; font-size: 12px; color: #666;">🚶 ${hospital.distance} km away</p>
              ${hospital.waitTime ? `<p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">⏱️ Wait: ${hospital.waitTime}</p>` : ""}
              ${hospital.beds ? `<p style="margin: 0 0 8px 0; font-size: 12px; color: #666;">🏥 ${hospital.beds.available}/${hospital.beds.total} beds available</p>` : ""}
              <div style="display: flex; gap: 4px; margin-top: 8px;">
                <button onclick="window.getDirectionsOffline('${hospital.id}')" style="
                  background: #3b82f6; 
                  color: white; 
                  border: none; 
                  padding: 4px 8px; 
                  border-radius: 4px; 
                  font-size: 11px;
                  cursor: pointer;
                ">Directions</button>
                <button onclick="window.location.href='tel:${hospital.phone}'" style="
                  background: #10b981; 
                  color: white; 
                  border: none; 
                  padding: 4px 8px; 
                  border-radius: 4px; 
                  font-size: 11px;
                  cursor: pointer;
                ">Call</button>
              </div>
              ${isOffline ? `<p style="margin: 4px 0 0 0; font-size: 10px; color: #999;">Last updated: ${new Date(hospital.lastUpdated || "").toLocaleString()}</p>` : ""}
            </div>
          `)

        markersRef.current.push(marker)
      })

      // Add offline route display
      if (selectedRoute && showOfflineRoute) {
        const routeLine = L.polyline(selectedRoute.coordinates, {
          color: "#3b82f6",
          weight: 4,
          opacity: 0.7,
        }).addTo(map)
        markersRef.current.push(routeLine)
      }
      // Global function for offline directions
      ;(window as any).getDirectionsOffline = (hospitalId: string) => {
        generateOfflineRoute(hospitalId)
      }

      setMapLoaded(true)
    } catch (error) {
      console.error("Error loading map:", error)
      // Show fallback static map
      showFallbackMap()
    }
  }

  const generateOfflineRoute = (hospitalId: string) => {
    if (!userLocation) return

    const hospital = (isOffline ? cachedHospitals : mockHospitals).find((h) => h.id === hospitalId)
    if (!hospital) return

    // Generate basic offline route (straight line with waypoints)
    const route: OfflineRoute = {
      distance: hospital.distance,
      duration: Math.round(hospital.distance * 3), // Estimate 3 minutes per km
      coordinates: [
        [userLocation.lat, userLocation.lng],
        [hospital.coordinates.lat, hospital.coordinates.lng],
      ],
      instructions: [
        `Start at your current location`,
        `Head towards ${hospital.name}`,
        `Distance: ${hospital.distance} km`,
        `Estimated time: ${Math.round(hospital.distance * 3)} minutes`,
        `Arrive at ${hospital.name}, ${hospital.address}`,
      ],
    }

    setSelectedRoute(route)
    setShowOfflineRoute(true)

    // Reload map to show route
    loadMap()

    toast({
      title: t("offlineRouteGenerated"),
      description: `${t("routeTo")} ${hospital.name}`,
    })
  }

  const showFallbackMap = () => {
    const mapContainer = document.getElementById("hospital-map")
    if (mapContainer) {
      mapContainer.innerHTML = `
        <div style="
          width: 100%; 
          height: 100%; 
          background: linear-gradient(135deg, #e5e7eb 0%, #f3f4f6 100%);
          display: flex; 
          flex-direction: column;
          align-items: center; 
          justify-content: center;
          border-radius: 8px;
          border: 2px dashed #d1d5db;
        ">
          <div style="text-align: center; padding: 20px;">
            <div style="font-size: 48px; margin-bottom: 16px;">🗺️</div>
            <h3 style="margin: 0 0 8px 0; color: #374151;">${t("offlineMapView")}</h3>
            <p style="margin: 0; color: #6b7280; font-size: 14px;">${t("offlineMapViewDesc")}</p>
            ${
              !offlineMapReady
                ? `
              <button onclick="window.location.reload()" style="
                margin-top: 12px;
                background: #3b82f6;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 6px;
                cursor: pointer;
              ">${t("downloadOfflineMaps")}</button>
            `
                : ""
            }
          </div>
        </div>
      `
    }
  }

  const filteredHospitals = (isOffline ? cachedHospitals : mockHospitals)
    .filter((hospital) => {
      const matchesSearch =
        hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospital.address.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesSpecialty =
        filterSpecialty === "all" ||
        hospital.specialties.some((s) => s.toLowerCase().includes(filterSpecialty.toLowerCase()))
      return matchesSearch && matchesSpecialty
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "distance":
          return a.distance - b.distance
        case "rating":
          return b.rating - a.rating
        case "availability":
          return a.beds ? (b.beds?.available || 0) - a.beds.available : 0
        default:
          return 0
      }
    })

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "open":
        return "bg-green-100 text-green-800"
      case "emergency-only":
        return "bg-yellow-100 text-yellow-800"
      case "closed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleGetDirections = (hospital: HospitalData) => {
    if (isOffline) {
      generateOfflineRoute(hospital.id)
    } else {
      // TODO: Integrate with Google Maps or Apple Maps
      const url = `https://www.google.com/maps/dir/?api=1&destination=${hospital.coordinates.lat},${hospital.coordinates.lng}`
      window.open(url, "_blank")
    }
  }

  const handleCallHospital = (phone: string) => {
    window.location.href = `tel:${phone}`
  }

  const handleEmergencyCall = () => {
    window.location.href = "tel:911"
  }

  return (
    <PatientLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <span>{t("nearbyHospitals")}</span>
              {isOffline ? (
                <WifiOff className="h-6 w-6 text-orange-500" />
              ) : (
                <Wifi className="h-6 w-6 text-green-500" />
              )}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              {isOffline ? t("hospitalLocatorOfflineDesc") : t("hospitalLocatorDesc")}
            </p>
          </div>
          <div className="flex space-x-2">
            {!isOffline && (
              <Button
                onClick={downloadOfflineMaps}
                disabled={downloadingMaps}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>{downloadingMaps ? t("downloading") : t("downloadOfflineMaps")}</span>
              </Button>
            )}
            <Button onClick={handleEmergencyCall} className="bg-red-600 hover:bg-red-700 text-white">
              <Ambulance className="h-4 w-4 mr-2" />
              {t("emergency911")}
            </Button>
          </div>
        </div>

        {/* Offline Status Banner */}
        {isOffline && (
          <Card className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
            <CardContent className="pt-4">
              <div className="flex items-center space-x-2 text-orange-800 dark:text-orange-200">
                <WifiOff className="h-5 w-5" />
                <div>
                  <p className="font-medium">{t("offlineMode")}</p>
                  <p className="text-sm">
                    {offlineMapReady ? t("offlineMapsAvailable") : t("offlineMapsNotAvailable")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={t("searchHospitals")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterSpecialty} onValueChange={setFilterSpecialty}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder={t("filterBySpecialty")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("allSpecialties")}</SelectItem>
                  <SelectItem value="emergency">{t("emergency")}</SelectItem>
                  <SelectItem value="cardiology">{t("cardiology")}</SelectItem>
                  <SelectItem value="pediatrics">{t("pediatrics")}</SelectItem>
                  <SelectItem value="orthopedics">{t("orthopedics")}</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder={t("sortBy")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="distance">{t("distance")}</SelectItem>
                  <SelectItem value="rating">{t("rating")}</SelectItem>
                  <SelectItem value="availability">{t("availability")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Enhanced Map with Offline Support - Full Width */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>{t("hospitalMap")}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {isOffline && offlineMapReady && (
                    <Badge variant="secondary" className="text-xs">
                      {t("cached")}
                    </Badge>
                  )}
                  {selectedRoute && (
                    <Button size="sm" variant="outline" onClick={() => setShowOfflineRoute(!showOfflineRoute)}>
                      <Route className="h-4 w-4 mr-1" />
                      {showOfflineRoute ? t("hideRoute") : t("showRoute")}
                    </Button>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div id="hospital-map" className="w-full h-96 rounded-lg bg-gray-100 flex items-center justify-center">
                {!mapLoaded && (
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                    <p className="text-gray-500">{t("loadingMap")}</p>
                  </div>
                )}
              </div>
              <div className="mt-2 space-y-1">
                <p className="text-xs text-gray-500">
                  {t("mapLegend")}: 🔵 {t("yourLocation")} | 🔴 {t("emergencyHospitals")} | 🟢 {t("regularHospitals")}
                </p>
                {isOffline && <p className="text-xs text-orange-600">{t("offlineMapNote")}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Hospital List with Offline Indicators */}
          <div className="space-y-4">
            {/* Offline Route Display */}
            {selectedRoute && showOfflineRoute && (
              <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-blue-800 dark:text-blue-200">
                    <Route className="h-5 w-5" />
                    <span>{t("offlineRoute")}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>
                        {t("distance")}: {selectedRoute.distance} km
                      </span>
                      <span>
                        {t("estimatedTime")}: {selectedRoute.duration} min
                      </span>
                    </div>
                    <div className="space-y-1">
                      {selectedRoute.instructions.map((instruction, index) => (
                        <p key={index} className="text-xs text-gray-600 dark:text-gray-300">
                          {index + 1}. {instruction}
                        </p>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Hospital Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredHospitals.map((hospital) => (
                <Card key={hospital.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Ambulance className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2 flex-wrap">
                            <h3 className="text-lg font-semibold">{hospital.name}</h3>
                            <Badge className={getAvailabilityColor(hospital.availability)}>
                              {t(hospital.availability.replace("-", ""))}
                            </Badge>
                            {hospital.emergencyServices && (
                              <Badge variant="destructive" className="text-xs">
                                {t("emergency")}
                              </Badge>
                            )}
                            {isOffline && (
                              <Badge variant="outline" className="text-xs">
                                {t("cached")}
                              </Badge>
                            )}
                          </div>

                          <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300 mb-3">
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4" />
                              <span className="truncate">{hospital.address}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span className="text-blue-600 font-medium">({hospital.distance} km)</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Phone className="h-4 w-4" />
                              <span>{hospital.phone}</span>
                            </div>
                            {hospital.waitTime && !isOffline && (
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>
                                  {t("waitTime")}: {hospital.waitTime}
                                </span>
                              </div>
                            )}
                            {isOffline && hospital.lastUpdated && (
                              <div className="flex items-center space-x-1 text-orange-600">
                                <Clock className="h-4 w-4" />
                                <span className="text-xs">
                                  {t("lastUpdated")}: {new Date(hospital.lastUpdated).toLocaleString()}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center space-x-4 mb-3">
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-yellow-500" />
                              <span className="font-medium">{hospital.rating}</span>
                            </div>
                            {hospital.beds && (
                              <div className="text-sm">
                                <span className="font-medium text-green-600">{hospital.beds.available}</span>
                                <span className="text-gray-500">
                                  /{hospital.beds.total} {t("bedsAvailable")}
                                </span>
                                {isOffline && <span className="text-orange-500 text-xs ml-1">({t("cached")})</span>}
                              </div>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-1 mb-3">
                            {hospital.specialties.map((specialty, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGetDirections(hospital)}
                        className="flex-1"
                      >
                        <Navigation className="h-4 w-4 mr-2" />
                        {isOffline ? t("offlineDirections") : t("directions")}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCallHospital(hospital.phone)}
                        className="flex-1"
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        {t("call")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Empty State */}
        {filteredHospitals.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Ambulance className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t("noHospitalsFound")}</h3>
                <p className="text-gray-600 dark:text-gray-300">{t("noHospitalsFoundDesc")}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.1;
          }
          100% {
            transform: scale(1);
            opacity: 0.3;
          }
        }
        
        .offline-tiles {
          filter: grayscale(20%) brightness(0.9);
        }
      `}</style>
    </PatientLayout>
  )
}
