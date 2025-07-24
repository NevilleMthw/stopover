package main

type PassengerInfo struct {
	Adults   int `json:"adults"`
	Children int `json:"children"`
	Infants  int `json:"infants"`
}

type Segment struct {
	Origin      string `json:"origin"`
	Destination string `json:"destination"`
	Date        string `json:"date"`
}

type FlightSearchRequest struct {
	Signature  string        `json:"signature"`
	Marker     string        `json:"marker"`
	Host       string        `json:"host"`
	UserIP     string        `json:"user_ip"`
	Locale     string        `json:"locale"`
	TripClass  string        `json:"trip_class"`
	Passengers PassengerInfo `json:"passengers"`
	Segments   []Segment     `json:"segments"`
}

type FlightSearchInitResponse struct {
	SearchID string `json:"search_id"`
	UUID     string `json:"uuid"`
}

type FlightSearchResultResponse struct {
	SearchID  string                   `json:"search_id"`
	Proposals []map[string]interface{} `json:"proposals"`
}

type FlightSearchResponseWrapper struct {
	Proposals    []Proposal            `json:"proposals,omitempty"`
	Airports     map[string]Airport    `json:"airports,omitempty"`
	SearchID     string                `json:"search_id"`
	ChunkID      string                `json:"chunk_id,omitempty"`
	Meta         Meta                  `json:"meta,omitempty"`
	Airlines     map[string]Airline    `json:"airlines,omitempty"`
	GatesInfo    map[string]GateInfo   `json:"gates_info,omitempty"`
	FlightInfo   map[string]FlightInfo `json:"flight_info,omitempty"`
	FiltersBound FiltersBoundary       `json:"filters_boundary,omitempty"`
	Segments     []SegmentMeta         `json:"segments,omitempty"`
	Market       string                `json:"market,omitempty"`
	CleanMarker  string                `json:"clean_marker,omitempty"`
	OpenJaw      bool                  `json:"open_jaw,omitempty"`
	Currency     string                `json:"currency,omitempty"`
	InitiatedAt  string                `json:"initiated_at,omitempty"`
}

// ---- Nested types ----

type Proposal struct {
	Terms         map[string]TermData             `json:"terms"`
	XTerms        map[string]map[string]XTermData `json:"xterms"`
	Segment       []FlightSegment                 `json:"segment"`
	TotalDuration int                             `json:"total_duration"`
	StopsAirports []string                        `json:"stops_airports"`
	IsCharter     bool                            `json:"is_charter"`
	MaxStops      int                             `json:"max_stops"`
	Carriers      []string                        `json:"carriers"`
	SegmentDur    []int                           `json:"segment_durations"`
	SegmentsTime  [][]int64                       `json:"segments_time"`
	SegmentsAirpt [][]string                      `json:"segments_airports"`
	Sign          string                          `json:"sign"`
	IsDirect      bool                            `json:"is_direct"`
	FlightWeight  float64                         `json:"flight_weight"`
	Popularity    int                             `json:"popularity"`
	SegmentsRate  float64                         `json:"segments_rating"`
	Tags          []string                        `json:"tags"`
	ValCarrier    string                          `json:"validating_carrier"`
}

type TermData struct {
	Currency           string      `json:"currency"`
	Price              float64     `json:"price"`
	UnifiedPrice       float64     `json:"unified_price"`
	URL                interface{} `json:"url"`
	Multiplier         float64     `json:"multiplier"`
	ProposalMultiplier int         `json:"proposal_multiplier"`
	FlightsHandbags    interface{} `json:"flights_handbags,omitempty"`
	HandbagsSource     [][]int     `json:"handbags_source"`
}

type XTermData struct {
	Currency           string      `json:"currency"`
	Price              float64     `json:"price"`
	UnifiedPrice       float64     `json:"unified_price"`
	URL                interface{} `json:"url"`
	Multiplier         float64     `json:"multiplier"`
	ProposalMultiplier int         `json:"proposal_multiplier"`
}

type FlightSegment struct {
	Flight []Flight `json:"flight"`
	Rating struct {
		Total    float64 `json:"total"`
		Detailed struct {
			Transfer      float64 `json:"transfer"`
			ArrivalTime   float64 `json:"arrival_time"`
			DepartureTime float64 `json:"departure_time"`
		} `json:"detailed"`
	} `json:"rating"`
	Transfers []Transfer `json:"transfers"`
}

type Flight struct {
	Aircraft                string  `json:"aircraft"`
	Arrival                 string  `json:"arrival"`
	ArrivalDate             string  `json:"arrival_date"`
	ArrivalTime             string  `json:"arrival_time"`
	ArrivalTimestamp        int64   `json:"arrival_timestamp"`
	Delay                   int     `json:"delay"`
	Departure               string  `json:"departure"`
	DepartureDate           string  `json:"departure_date"`
	DepartureTime           string  `json:"departure_time"`
	DepartureTimestamp      int64   `json:"departure_timestamp"`
	Duration                int     `json:"duration"`
	Equipment               string  `json:"equipment"`
	LocalArrivalTimestamp   int64   `json:"local_arrival_timestamp"`
	LocalDepartureTimestamp int64   `json:"local_departure_timestamp"`
	MarketingCarrier        string  `json:"marketing_carrier"`
	Number                  string  `json:"number"`
	OperatingCarrier        string  `json:"operating_carrier"`
	OperatedBy              string  `json:"operated_by"`
	Rating                  float64 `json:"rating"`
	TripClass               string  `json:"trip_class"`
}

