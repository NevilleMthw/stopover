"use client"

import { useState, useRef, useEffect } from "react"

import SearchResultsHeader from "../../components/search-results-header"
import FlightFilters from "../../components/flight-filters"
import FlightCard from "../../components/flight-card"
import VendorCard from "../../components/vendor-card"
import FlightPagination from "../../components/flight-pagination"
import NoFlightsFound from "../../components/no-flights-found"
import SelectedFlightSummary from "../../components/selected-flight-summary"

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

export default function FlightsPage() {
  const [tripType, setTripType] = useState("one-way")
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
    // This function now acts as an "update search" on the flights page
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

    setTimeout(() => {
      if (resultsRef.current) {
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

      <div className="container mx-auto py-10 px-4 md:px-8 relative z-10">
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <SearchResultsHeader
            expandedSearch={expandedSearch}
            setExpandedSearch={setExpandedSearch}
            tripType={tripType}
            setTripType={setTripType}
            handleSearch={handleSearch}
            filteredFlightsCount={filteredFlights.length}
            sortOption={sortOption}
            setSortOption={setSortOption}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Search results area */}
            <div ref={resultsRef} className="lg:col-span-12 p-6 bg-gray-50">
              {selectedFlight === null ? (
                // Flight search results view
                <>
                  <FlightFilters
                    showFilters={showFilters}
                    setShowFilters={setShowFilters}
                    hasActiveFilters={hasActiveFilters}
                    clearFilters={clearFilters}
                    filters={filters}
                    toggleFilter={toggleFilter}
                    toggleAirlineFilter={toggleAirlineFilter}
                    airlines={airlines}
                    showAllAirlines={showAllAirlines}
                    setShowAllAirlines={setShowAllAirlines}
                    isMobile={isMobile}
                    filteredFlightsCount={filteredFlights.length}
                  />

                  {paginatedFlights.length > 0 ? (
                    <div className="space-y-4">
                      {paginatedFlights.map((flight) => (
                        <FlightCard key={flight.id} flight={flight} handleSelectFlight={handleSelectFlight} />
                      ))}
                    </div>
                  ) : (
                    <NoFlightsFound clearFilters={clearFilters} />
                  )}

                  <FlightPagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
                </>
              ) : (
                // Vendor comparison view for selected flight
                <>
                  <SelectedFlightSummary
                    selectedFlightData={selectedFlightData}
                    handleBackToResults={handleBackToResults}
                  />

                  {/* Vendor options */}
                  <div className="space-y-4">
                    {vendorOptions.map((vendor) => (
                      <VendorCard key={vendor.id} vendor={vendor} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
