"use client"

import { useState, useRef, useEffect } from "react"
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Plane,
  User,
  Clock,
  Wifi,
  Utensils,
  Monitor,
  ArrowLeft,
  Luggage,
  Shield,
  Star,
  Filter,
  X,
  Briefcase,
  Check,
  Zap,
  DollarSign,
  Award,
  CalendarDays,
  Users,
} from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"

// Enhanced flight data with baggage information
const flightResults = [
  {
    id: 1,
    airline: "Air Canada",
    logo: "/placeholder.svg?height=40&width=40",
    departureTime: "08:30",
    arrivalTime: "11:45",
    duration: "3h 15m",
    durationMinutes: 195,
    departureAirport: "YYZ",
    arrivalAirport: "SEA",
    price: "$432",
    priceValue: 432,
    stops: "Nonstop",
    stopCount: 0,
    amenities: ["wifi", "food", "entertainment"],
    checkedBag: true,
    handBaggage: true,
    rating: 4.5,
  },
  {
    id: 2,
    airline: "Delta Airlines",
    logo: "/placeholder.svg?height=40&width=40",
    departureTime: "10:15",
    arrivalTime: "13:50",
    duration: "3h 35m",
    durationMinutes: 215,
    departureAirport: "YYZ",
    arrivalAirport: "SEA",
    price: "$389",
    priceValue: 389,
    stops: "Nonstop",
    stopCount: 0,
    amenities: ["wifi", "food"],
    checkedBag: true,
    handBaggage: true,
    rating: 4.3,
  },
  {
    id: 3,
    airline: "United Airlines",
    logo: "/placeholder.svg?height=40&width=40",
    departureTime: "13:45",
    arrivalTime: "18:20",
    duration: "4h 35m",
    durationMinutes: 275,
    departureAirport: "YYZ",
    arrivalAirport: "SEA",
    price: "$356",
    priceValue: 356,
    stops: "1 stop (ORD)",
    stopCount: 1,
    amenities: ["wifi", "entertainment"],
    checkedBag: false,
    handBaggage: true,
    rating: 4.0,
  },
  {
    id: 4,
    airline: "Alaska Airlines",
    logo: "/placeholder.svg?height=40&width=40",
    departureTime: "16:30",
    arrivalTime: "19:45",
    duration: "3h 15m",
    durationMinutes: 195,
    departureAirport: "YYZ",
    arrivalAirport: "SEA",
    price: "$412",
    priceValue: 412,
    stops: "Nonstop",
    stopCount: 0,
    amenities: ["wifi", "food", "entertainment"],
    checkedBag: true,
    handBaggage: true,
    rating: 4.7,
  },
  {
    id: 5,
    airline: "American Airlines",
    logo: "/placeholder.svg?height=40&width=40",
    departureTime: "19:20",
    arrivalTime: "23:05",
    duration: "3h 45m",
    durationMinutes: 225,
    departureAirport: "YYZ",
    arrivalAirport: "SEA",
    price: "$378",
    priceValue: 378,
    stops: "Nonstop",
    stopCount: 0,
    amenities: ["wifi"],
    checkedBag: false,
    handBaggage: true,
    rating: 4.2,
  },
  {
    id: 6,
    airline: "JetBlue",
    logo: "/placeholder.svg?height=40&width=40",
    departureTime: "07:15",
    arrivalTime: "12:05",
    duration: "4h 50m",
    durationMinutes: 290,
    departureAirport: "YYZ",
    arrivalAirport: "SEA",
    price: "$345",
    priceValue: 345,
    stops: "1 stop (JFK)",
    stopCount: 1,
    amenities: ["wifi", "food", "entertainment"],
    checkedBag: true,
    handBaggage: true,
    rating: 4.4,
  },
  {
    id: 7,
    airline: "Southwest Airlines",
    logo: "/placeholder.svg?height=40&width=40",
    departureTime: "11:30",
    arrivalTime: "15:10",
    duration: "3h 40m",
    durationMinutes: 220,
    departureAirport: "YYZ",
    arrivalAirport: "SEA",
    price: "$402",
    priceValue: 402,
    stops: "Nonstop",
    stopCount: 0,
    amenities: ["wifi", "food"],
    checkedBag: true,
    handBaggage: true,
    rating: 4.6,
  },
  {
    id: 8,
    airline: "Frontier Airlines",
    logo: "/placeholder.svg?height=40&width=40",
    departureTime: "14:45",
    arrivalTime: "19:30",
    duration: "4h 45m",
    durationMinutes: 285,
    departureAirport: "YYZ",
    arrivalAirport: "SEA",
    price: "$299",
    priceValue: 299,
    stops: "1 stop (DEN)",
    stopCount: 1,
    amenities: [],
    checkedBag: false,
    handBaggage: true,
    rating: 3.8,
  },
  {
    id: 9,
    airline: "Spirit Airlines",
    logo: "/placeholder.svg?height=40&width=40",
    departureTime: "17:20",
    arrivalTime: "22:15",
    duration: "4h 55m",
    durationMinutes: 295,
    departureAirport: "YYZ",
    arrivalAirport: "SEA",
    price: "$289",
    priceValue: 289,
    stops: "1 stop (ORD)",
    stopCount: 1,
    amenities: [],
    checkedBag: false,
    handBaggage: false,
    rating: 3.5,
  },
  {
    id: 10,
    airline: "WestJet",
    logo: "/placeholder.svg?height=40&width=40",
    departureTime: "09:45",
    arrivalTime: "12:50",
    duration: "3h 05m",
    durationMinutes: 185,
    departureAirport: "YYZ",
    arrivalAirport: "SEA",
    price: "$425",
    priceValue: 425,
    stops: "Nonstop",
    stopCount: 0,
    amenities: ["wifi", "food", "entertainment"],
    checkedBag: true,
    handBaggage: true,
    rating: 4.5,
  },
]

