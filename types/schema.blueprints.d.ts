export interface Blueprint {
  activities: {
    manufacturing: {
      materials: {
        quantity: number; typeID: number
      }[],
      products: { quantity: number; typeID: number }[],
      time: number
    }
  },
  blueprintTypeID: number,
  maxProductionLimit: number
}
