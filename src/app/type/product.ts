export interface Product {
  _id:number
  name: string,
  shortDescription: string,
  description: string,
  price: number,
  discount: number,
  image:string[], 
  categoryId: string,
  brandId:string,
  isFeatured:boolean,
   isNewProduct:boolean,
  actualPrice:number
}