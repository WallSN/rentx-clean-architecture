export class Rental {
    id: string;
    userId: string;
    carId: string;
    startDate: Date;
    endDate: Date;

    constructor(id: string, userId: string, carId: string, startDate: Date, endDate: Date) {
        this.id = id;
        this.userId = userId;
        this.carId = carId;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}