// Sample vendor data
const vendorOptions = [
  {
    id: 1,
    name: "FlightDirect",
    logo: "/placeholder.svg?height=40&width=40",
    price: "$389",
    baggage: "1 checked bag included",
    seatSelection: "Included",
    cancellation: "Free within 24 hours",
    rating: 4.7,
    features: ["Earn miles", "Mobile boarding pass", "Price guarantee"],
  },
  {
    id: 2,
    name: "SkyDeals",
    logo: "/placeholder.svg?height=40&width=40",
    price: "$356",
    baggage: "No checked bags",
    seatSelection: "For a fee",
    cancellation: "No refunds",
    rating: 4.2,
    features: ["Lowest price", "Fast booking"],
  },
  {
    id: 3,
    name: "TravelPlus",
    logo: "/placeholder.svg?height=40&width=40",
    price: "$412",
    baggage: "2 checked bags included",
    seatSelection: "Included",
    cancellation: "Free within 48 hours",
    rating: 4.8,
    features: ["Priority boarding", "Premium customer service", "Flexible dates"],
  },
  {
    id: 4,
    name: "FlyBudget",
    logo: "/placeholder.svg?height=40&width=40",
    price: "$342",
    baggage: "No checked bags",
    seatSelection: "Not available",
    cancellation: "No refunds",
    rating: 3.9,
    features: ["Budget option", "No frills"],
  },
  {
    id: 5,
    name: "AirBooker",
    logo: "/placeholder.svg?height=40&width=40",
    price: "$378",
    baggage: "1 checked bag included",
    seatSelection: "For a fee",
    cancellation: "Flexible policy",
    rating: 4.5,
    features: ["24/7 customer support", "Secure booking", "Price alerts"],
  },
]

// Get unique airlines from flight data
const airlines = [...new Set(flightResults.map((flight) => flight.airline))]

// Sort options
type SortOption = "best" | "cheapest" | "fastest"

