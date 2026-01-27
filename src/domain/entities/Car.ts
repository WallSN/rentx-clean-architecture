export class Car {
    id: string;
    licensePlate: string;
    available: boolean;

    constructor(id: string, licensePlate: string, available: boolean = true) {
        this.id = id;
        this.licensePlate = licensePlate;
        this.available = available;
    }
}