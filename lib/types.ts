export type MachineType = 'abkant' | 'giyotin' | 'press' | 'silindir' | 'boru-bukum' | 'testere' | 'diger'
export type MachineCondition = 'calisiyor' | 'arizali' | 'bakim-gerekli'
export type ListingStatus = 'bekliyor' | 'teklif-verildi' | 'yanit-bekliyor' | 'kabul' | 'red' | 'satildi'
export type CustomerResponse = 'kabul' | 'red' | 'karsi-teklif'

export interface Listing {
  id: string
  created_at: string
  machine_type: MachineType
  brand: string
  model: string
  year: number
  capacity: string
  condition: MachineCondition
  location_city: string
  location_district: string
  contact_name: string
  contact_phone: string
  contact_email: string
  photos: string[]
  status: ListingStatus
  sell_reason?: string | null
  offer_price?: number | null
  offer_sent_at?: string | null
  notes?: string | null
  offer_token?: string | null
  offer_token_expires_at?: string | null
  customer_response?: CustomerResponse | null
  customer_note?: string | null
  counter_offer_price?: number | null
}

export const sellReasonLabels: Record<string, string> = {
  'kapasite-artisi':  'Kapasite artışı — yeni makine alındı',
  'is-yeri-kapaniyor':'İş yeri kapanıyor / taşınıyor',
  'model-degisikligi':'Model değişikliği',
  'atil-kullanim':    'Atıl kullanım / ihtiyaç duyulmuyor',
  'finansal-neden':   'Finansal neden',
  'diger':            'Diğer',
}

export const machineTypeLabels: Record<MachineType, string> = {
  abkant:      'Abkant Pres',
  giyotin:     'Giyotin Makas',
  press:       'Pres Makineleri',
  silindir:    'Silindir Makineleri',
  'boru-bukum':'Boru Büküm Makineleri',
  testere:     'Testereler',
  diger:       'Diğer',
}

export const conditionLabels: Record<MachineCondition, string> = {
  calisiyor: 'Çalışıyor',
  arizali: 'Arızalı',
  'bakim-gerekli': 'Bakım Gerekli',
}

export const statusLabels: Record<ListingStatus, string> = {
  bekliyor: 'Bekliyor',
  'teklif-verildi': 'Teklif Verildi',
  'yanit-bekliyor': 'Yanıt Bekliyor',
  kabul: 'Kabul Edildi',
  red: 'Reddedildi',
  satildi: 'Satıldı (Başkasına)',
}

export const statusColors: Record<ListingStatus, string> = {
  bekliyor: 'bg-yellow-100 text-yellow-800',
  'teklif-verildi': 'bg-blue-100 text-blue-800',
  'yanit-bekliyor': 'bg-purple-100 text-purple-800',
  kabul: 'bg-green-100 text-green-800',
  red: 'bg-red-100 text-red-800',
  satildi: 'bg-gray-100 text-gray-600',
}
