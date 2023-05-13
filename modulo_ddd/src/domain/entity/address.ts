export default class Address {
  private _street: string;
  private _number: number;
  private _zip: string;
  private _city: string;

  constructor(street: string, number: number, zip: string, city: string) {
    this._street = street;
    this._number = number;
    this._zip = zip;
    this._city = city;
    this.validate();
  }

  get street(): string {
    return this._street;
  }

  get number(): number {
    return this._number;
  }

  get city(): string {
    return this._city;
  }

  get zip(): string {
    return this._zip;
  }

  changeStreet(street: string): void {
    this._street = street;
    this.validate();
  }

  changeCity(city: string): void {
    this._city = city;
    this.validate();
  }

  changeZip(zip: string): void {
    this._zip = zip;
    this.validate();
  }

  validate(): boolean {
    if (this._street.length === 0) {
      throw new Error("Street is required");
    }
    if (this._zip.length === 0) {
      throw new Error("Zip is required");
    }
    if (this._city.length === 0) {
      throw new Error("City is required");
    }
    return true;
  }
}
