import { CourierBookingRequest, CourierBookingResponse, CourierTrackingResponse, CourierCity } from '@/types'

// PostEx API Integration
export class PostExAPI {
  private apiToken: string
  private apiUrl: string

  constructor(apiToken: string, apiUrl: string) {
    this.apiToken = apiToken
    this.apiUrl = apiUrl
  }

  async getCities(): Promise<CourierCity[]> {
    try {
      const response = await fetch(`${this.apiUrl}/v2/get-operational-city`, {
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      
      if (data.success) {
        return data.cities.map((city: any) => ({
          id: city.id,
          name: city.name,
          code: city.code
        }))
      }
      
      throw new Error(data.message || 'Failed to fetch cities')
    } catch (error) {
      console.error('PostEx getCities error:', error)
      throw error
    }
  }

  async createBooking(booking: CourierBookingRequest): Promise<CourierBookingResponse> {
    try {
      const payload = {
        customerName: booking.customer_name,
        customerPhone: booking.customer_phone,
        customerAddress: booking.customer_address,
        deliveryAddress: booking.destination_city,
        invoicePayment: booking.cod_amount || 0,
        orderRefNumber: `LBC${Date.now()}`,
        itemsDetail: booking.product_details || 'General Items',
        pickupAddressCode: 1, // Default pickup location
        deliveryAddressCode: 1, // Will be mapped from city
        itemsQuantity: booking.pieces || 1,
        service: 0, // Normal delivery
        orderType: 1 // COD
      }

      const response = await fetch(`${this.apiUrl}/v3/create-order`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (data.success) {
        return {
          success: true,
          tracking_number: data.trackingNumber,
          courier_reference: data.orderRefNumber,
          label_url: data.labelUrl
        }
      }

      return {
        success: false,
        error: data.message || 'Booking failed'
      }
    } catch (error) {
      console.error('PostEx booking error:', error)
      return {
        success: false,
        error: 'Network error occurred'
      }
    }
  }

  async trackShipment(trackingNumber: string): Promise<CourierTrackingResponse> {
    try {
      const response = await fetch(`${this.apiUrl}/v1/track-order/${trackingNumber}`, {
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (data.success) {
        return {
          success: true,
          status: data.trackingDetail?.status || 'unknown',
          tracking_history: data.trackingDetail?.history || [],
          current_location: data.trackingDetail?.currentLocation,
          estimated_delivery: data.trackingDetail?.estimatedDelivery
        }
      }

      return {
        success: false,
        error: data.message || 'Tracking failed'
      }
    } catch (error) {
      console.error('PostEx tracking error:', error)
      return {
        success: false,
        error: 'Network error occurred'
      }
    }
  }
}

// BlueEx API Integration
export class BlueExAPI {
  private apiUrl: string
  private account: string
  private username: string
  private password: string

  constructor(apiUrl: string, account: string, username: string, password: string) {
    this.apiUrl = apiUrl
    this.account = account
    this.username = username
    this.password = password
  }

  async getCities(): Promise<CourierCity[]> {
    try {
      const response = await fetch(`${this.apiUrl.replace('serverjson.php', 'cities/serverjson.php')}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          request: 'getCities',
          userid: this.username,
          password: this.password
        })
      })

      const data = await response.json()

      if (data.status === 'success') {
        return data.cities.map((city: any) => ({
          id: city.id,
          name: city.name
        }))
      }

      throw new Error(data.message || 'Failed to fetch cities')
    } catch (error) {
      console.error('BlueEx getCities error:', error)
      throw error
    }
  }

  async createBooking(booking: CourierBookingRequest): Promise<CourierBookingResponse> {
    try {
      const payload = {
        request: 'createBooking',
        userid: this.username,
        password: this.password,
        account: this.account,
        consigneename: booking.customer_name,
        consigneephone: booking.customer_phone,
        consigneeaddress: booking.customer_address,
        destinationcity: booking.destination_city,
        weight: booking.weight || 1,
        pieces: booking.pieces || 1,
        codamount: booking.cod_amount || 0,
        productdetail: booking.product_details || 'General Items',
        fragile: 'No',
        service: 'O', // Overnight
        testbit: 'n' // Production mode
      }

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (data.status === 'success') {
        return {
          success: true,
          tracking_number: data.airwaybillnumber,
          courier_reference: data.referencenumber
        }
      }

      return {
        success: false,
        error: data.message || 'Booking failed'
      }
    } catch (error) {
      console.error('BlueEx booking error:', error)
      return {
        success: false,
        error: 'Network error occurred'
      }
    }
  }

  async trackShipment(trackingNumber: string): Promise<CourierTrackingResponse> {
    try {
      const response = await fetch(`${this.apiUrl.replace('serverjson.php', 'tracking/serverjson.php')}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          request: 'trackShipment',
          userid: this.username,
          password: this.password,
          trackingnumber: trackingNumber
        })
      })

      const data = await response.json()

      if (data.status === 'success') {
        return {
          success: true,
          status: data.trackinginfo?.status || 'unknown',
          tracking_history: data.trackinginfo?.history || [],
          current_location: data.trackinginfo?.currentlocation
        }
      }

      return {
        success: false,
        error: data.message || 'Tracking failed'
      }
    } catch (error) {
      console.error('BlueEx tracking error:', error)
      return {
        success: false,
        error: 'Network error occurred'
      }
    }
  }
}

// TCS API Integration
export class TCSAPI {
  private apiUrl: string
  private apiKey: string
  private clientId: string

  constructor(apiUrl: string, apiKey: string, clientId: string) {
    this.apiUrl = apiUrl
    this.apiKey = apiKey
    this.clientId = clientId
  }

  async getCities(): Promise<CourierCity[]> {
    try {
      const response = await fetch(`${this.apiUrl}/apigateway/domesticapis/v1/cod/get-cities`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'X-CLIENT-ID': this.clientId,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (data.success) {
        return data.cities.map((city: any) => ({
          id: city.id,
          name: city.name,
          code: city.code
        }))
      }

      throw new Error(data.message || 'Failed to fetch cities')
    } catch (error) {
      console.error('TCS getCities error:', error)
      throw error
    }
  }

  async createBooking(booking: CourierBookingRequest): Promise<CourierBookingResponse> {
    try {
      const payload = {
        consigneeName: booking.customer_name,
        consigneePhone: booking.customer_phone,
        consigneeAddress: booking.customer_address,
        destinationCity: booking.destination_city,
        weight: booking.weight || 1,
        pieces: booking.pieces || 1,
        codAmount: booking.cod_amount || 0,
        productDetail: booking.product_details || 'General Items',
        serviceType: 'O+', // Overnight Plus
        pickupAddress: 'Default' // Will be set based on tenant settings
      }

      const response = await fetch(`${this.apiUrl}/apigateway/domesticapis/v1/cod/create-order`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'X-CLIENT-ID': this.clientId,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (data.success) {
        return {
          success: true,
          tracking_number: data.trackingNumber,
          courier_reference: data.bookingId,
          label_url: data.labelUrl
        }
      }

      return {
        success: false,
        error: data.message || 'Booking failed'
      }
    } catch (error) {
      console.error('TCS booking error:', error)
      return {
        success: false,
        error: 'Network error occurred'
      }
    }
  }

  async trackShipment(trackingNumber: string): Promise<CourierTrackingResponse> {
    try {
      const response = await fetch(`${this.apiUrl}/apigateway/trackingapis/v1/shipment/tracking`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'X-CLIENT-ID': this.clientId,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          trackingNumber: trackingNumber
        })
      })

      const data = await response.json()

      if (data.success) {
        return {
          success: true,
          status: data.trackingData?.status || 'unknown',
          tracking_history: data.trackingData?.history || [],
          current_location: data.trackingData?.currentLocation,
          estimated_delivery: data.trackingData?.estimatedDelivery
        }
      }

      return {
        success: false,
        error: data.message || 'Tracking failed'
      }
    } catch (error) {
      console.error('TCS tracking error:', error)
      return {
        success: false,
        error: 'Network error occurred'
      }
    }
  }
}

// Leopards API Integration
export class LeopardsAPI {
  private apiUrl: string
  private apiKey: string
  private apiPassword: string