type Transfer struct {
	Duration struct {
		Seconds int `json:"seconds"`
	} `json:"duration"`
	At          string   `json:"at"`
	To          string   `json:"to"`
	Airports    []string `json:"airports"`
	Airlines    []string `json:"airlines"`
	CountryCode string   `json:"country_code"`
	CityCode    string   `json:"city_code"`
	VisaRules   struct {
		Required bool `json:"required"`
	} `json:"visa_rules"`
	NightTransfer   bool     `json:"night_transfer"`
	Tags            []string `json:"tags"`
	DurationSeconds int      `json:"duration_seconds"`
}

type Airport struct {
	Name        string `json:"name"`
	City        string `json:"city"`
	CityCode    string `json:"city_code"`
	Country     string `json:"country"`
	CountryCode string `json:"country_code"`
	TimeZone    string `json:"time_zone"`
	Coordinates struct {
		Lat float64 `json:"lat"`
		Lon float64 `json:"lon"`
	} `json:"coordinates"`
}

type Meta struct {
	UUID  string `json:"uuid"`
	Gates []struct {
		Count     int         `json:"count"`
		GoodCount int         `json:"good_count"`
		BadCount  interface{} `json:"bad_count,omitempty"`
		Duration  float64     `json:"duration"`
		ID        int         `json:"id"`
		GateLabel string      `json:"gate_label"`
		Error     struct {
			Code int    `json:"code"`
			Tos  string `json:"tos"`
		} `json:"error"`
		CreatedAt        int64  `json:"created_at"`
		ServerName       string `json:"server_name"`
		Cache            bool   `json:"cache"`
		CacheSearchUUID  string `json:"cache_search_uuid"`
		MergedCodeshares int    `json:"merged_codeshares"`
	} `json:"gates"`
}

type Airline struct {
	ID           int     `json:"id"`
	IATA         string  `json:"iata"`
	AverageRate  float64 `json:"average_rate"`
	Rates        int     `json:"rates"`
	Name         string  `json:"name"`
	AllianceID   int     `json:"alliance_id"`
	AllianceName string  `json:"alliance_name"`
	BrandColor   string  `json:"brand_color"`
}

type GateInfo struct {
	ID             int      `json:"id"`
	Label          string   `json:"label"`
	PaymentMethods []string `json:"payment_methods"`
	Productivity   int      `json:"productivity"`
	CurrencyCode   string   `json:"currency_code"`
}

type FlightInfo struct {
	Amenities struct {
		WiFi struct {
			Exists  bool   `json:"exists"`
			Paid    bool   `json:"paid"`
			Type    string `json:"type"`
			Summary string `json:"summary"`
		} `json:"wifi"`
		Layout struct {
			RowLayout string `json:"row_layout"`
			Type      string `json:"type"`
			Quality   string `json:"quality"`
		} `json:"layout"`
		Power struct {
			Exists  bool   `json:"exists"`
			Paid    bool   `json:"paid"`
			Type    string `json:"type"`
			Summary string `json:"summary"`
		} `json:"power"`
		Food struct {
			Exists  bool   `json:"exists"`
			Paid    bool   `json:"paid"`
			Type    string `json:"type"`
			Summary string `json:"summary"`
		} `json:"food"`
		Entertainment struct {
			Exists  bool   `json:"exists"`
			Paid    bool   `json:"paid"`
			Type    string `json:"type"`
			Summary string `json:"summary"`
		} `json:"entertainment"`
		Beverage struct {
			Type             string `json:"type"`
			Quality          string `json:"quality"`
			AlcoholicPaid    bool   `json:"alcoholic_paid"`
			NonAlcoholicPaid bool   `json:"nonalcoholic_paid"`
			Exists           bool   `json:"exists"`
		} `json:"beverage"`
	} `json:"amenities"`
	Seat struct {
		Width int    `json:"width"`
		Pitch int    `json:"pitch"`
		Type  string `json:"type"`
	} `json:"seat"`
}

type FiltersBoundary struct {
	ArrivalTime1 struct {
		Max string `json:"max"`
		Min string `json:"min"`
	} `json:"arrival_time_1"`
	ArrivalTime0 struct {
		Max string `json:"max"`
		Min string `json:"min"`
	} `json:"arrival_time_0"`
	ArrivalDatetime0 struct {
		Max int64 `json:"max"`
		Min int64 `json:"min"`
	} `json:"arrival_datetime_0"`
	ArrivalDatetime1 struct {
		Max int64 `json:"max"`
		Min int64 `json:"min"`
	} `json:"arrival_datetime_1"`
	DepartureMinutes0 struct {
		Max int `json:"max"`
		Min int `json:"min"`
	} `json:"departure_minutes_0"`
	DepartureMinutes1 struct {
		Max int `json:"max"`
		Min int `json:"min"`
	} `json:"departure_minutes_1"`
	DepartureTime0 struct {
		Max string `json:"max"`
		Min string `json:"min"`
	} `json:"departure_time_0"`
	DepartureTime1 struct {
		Max string `json:"max"`
		Min string `json:"min"`
	} `json:"departure_time_1"`
	FlightsDuration struct {
		Max int `json:"max"`
		Min int `json:"min"`
	} `json:"flights_duration"`
	StopsDuration struct {
		Max int `json:"max"`
		Min int `json:"min"`
	} `json:"stops_duration"`
	StopsCount map[string]int `json:"stops_count"`
	Price      struct {
		Max int `json:"max"`
		Min int `json:"min"`
	} `json:"price"`
	Airports struct {
		Arrival   []string `json:"arrival"`
		Departure []string `json:"departure"`
	} `json:"airports"`
}

type SegmentMeta struct {
	Origin              string `json:"origin"`
	OriginCountry       string `json:"origin_country"`
	OriginalOrigin      string `json:"original_origin"`
	Destination         string `json:"destination"`
	DestinationCountry  string `json:"destination_country"`
	OriginalDestination string `json:"original_destination"`
	Date                string `json:"date"`
	DepartDate          string `json:"depart_date"`
}
