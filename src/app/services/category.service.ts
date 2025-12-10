import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../type/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
   
   
  constructor( private http : HttpClient) { }
   
   getCategory():Observable<Category[]>{
      return this.http.get<Category[]>(`${environment.apiUrl}/category`)
   }
   addCategory(name:string){
     return this.http.post(`${environment.apiUrl}/category` , {
      name:name  
     })
   }
   
   getCategoryById(id: any ){
        return this.http.get(`${environment.apiUrl}/category/${id}`)
   }
   
   getUpdatedCategory(id:any ,  name:string   ){
      return this.http.put(`${environment.apiUrl}/category/${id}` , {
         name:name
      })
   }
   
   getDeleteCategory(id:string){
       return this.http.delete(`${environment.apiUrl}/categor/${id}`)
   }
  

}