  constructor(apiUrl: string, apiKey: string, apiPassword: string) {
    this.apiUrl = apiUrl
    this.apiKey = apiKey
    this.apiPassword = apiPassword
  }

  async getCities(): Promise<CourierCity[]> {
    try {
      const response = await fetch(`${this.apiUrl}/getAllCities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          api_key: this.apiKey,
          api_password: this.apiPassword
        })
      })

      const data = await response.json()

      if (data.status === 1) {
        return data.city_list.map((city: any) => ({
          id: city.id,
          name: city.name
        }))
      }

      throw new Error(data.message || 'Failed to fetch cities')
    } catch (error) {
      console.error('Leopards getCities error:', error)
      throw error
    }
  }

  async createBooking(booking: CourierBookingRequest): Promise<CourierBookingResponse> {
    try {
      const payload = {
        api_key: this.apiKey,
        api_password: this.apiPassword,
        consignee_name: booking.customer_name,
        consignee_phone: booking.customer_phone,
        consignee_address: booking.customer_address,
        destination_city: booking.destination_city,
        weight: booking.weight || 1,
        pieces: booking.pieces || 1,
        cod_amount: booking.cod_amount || 0,
        product_detail: booking.product_details || 'General Items',
        special_instructions: booking.special_instructions || '',
        service_type: 'overnight'
      }

      const response = await fetch(`${this.apiUrl}/bookPacket`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (data.status === 1) {
        return {
          success: true,
          tracking_number: data.track_number,
          courier_reference: data.packet_id
        }
      }

      return {
        success: false,
        error: data.message || 'Booking failed'
      }
    } catch (error) {
      console.error('Leopards booking error:', error)
      return {
        success: false,
        error: 'Network error occurred'
      }
    }
  }

  async trackShipment(trackingNumber: string): Promise<CourierTrackingResponse> {
    try {
      const response = await fetch(`${this.apiUrl}/trackBookedPacket`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          api_key: this.apiKey,
          api_password: this.apiPassword,
          track_number: trackingNumber
        })
      })

      const data = await response.json()

      if (data.status === 1) {
        return {
          success: true,
          status: data.packet_status || 'unknown',
          tracking_history: data.packet_history || [],
          current_location: data.current_location
        }
      }

      return {
        success: false,
        error: data.message || 'Tracking failed'
      }
    } catch (error) {
      console.error('Leopards tracking error:', error)
      return {
        success: false,
        error: 'Network error occurred'
      }
    }
  }
}

// Courier API Factory
export class CourierAPIFactory {
  static createAPI(courier: string, config: any) {
    switch (courier.toLowerCase()) {
      case 'postex':
        return new PostExAPI(config.api_key, config.api_url)
      
      case 'blueex':
        return new BlueExAPI(
          config.api_url,
          config.account_number,
          config.username,
          config.password
        )
      
      case 'tcs':
        return new TCSAPI(config.api_url, config.api_key, config.client_id)
      
      case 'leopards':
        return new LeopardsAPI(config.api_url, config.api_key, config.password)
      
      default:
        throw new Error(`Courier ${courier} not supported`)
    }
  }
}

// Utility functions
export function validateCourierConfig(courier: string, config: any): boolean {
  switch (courier.toLowerCase()) {
    case 'postex':
      return !!(config.api_key && config.api_url)
    
    case 'blueex':
      return !!(config.api_url && config.account_number && config.username && config.password)
    
    case 'tcs':
      return !!(config.api_url && config.api_key && config.client_id)
    
    case 'leopards':
      return !!(config.api_url && config.api_key && config.password)
    
    default:
      return false
  }
}

export function getRequiredConfigFields(courier: string): string[] {
  switch (courier.toLowerCase()) {
    case 'postex':
      return ['api_key', 'api_url']
    
    case 'blueex':
      return ['api_url', 'account_number', 'username', 'password']
    
    case 'tcs':
      return ['api_url', 'api_key', 'client_id']
    
    case 'leopards':
      return ['api_url', 'api_key', 'password']
    
    default:
      return []
  }
}
