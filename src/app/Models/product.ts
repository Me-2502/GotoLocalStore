export class Product {
    constructor(
        id: string,
        name: string,
        imgUrl: string,
        price: number,
        brand: string,
        available: boolean,
        inStock: number,
        category: string,
        discount: number,
        otherFeatures: object,
        description: string) {
        this.id = id;
        this.name = name;
        this.imgUrl = imgUrl;
        this.price = price;
        this.brand = brand;
        this.available = available;
        this.inStock = inStock;
        this.category = category;
        this.otherFeatures = otherFeatures;
        this.discount = discount;
        this.description = description;
        this.ratings = NaN;
        this.reviews = [];
        this.specifications = [];
    }
    id: string;
    name: string;
    imgUrl: string;
    price: number;
    brand: string;
    available: boolean;
    inStock: number;
    category: string;
    discount?: number;
    otherFeatures: {};
    description: string;
    ratings?: number;
    numberOfRatings: number = 0;
    reviews?: { name: string, rating: number, date: Date, comment: string }[];
    specifications?: {}[];
}