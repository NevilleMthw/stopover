"use client"

import { useState, useRef, useEffect } from "react"
import {
  Calendar,
  ChevronDown,
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
} from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"

// Sample flight data
const flightResults = [
  {
    id: 1,
    airline: "Air Canada",
    logo: "/placeholder.svg?height=40&width=40",
    departureTime: "08:30",
    arrivalTime: "11:45",
    duration: "3h 15m",
    departureAirport: "YYZ",
    arrivalAirport: "SEA",
    price: "$432",
    stops: "Nonstop",
    amenities: ["wifi", "food", "entertainment"],
  },
  {
    id: 2,
    airline: "Delta Airlines",
    logo: "/placeholder.svg?height=40&width=40",
    departureTime: "10:15",
    arrivalTime: "13:50",
    duration: "3h 35m",
    departureAirport: "YYZ",
    arrivalAirport: "SEA",
    price: "$389",
    stops: "Nonstop",
    amenities: ["wifi", "food"],
  },
  {
    id: 3,
    airline: "United Airlines",
    logo: "/placeholder.svg?height=40&width=40",
    departureTime: "13:45",
    arrivalTime: "18:20",
    duration: "4h 35m",
    departureAirport: "YYZ",
    arrivalAirport: "SEA",
    price: "$356",
    stops: "1 stop (ORD)",
    amenities: ["wifi", "entertainment"],
  },
  {
    id: 4,
    airline: "Alaska Airlines",
    logo: "/placeholder.svg?height=40&width=40",
    departureTime: "16:30",
    arrivalTime: "19:45",
    duration: "3h 15m",
    departureAirport: "YYZ",
    arrivalAirport: "SEA",
    price: "$412",
    stops: "Nonstop",
    amenities: ["wifi", "food", "entertainment"],
  },
  {
    id: 5,
    airline: "American Airlines",
    logo: "/placeholder.svg?height=40&width=40",
    departureTime: "19:20",
    arrivalTime: "23:05",
    duration: "3h 45m",
    departureAirport: "YYZ",
    arrivalAirport: "SEA",
    price: "$378",
    stops: "Nonstop",
    amenities: ["wifi"],
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

// Custom hook to detect if on mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    // Initial check
    checkIfMobile()

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  return isMobile
}

export default function FlightBooking() {
  const [tripType, setTripType] = useState("one-way")
  const [showResults, setShowResults] = useState(false)
  const [selectedFlight, setSelectedFlight] = useState<number | null>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()

  const handleSearch = () => {
    setShowResults(true)
    setSelectedFlight(null)

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

  // Get the selected flight data
  const selectedFlightData = selectedFlight ? flightResults.find((flight) => flight.id === selectedFlight) : null

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

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Booking form - left side */}
              <div className="lg:col-span-4 p-6">
                {/* Trip type selector */}
                <div className="grid grid-cols-3 gap-2 mb-8">
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

                {/* From section */}
                <div className="mb-4">
                  <div className="text-xs text-gray-500 mb-1">FROM</div>
                  <div className="text-2xl font-bold mb-1">Toronto (YYZ)</div>
                  <div className="text-sm text-gray-500">Toronto Pearson International Airport</div>
                </div>

                {/* To section */}
                <div className="bg-lime-100 p-4 rounded-xl mb-8">
                  <div className="text-xs text-gray-500 mb-1">TO</div>
                  <div className="text-2xl font-bold mb-1">Seattle (SEA)</div>
                  <div className="text-sm text-gray-500">Seattle-Tacoma International Airport</div>
                </div>

                {/* Travel dates */}
                <div className="mb-6">
                  <div className="text-xs text-gray-500 mb-3">TRAVEL DATES</div>
                  <div className="flex items-center border border-gray-200 rounded-lg p-3 mb-4">
                    <Calendar size={18} className="text-gray-400 mr-3" />
                    <span>Tue, December 20, 2023</span>
                  </div>

                  <div className="text-xs text-gray-500 mb-3">RETURN</div>
                  <div className="flex items-center border border-gray-200 rounded-lg p-3 mb-4">
                    <Calendar size={18} className="text-gray-400 mr-3" />
                    <span>Sun, March 26, 2024</span>
                  </div>
                </div>

                {/* Passengers */}
                <div className="mb-6">
                  <div className="text-xs text-gray-500 mb-3">PASSENGERS & CLASS</div>
                  <div className="flex justify-between items-center border border-gray-200 rounded-lg p-3 mb-4">
                    <div>
                      <div>2 Adults, 1 Children</div>
                      <div className="text-sm text-gray-500">Business Class</div>
                    </div>
                    <ChevronDown size={18} className="text-gray-400" />
                  </div>
                </div>

                {/* Flexible dates */}
                <div className="flex items-center mb-8">
                  <Checkbox id="flexible" className="mr-2" />
                  <label htmlFor="flexible" className="text-sm">
                    My date are flexible (+/- days)
                  </label>
                </div>

                {/* Search button */}
                <button className="w-full bg-black text-white py-4 rounded-full font-medium" onClick={handleSearch}>
                  Update Search
                </button>
              </div>

              {/* Search results - right side */}
              <div ref={resultsRef} className="lg:col-span-8 p-6 bg-gray-50">
                {selectedFlight === null ? (
                  // Flight search results view
                  <>
                    <div className="mb-6">
                      <h2 className="text-xl font-bold">Flight Results</h2>
                      <p className="text-sm text-gray-500">5 flights found from Toronto to Seattle on Tue, Dec 20</p>
                    </div>

                    <div className="space-y-4">
                      {flightResults.map((flight) => (
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
