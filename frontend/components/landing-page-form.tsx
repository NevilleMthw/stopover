"use client"

import { Calendar, ChevronDown, Plane } from "lucide-react"
import { Checkbox } from "./ui/checkbox"
import Link from "next/link"
import type { Dispatch, SetStateAction } from "react"

interface LandingPageFormProps {
  tripType: string
  setTripType: Dispatch<SetStateAction<string>>
  handleSearch: () => void
}

export default function LandingPageForm({ tripType, setTripType, handleSearch }: LandingPageFormProps) {
  return (
    <div className="relative z-10 h-screen flex flex-col">
      {/* Header */}
      <header className="flex h-16 w-full items-center justify-between px-4 md:px-6 border-b-2">
        <Link className="flex items-center gap-2 text-lg font-semibold md:text-base" href="/">
          <Plane className="h-6 w-6" />
          <span className="sr-only">Stopover</span>
          <span>Stopover</span>
        </Link>
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
  )
}
