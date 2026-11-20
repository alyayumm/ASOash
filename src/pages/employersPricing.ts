// Starting online-theory prices: client brief, 19 November 2026.
// Automatic variants: city price lists dated 1 September 2026 (online, non-VIP).
// Saint Petersburg minimum hours match Moscow by the client's instruction, 19 November 2026.
export const employeeDiscount = 10_000
export type EmployerProgrammeCode = 'a' | 'b' | 'ab'
export type EmployerTransmission = 'manual' | 'automatic'
export type EmployerProgrammePricing = {
  listPrice: number
  automaticListPrice?: number
  carPracticeHours?: number
  motorcyclePracticeHours?: number
  motorcycleAlternativeHours?: number
}

export const employerProgrammes = [
  { code: 'a', category: 'Категория А', title: 'Мотоцикл' },
  { code: 'b', category: 'Категория B', title: 'Автомобиль' },
  { code: 'ab', category: 'Категории А+B', title: 'Мотоцикл и автомобиль' },
] as const

export const employerPriceCities = {
  moscow: {
    label: 'Москва',
    programmes: {
      a: { listPrice: 30_500, motorcyclePracticeHours: 5, motorcycleAlternativeHours: 10 },
      b: { listPrice: 40_500, automaticListPrice: 41_500, carPracticeHours: 20 },
      ab: { listPrice: 62_990, automaticListPrice: 64_990, carPracticeHours: 20, motorcyclePracticeHours: 5, motorcycleAlternativeHours: 10 },
    },
  },
  saintPetersburg: {
    label: 'Санкт-Петербург',
    programmes: {
      a: { listPrice: 29_500, motorcyclePracticeHours: 5 },
      b: { listPrice: 60_000, automaticListPrice: 62_000, carPracticeHours: 20 },
      ab: { listPrice: 86_000, automaticListPrice: 88_000, carPracticeHours: 20, motorcyclePracticeHours: 5 },
    },
  },
} satisfies Record<string, { label: string; programmes: Record<EmployerProgrammeCode, EmployerProgrammePricing> }>

export type EmployerPriceCity = keyof typeof employerPriceCities

const rubles = new Intl.NumberFormat('ru-RU', {
  style: 'currency', currency: 'RUB', maximumFractionDigits: 0,
})
const percentage = new Intl.NumberFormat('ru-RU', {
  style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1,
})

export const formatEmployerPrice = (amount: number) => rubles.format(amount)

export function getEmployeePrice(listPrice: number) {
  return {
    price: listPrice - employeeDiscount,
    discountPercent: percentage.format(employeeDiscount / listPrice),
  }
}
