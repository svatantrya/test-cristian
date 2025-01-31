export const initialUser = {
  name: "",
  age: 0,
};

export class Flat {
  constructor(
    cityName,
    streetName,
    streetNo,
    areaSize,
    hasAC,
    yearBuilt,
    rentPrice,
    dateAvailable,
    picture,
    favourite
  ) {
    this.cityName = cityName;
    this.streetName = streetName;
    this.streetNo = streetNo;
    this.areaSize = areaSize;
    this.hasAC = hasAC;
    this.yearBuilt = yearBuilt;
    this.rentPrice = rentPrice;
    this.dateAvailable = dateAvailable;
    this.picture = picture;
    this.favourite = favourite;
  }
}
