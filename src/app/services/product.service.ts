import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../type/product';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})


export class ProductService {
   
  constructor(private http: HttpClient) { }

  public searchTerm:Subject<string> = new Subject();
  
   getAllProducts(){
     return this.http.get(`${environment.apiUrl}/product`)
   }
   deleteProductbyId(id:string){
     return this.http.delete(`${environment.apiUrl}/product/${id}`)
   }
   updateProduct(id:string , productData:any){
       return this.http.put(`${environment.apiUrl}/product/${id}` , productData )
   }
   getProductById(id:string){
       return this.http.get(`${environment.apiUrl}/product/${id}`)
   }
   addProduct(productData: any) {  
  return this.http.post(`${environment.apiUrl}/product`, productData);
}
getNewProducts() {
  return this.http.get(`${environment.apiUrl}/product/home/new-product`);
}

getFeaturedProducts() {
  return this.http.get(`${environment.apiUrl}/product/home/featured-products`); 
}
}
