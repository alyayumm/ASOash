import type { EmployerCity } from './employersData'

export type EmployerCategory = 'A' | 'B'
export type EmployerTransmission = 'МКПП' | 'АКПП'

// Starting online-theory programmes from the approved city price lists.
// Corporate discounts updated by the client on 20 November 2026.
// Saint Petersburg minimum practice hours match Moscow as agreed with the client.
const programmes = {
  moscow: {
    A: { listPrice: 30_500, discount: 5_000, practiceHours: 5 },
    B: { listPrice: 40_500, automaticListPrice: 41_500, discount: 7_000, practiceHours: 20 },
  },
  spb: {
    A: { listPrice: 29_500, discount: 5_000, practiceHours: 5 },
    B: { listPrice: 60_000, automaticListPrice: 62_000, discount: 10_000, practiceHours: 20 },
  },
} as const

const rubles = new Intl.NumberFormat('ru-RU', {
  style: 'currency', currency: 'RUB', maximumFractionDigits: 0,
})
const percentage = new Intl.NumberFormat('ru-RU', {
  style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1,
})
export const formatEmployerPrice = (amount: number) => rubles.format(amount)

export function getEmployerPrice(city: EmployerCity, category: EmployerCategory, transmission: EmployerTransmission) {
  const programme = programmes[city][category]
  const listPrice = category === 'B' && transmission === 'АКПП'
    ? programmes[city].B.automaticListPrice
    : programme.listPrice
  const price = listPrice - programme.discount
  return {
    listPrice, price, practiceHours: programme.practiceHours,
    discountPercent: percentage.format((listPrice - price) / listPrice),
  }
}
