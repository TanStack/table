import { faker } from '@faker-js/faker'

export type VehicleOwner = {
  vehicle: string
  vehicleId: string
  vehicleRegMark: string
  buyLocation: string
  ownerName: string
  ownerContacts: string
  comment: string
}

const range = (len: number) => {
  const arr = []
  for (let i = 0; i < len; i++) {
    arr.push(i)
  }
  return arr
}

const newRow = (): VehicleOwner => {
  return {
    vehicle: faker.vehicle.vehicle(),
    vehicleId: faker.vehicle.vin(),
    vehicleRegMark: faker.vehicle.vrm(),
    buyLocation: `${faker.location.city()}\n${faker.location.state()}`,
    ownerName: `${faker.person.firstName()}\n${faker.person.lastName()}`,
    ownerContacts: `${faker.phone.number()}\n${faker.internet.email()}`,
    comment: faker.lorem.lines(),
  }
}

export function makeData(len: number) {
  return range(len).map((d): VehicleOwner => {
    return newRow()
  })
}