export default function FlightBooking() {
  const [tripType, setTripType] = useState("one-way")
  const [showResults, setShowResults] = useState(false)
  const [selectedFlight, setSelectedFlight] = useState<number | null>(null)
  const [filters, setFilters] = useState({
    checkedBag: false,
    handBaggage: false,
    airlines: [] as string[],
  })
  const [expandedSearch, setExpandedSearch] = useState(false)
  const [showAllAirlines, setShowAllAirlines] = useState(false)
  const [sortOption, setSortOption] = useState<SortOption>("best")
  const [currentPage, setCurrentPage] = useState(1)
  const resultsRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  const resultsPerPage = 5
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      if (mobile) {
        setShowAllAirlines(true) // Always show all airlines on mobile
      }
    }

    // Initial check
    checkIfMobile()

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  const handleSearch = () => {
    setShowResults(true)
    setSelectedFlight(null)
    setExpandedSearch(false)
    setFilters({
      checkedBag: false,
      handBaggage: false,
      airlines: [],
    })
    setSortOption("best")
    setCurrentPage(1)
    setShowFilters(false)

    // Use setTimeout to ensure the results are rendered before scrolling
    setTimeout(() => {
      if (isMobile && resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: "smooth" })
      }
    }, 100)
  }

  const handleSelectFlight = (flightId: number) => {
    setSelectedFlight(flightId)

    // Scroll to top of results when selecting a flight
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleBackToResults = () => {
    setSelectedFlight(null)
  }

  const toggleAirlineFilter = (airline: string) => {
    setFilters((prev) => {
      const newAirlines = prev.airlines.includes(airline)
        ? prev.airlines.filter((a) => a !== airline)
        : [...prev.airlines, airline]
      return { ...prev, airlines: newAirlines }
    })
  }

  const toggleFilter = (filterName: "checkedBag" | "handBaggage") => {
    setFilters((prev) => ({ ...prev, [filterName]: !prev[filterName] }))
  }

  const clearFilters = () => {
    setFilters({
      checkedBag: false,
      handBaggage: false,
      airlines: [],
    })
  }

  // Apply filters to flight results
  const filteredFlights = flightResults.filter((flight) => {
    // Check if flight passes all active filters
    if (filters.checkedBag && !flight.checkedBag) return false
    if (filters.handBaggage && !flight.handBaggage) return false
    if (filters.airlines.length > 0 && !filters.airlines.includes(flight.airline)) return false
    return true
  })

  // Sort flights based on selected option
  const sortedFlights = [...filteredFlights].sort((a, b) => {
    switch (sortOption) {
      case "cheapest":
        return a.priceValue - b.priceValue
      case "fastest":
        return a.durationMinutes - b.durationMinutes
      case "best":
      default:
        // Best is a combination of price, duration, and rating
        const aScore = a.priceValue * 0.4 + a.durationMinutes * 0.3 - a.rating * 10 * 0.3
        const bScore = b.priceValue * 0.4 + b.durationMinutes * 0.3 - b.rating * 10 * 0.3
        return aScore - bScore
    }
  })

  // Paginate flights
  const totalPages = Math.ceil(sortedFlights.length / resultsPerPage)
  const paginatedFlights = sortedFlights.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage)

  // Get the selected flight data
  const selectedFlightData = selectedFlight ? flightResults.find((flight) => flight.id === selectedFlight) : null

  // Check if any filters are active
  const hasActiveFilters = filters.checkedBag || filters.handBaggage || filters.airlines.length > 0

  // Display a limited number of airlines initially, but show all on mobile
  const displayedAirlines = isMobile || showAllAirlines ? airlines : airlines.slice(0, 6)
  const hasMoreAirlines = airlines.length > 6

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gray-900/5"></div>

      {/* Background circles */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-gray-200/80"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-gray-200/80"></div>
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-lime-300/70"></div>
      <div className="absolute -bottom-10 left-20 w-16 h-16 rounded-full bg-white/70"></div>
      <div className="absolute bottom-40 right-40 w-8 h-8 rounded-full bg-white/70"></div>

      {!showResults ? (
        // Landing page layout (before search) - No scrollbar
        <div className="relative z-10 h-screen flex flex-col">
          {/* Header */}
          <header className="container mx-auto py-4 px-4 md:px-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Plane className="mr-2" />
                <span className="font-bold text-xl">Xeno</span>
              </div>
              <div className="flex items-center space-x-6">
                <a href="#" className="hidden md:block text-gray-600 hover:text-black">
                  Flights
                </a>
                <a href="#" className="hidden md:block text-gray-600 hover:text-black">
                  Hotels
                </a>
                <a href="#" className="hidden md:block text-gray-600 hover:text-black">
                  Car Rentals
                </a>
                <div className="flex items-center bg-gray-100 rounded-full px-3 py-1.5">
                  <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center mr-2">
                    <User size={14} />
                  </div>
                  <span className="mr-1">Surja</span>
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>
          </header>

          {/* Form centered in the page */}
          <div className="flex-grow flex items-center justify-center container mx-auto px-4 md:px-8">
            {/* Booking form - centered with slightly reduced width */}
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden max-w-5xl w-full mx-auto">
              <div className="p-4 md:p-6">
                {/* Trip type selector */}
                <div className="grid grid-cols-3 gap-2 mb-4 max-w-md mx-auto">
                  <button
                    className={`py-2 text-center rounded-lg ${tripType === "one-way" ? "bg-gray-100 font-medium" : "text-gray-500"}`}
                    onClick={() => setTripType("one-way")}
                  >
                    One way
                  </button>
                  <button
                    className={`py-2 text-center rounded-lg ${tripType === "round-trip" ? "bg-gray-100 font-medium" : "text-gray-500"}`}
                    onClick={() => setTripType("round-trip")}
                  >
                    Round trip
                  </button>
                  <button
                    className={`py-2 text-center rounded-lg ${tripType === "multi-city" ? "bg-gray-100 font-medium" : "text-gray-500"}`}
                    onClick={() => setTripType("multi-city")}
                  >
                    Multi city
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  {/* From section */}
                  <div className="lg:col-span-1">
                    <div className="text-xs text-gray-500 mb-1">FROM</div>
                    <div className="text-xl font-bold mb-1">Toronto (YYZ)</div>
                    <div className="text-sm text-gray-500">Toronto Pearson International Airport</div>
                  </div>

                  {/* To section */}
                  <div className="bg-lime-100 p-3 rounded-xl lg:col-span-1">
                    <div className="text-xs text-gray-500 mb-1">TO</div>
                    <div className="text-xl font-bold mb-1">Seattle (SEA)</div>
                    <div className="text-sm text-gray-500">Seattle-Tacoma International Airport</div>
                  </div>

                  {/* Travel dates */}
                  <div className="lg:col-span-1">
                    <div className="text-xs text-gray-500 mb-2">TRAVEL DATES</div>
                    <div className="flex items-center border border-gray-200 rounded-lg p-2">
                      <Calendar size={16} className="text-gray-400 mr-2" />
                      <span className="text-sm">Tue, December 20, 2023</span>
                    </div>
                  </div>

                  <div className="lg:col-span-1">
                    <div className="text-xs text-gray-500 mb-2">RETURN</div>
                    <div className="flex items-center border border-gray-200 rounded-lg p-2">
                      <Calendar size={16} className="text-gray-400 mr-2" />
                      <span className="text-sm">Sun, March 26, 2024</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  {/* Passengers */}
                  <div className="lg:col-span-2">
                    <div className="text-xs text-gray-500 mb-2">PASSENGERS & CLASS</div>
                    <div className="flex justify-between items-center border border-gray-200 rounded-lg p-2">
                      <div>
                        <div className="text-sm">2 Adults, 1 Children</div>
                        <div className="text-xs text-gray-500">Business Class</div>
                      </div>
                      <ChevronDown size={16} className="text-gray-400" />
                    </div>
                  </div>

                  {/* Flexible dates */}
                  <div className="flex items-center lg:col-span-1">
                    <Checkbox id="flexible" className="mr-2" />
                    <label htmlFor="flexible" className="text-sm">
                      My date are flexible (+/- days)
                    </label>
                  </div>

                  {/* Search button */}
                  <div className="lg:col-span-1">
                    <button className="w-full bg-black text-white py-3 rounded-full font-medium" onClick={handleSearch}>
                      Search Flight
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Search results layout (after search)
        <div className="container mx-auto py-10 px-4 md:px-8 relative z-10">
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
            <div className="p-6 flex justify-between items-center">
              <div className="flex items-center">
                <Plane className="mr-2" />
                <span className="font-bold">Xeno</span>
              </div>
              <div className="flex items-center bg-gray-100 rounded-full px-3 py-1.5">
                <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center mr-2">
                  <User size={14} />
                </div>
                <span className="mr-1">Surja</span>
                <ChevronDown size={16} />
              </div>
            </div>

            {/* Collapsible search panel - Improved for mobile */}
            <div className="border-t border-gray-100">
              {/* Collapsed search summary bar - more visible and mobile-friendly */}
              <div
                className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center cursor-pointer bg-gray-50 border-b border-gray-100 hover:bg-gray-100 transition-colors"
                onClick={() => setExpandedSearch(!expandedSearch)}
              >
                {/* Mobile-optimized layout */}
                <div className="w-full sm:w-auto">
                  {/* Route info */}
                  <div className="flex items-center mb-2 sm:mb-0">
                    <div className="flex items-center">
                      <div className="flex flex-col sm:flex-row sm:items-center">
                        <div className="flex items-center">
                          <span className="font-medium">Toronto (YYZ)</span>
                          <span className="mx-2">→</span>
                          <span className="font-medium">Seattle (SEA)</span>
                        </div>

                        {/* Date and passengers - stacked on mobile, inline on desktop */}
                        <div className="flex items-center mt-2 sm:mt-0 sm:ml-4 text-sm text-gray-500">
                          <CalendarDays size={14} className="mr-1 hidden sm:inline" />
                          <span>Dec 20, 2023</span>
                          <span className="mx-2 hidden sm:inline">•</span>
                          <Users size={14} className="mr-1 ml-2 sm:ml-0 hidden sm:inline" />
                          <span>2 Adults, 1 Child</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Edit button - full width on mobile */}
                <button className="flex items-center justify-center bg-white border border-gray-200 px-3 py-1.5 rounded-lg w-full sm:w-auto mt-2 sm:mt-0">
                  <span className="text-sm mr-2">{expandedSearch ? "Hide search" : "Edit search"}</span>
                  {expandedSearch ? (
                    <ChevronUp size={16} className="text-gray-500" />
                  ) : (
                    <ChevronDown size={16} className="text-gray-500" />
                  )}
                </button>
              </div>

              {/* Expanded search panel */}
              {expandedSearch && (
                <div className="p-6 border-t border-gray-100 bg-gray-50">
                  {/* Trip type selector */}
                  <div className="grid grid-cols-3 gap-2 mb-6 max-w-md">
                    <button
                      className={`py-2 text-center rounded-lg ${tripType === "one-way" ? "bg-gray-100 font-medium" : "text-gray-500"}`}
                      onClick={() => setTripType("one-way")}
                    >
                      One way
                    </button>
                    <button
                      className={`py-2 text-center rounded-lg ${tripType === "round-trip" ? "bg-gray-100 font-medium" : "text-gray-500"}`}
                      onClick={() => setTripType("round-trip")}
                    >
                      Round trip
                    </button>
                    <button
                      className={`py-2 text-center rounded-lg ${tripType === "multi-city" ? "bg-gray-100 font-medium" : "text-gray-500"}`}
                      onClick={() => setTripType("multi-city")}
                    >
                      Multi city
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {/* From section */}
                    <div className="lg:col-span-1">
                      <div className="text-xs text-gray-500 mb-1">FROM</div>
                      <div className="text-xl font-bold mb-1">Toronto (YYZ)</div>
                      <div className="text-sm text-gray-500">Toronto Pearson International Airport</div>
                    </div>

                    {/* To section */}
                    <div className="bg-lime-100 p-3 rounded-xl lg:col-span-1">
                      <div className="text-xs text-gray-500 mb-1">TO</div>
                      <div className="text-xl font-bold mb-1">Seattle (SEA)</div>
                      <div className="text-sm text-gray-500">Seattle-Tacoma International Airport</div>
                    </div>

                    {/* Travel dates */}
                    <div className="lg:col-span-1">
                      <div className="text-xs text-gray-500 mb-2">TRAVEL DATES</div>
                      <div className="flex items-center border border-gray-200 rounded-lg p-2 bg-white">
                        <Calendar size={16} className="text-gray-400 mr-2" />
                        <span className="text-sm">Tue, December 20, 2023</span>
                      </div>
                    </div>

                    <div className="lg:col-span-1">
                      <div className="text-xs text-gray-500 mb-2">RETURN</div>
                      <div className="flex items-center border border-gray-200 rounded-lg p-2 bg-white">
                        <Calendar size={16} className="text-gray-400 mr-2" />
                        <span className="text-sm">Sun, March 26, 2024</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {/* Passengers */}
                    <div className="lg:col-span-2">
                      <div className="text-xs text-gray-500 mb-2">PASSENGERS & CLASS</div>
                      <div className="flex justify-between items-center border border-gray-200 rounded-lg p-2 bg-white">
                        <div>
                          <div className="text-sm">2 Adults, 1 Children</div>
                          <div className="text-xs text-gray-500">Business Class</div>
                        </div>
                        <ChevronDown size={16} className="text-gray-400" />
                      </div>
                    </div>

                    {/* Flexible dates */}
                    <div className="flex items-center lg:col-span-1">
                      <Checkbox id="flexible-search" className="mr-2" />
                      <label htmlFor="flexible-search" className="text-sm">
                        My date are flexible (+/- days)
                      </label>
                    </div>

                    {/* Search button */}
                    <div className="lg:col-span-1">
                      <button
                        className="w-full bg-black text-white py-3 rounded-full font-medium"
                        onClick={handleSearch}
                      >
                        Update Search
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Search results area */}
              <div ref={resultsRef} className="lg:col-span-12 p-6 bg-gray-50">
                {selectedFlight === null ? (
                  // Flight search results view
                  <>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                      <div>
                        <h2 className="text-xl font-bold">Flight Results</h2>
                        <p className="text-sm text-gray-500">
                          {filteredFlights.length} flights found from Toronto to Seattle on Tue, Dec 20
                        </p>
                      </div>

                      {/* Sort options */}
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => setSortOption("best")}
                          className={`flex items-center px-3 py-2 rounded-lg text-sm ${
                            sortOption === "best"
                              ? "bg-black text-white"
                              : "bg-white border border-gray-200 text-gray-700"
                          }`}
                        >
                          <Award size={16} className="mr-2" />
                          Best
                        </button>
                        <button
                          onClick={() => setSortOption("cheapest")}
                          className={`flex items-center px-3 py-2 rounded-lg text-sm ${
                            sortOption === "cheapest"
                              ? "bg-black text-white"
                              : "bg-white border border-gray-200 text-gray-700"
                          }`}
                        >
                          <DollarSign size={16} className="mr-2" />
                          Cheapest
                        </button>
                        <button
                          onClick={() => setSortOption("fastest")}
                          className={`flex items-center px-3 py-2 rounded-lg text-sm ${
                            sortOption === "fastest"
                              ? "bg-black text-white"
                              : "bg-white border border-gray-200 text-gray-700"
                          }`}
                        >
                          <Zap size={16} className="mr-2" />
                          Fastest
                        </button>
                      </div>
                    </div>

                    {/* Mobile-optimized filter button */}
                    <div className="mb-4">
                      <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="w-full sm:w-auto flex items-center justify-center bg-white border border-gray-200 px-4 py-3 rounded-lg shadow-sm"
                      >
                        <Filter size={16} className="mr-2" />
                        <span className="font-medium">Filters</span>
                        {hasActiveFilters && (
                          <div className="ml-2 bg-lime-100 text-lime-700 text-xs px-2 py-0.5 rounded-full">
                            {Object.values(filters).flat().filter(Boolean).length}
                          </div>
                        )}
                        {showFilters ? (
                          <ChevronUp size={16} className="ml-2 text-gray-500" />
                        ) : (
                          <ChevronDown size={16} className="ml-2 text-gray-500" />
                        )}
                      </button>
                    </div>

                    {/* Filters section - collapsible */}
                    {showFilters && (
                      <div className="bg-white rounded-xl border border-gray-100 mb-6 overflow-hidden">
                        <div className="p-4 flex justify-between items-center border-b border-gray-100">
                          <div className="flex items-center">
                            <Filter size={16} className="mr-2" />
                            <h3 className="font-medium">Filters</h3>
                          </div>
                          {hasActiveFilters && (
                            <button
                              onClick={clearFilters}
                              className="text-sm text-gray-500 flex items-center hover:text-black"
                            >
                              <X size={14} className="mr-1" />
                              Clear all
                            </button>
                          )}
                        </div>

                        <div className="p-4">
                          {/* Baggage filters */}
                          <div className="mb-6">
                            <h4 className="text-sm font-medium mb-3">Baggage</h4>
                            <div className="space-y-3">
                              <div
                                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${
                                  filters.checkedBag ? "bg-lime-50 border border-lime-200" : "border border-gray-200"
                                }`}
                                onClick={() => toggleFilter("checkedBag")}
                              >
                                <div className="flex items-center">
                                  <Luggage size={16} className="mr-2 text-gray-500" />
                                  <span className="text-sm">Checked bag included</span>
                                </div>
                                {filters.checkedBag && <Check size={16} className="text-lime-600" />}
                              </div>
                              <div
                                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${
                                  filters.handBaggage ? "bg-lime-50 border border-lime-200" : "border border-gray-200"
                                }`}
                                onClick={() => toggleFilter("handBaggage")}
                              >
                                <div className="flex items-center">
                                  <Briefcase size={16} className="mr-2 text-gray-500" />
                                  <span className="text-sm">Hand baggage included</span>
                                </div>
                                {filters.handBaggage && <Check size={16} className="text-lime-600" />}
                              </div>
                            </div>
                          </div>

                          {/* Airlines filter */}
                          <div>
                            <h4 className="text-sm font-medium mb-3">Airlines</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
                              {displayedAirlines.map((airline) => (
                                <div
                                  key={airline}
                                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${
                                    filters.airlines.includes(airline)
                                      ? "bg-lime-50 border border-lime-200"
                                      : "border border-gray-200"
                                  }`}
                                  onClick={() => toggleAirlineFilter(airline)}
                                >
                                  <span className="text-sm">{airline}</span>
                                  {filters.airlines.includes(airline) && <Check size={16} className="text-lime-600" />}
                                </div>
                              ))}
                            </div>
                            {hasMoreAirlines && !showAllAirlines && !isMobile && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setShowAllAirlines(true)
                                }}
                                className="mt-3 text-sm text-lime-600 hover:text-lime-700"
                              >
                                Show all airlines
                              </button>
                            )}
                            {showAllAirlines && !isMobile && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setShowAllAirlines(false)
                                }}
                                className="mt-3 text-sm text-lime-600 hover:text-lime-700"
                              >
                                Show less
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Active filters display */}
                    {hasActiveFilters && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {filters.checkedBag && (
                          <div className="bg-lime-50 text-lime-700 text-xs px-3 py-1 rounded-full flex items-center">
                            Checked bag
                            <button
                              onClick={() => toggleFilter("checkedBag")}
                              className="ml-1 hover:text-lime-900"
                              aria-label="Remove checked bag filter"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        )}
                        {filters.handBaggage && (
                          <div className="bg-lime-50 text-lime-700 text-xs px-3 py-1 rounded-full flex items-center">
                            Hand baggage
                            <button
                              onClick={() => toggleFilter("handBaggage")}
                              className="ml-1 hover:text-lime-900"
                              aria-label="Remove hand baggage filter"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        )}
                        {filters.airlines.map((airline) => (
                          <div
                            key={airline}
                            className="bg-lime-50 text-lime-700 text-xs px-3 py-1 rounded-full flex items-center"
                          >
                            {airline}
                            <button
                              onClick={() => toggleAirlineFilter(airline)}
                              className="ml-1 hover:text-lime-900"
                              aria-label={`Remove ${airline} filter`}
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Flight cards */}
                    {paginatedFlights.length > 0 ? (
                      <div className="space-y-4">
                        {paginatedFlights.map((flight) => (
                          <div
                            key={flight.id}
                            className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center">
                                <div className="w-10 h-10 mr-3 relative">
                                  <Image
                                    src={flight.logo || "/placeholder.svg"}
                                    alt={flight.airline}
                                    fill
                                    className="object-contain"
                                  />
                                </div>
                                <span className="font-medium">{flight.airline}</span>
                              </div>
                              <div className="text-xl font-bold text-lime-600">{flight.price}</div>
                            </div>

                            <div className="flex justify-between items-center mb-4">
                              <div className="text-center">
                                <div className="text-xl font-bold">{flight.departureTime}</div>
                                <div className="text-sm text-gray-500">{flight.departureAirport}</div>
                              </div>

                              <div className="flex-1 mx-4">
                                <div className="flex items-center justify-center">
                                  <div className="h-[1px] flex-1 bg-gray-300"></div>
                                  <div className="mx-2 text-xs text-gray-500 flex items-center">
                                    <Clock size={12} className="mr-1" />
                                    {flight.duration}
                                  </div>
                                  <div className="h-[1px] flex-1 bg-gray-300"></div>
                                </div>
                                <div className="text-center text-xs text-gray-500 mt-1">{flight.stops}</div>
                              </div>

                              <div className="text-center">
                                <div className="text-xl font-bold">{flight.arrivalTime}</div>
                                <div className="text-sm text-gray-500">{flight.arrivalAirport}</div>
                              </div>
                            </div>

                            <div className="flex justify-between items-center">
                              <div className="flex space-x-2">
                                {flight.amenities.includes("wifi") && (
                                  <div className="text-gray-500 bg-gray-100 p-1 rounded">
                                    <Wifi size={14} />
                                  </div>
                                )}
                                {flight.amenities.includes("food") && (
                                  <div className="text-gray-500 bg-gray-100 p-1 rounded">
                                    <Utensils size={14} />
                                  </div>
                                )}
                                {flight.amenities.includes("entertainment") && (
                                  <div className="text-gray-500 bg-gray-100 p-1 rounded">
                                    <Monitor size={14} />
                                  </div>
                                )}
                                {flight.checkedBag && (
                                  <div className="text-gray-500 bg-gray-100 p-1 rounded">
                                    <Luggage size={14} />
                                  </div>
                                )}
                                {flight.handBaggage && (
                                  <div className="text-gray-500 bg-gray-100 p-1 rounded">
                                    <Briefcase size={14} />
                                  </div>
                                )}
                              </div>
                              <button
                                className="bg-lime-100 text-lime-700 px-4 py-2 rounded-lg text-sm font-medium"
                                onClick={() => handleSelectFlight(flight.id)}
                              >
                                Select
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white rounded-xl p-8 text-center">
                        <div className="text-gray-400 mb-2">
                          <Filter size={48} className="mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">No flights match your filters</h3>
                        <p className="text-gray-500 mb-4">Try adjusting your filters to see more results</p>
                        <button
                          onClick={clearFilters}
                          className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium"
                        >
                          Clear all filters
                        </button>
                      </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex justify-center mt-6">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`px-3 py-1 rounded-md ${
                              currentPage === 1
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            Previous
                          </button>
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`px-3 py-1 rounded-md ${
                                currentPage === page
                                  ? "bg-black text-white"
                                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                          <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-1 rounded-md ${
                              currentPage === totalPages
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  // Vendor comparison view for selected flight
                  <>
                    <div className="mb-4">
                      <button
                        onClick={handleBackToResults}
                        className="flex items-center text-gray-600 hover:text-black mb-4"
                      >
                        <ArrowLeft size={16} className="mr-1" />
                        <span>Back to results</span>
                      </button>

                      <h2 className="text-xl font-bold">Compare Booking Options</h2>
                      <p className="text-sm text-gray-500">
                        {selectedFlightData?.airline} flight from Toronto to Seattle on Tue, Dec 20
                      </p>
                    </div>

                    {/* Selected flight summary */}
                    {selectedFlightData && (
                      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 mr-3 relative">
                              <Image
                                src={selectedFlightData.logo || "/placeholder.svg"}
                                alt={selectedFlightData.airline}
                                fill
                                className="object-contain"
                              />
                            </div>
                            <span className="font-medium">{selectedFlightData.airline}</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="text-center">
                            <div className="text-xl font-bold">{selectedFlightData.departureTime}</div>
                            <div className="text-sm text-gray-500">{selectedFlightData.departureAirport}</div>
                          </div>

                          <div className="flex-1 mx-4">
                            <div className="flex items-center justify-center">
                              <div className="h-[1px] flex-1 bg-gray-300"></div>
                              <div className="mx-2 text-xs text-gray-500 flex items-center">
                                <Clock size={12} className="mr-1" />
                                {selectedFlightData.duration}
                              </div>
                              <div className="h-[1px] flex-1 bg-gray-300"></div>
                            </div>
                            <div className="text-center text-xs text-gray-500 mt-1">{selectedFlightData.stops}</div>
                          </div>

                          <div className="text-center">
                            <div className="text-xl font-bold">{selectedFlightData.arrivalTime}</div>
                            <div className="text-sm text-gray-500">{selectedFlightData.arrivalAirport}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Vendor options */}
                    <div className="space-y-4">
                      {vendorOptions.map((vendor) => (
                        <div
                          key={vendor.id}
                          className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div className="flex items-center mb-4 md:mb-0">
                              <div className="w-12 h-12 mr-3 relative">
                                <Image
                                  src={vendor.logo || "/placeholder.svg"}
                                  alt={vendor.name}
                                  fill
                                  className="object-contain"
                                />
                              </div>
                              <div>
                                <div className="font-medium text-lg">{vendor.name}</div>
                                <div className="flex items-center text-sm text-gray-500">
                                  <div className="flex items-center text-yellow-500 mr-1">
                                    <Star size={14} fill="currentColor" />
                                  </div>
                                  <span>{vendor.rating}/5</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-2xl font-bold text-lime-600">{vendor.price}</div>
                          </div>

                          <div className="border-t border-gray-100 my-4"></div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="flex items-start">
                              <Luggage className="text-gray-400 mr-2 mt-0.5" size={16} />
                              <div>
                                <div className="text-sm font-medium">Baggage</div>
                                <div className="text-xs text-gray-500">{vendor.baggage}</div>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <User className="text-gray-400 mr-2 mt-0.5" size={16} />
                              <div>
                                <div className="text-sm font-medium">Seat Selection</div>
                                <div className="text-xs text-gray-500">{vendor.seatSelection}</div>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <Shield className="text-gray-400 mr-2 mt-0.5" size={16} />
                              <div>
                                <div className="text-sm font-medium">Cancellation</div>
                                <div className="text-xs text-gray-500">{vendor.cancellation}</div>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {vendor.features.map((feature, index) => (
                              <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                {feature}
                              </span>
                            ))}
                          </div>

                          <div className="flex justify-end">
                            <button className="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium">
                              Book Now
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
