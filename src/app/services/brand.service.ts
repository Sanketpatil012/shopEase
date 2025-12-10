import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Brand } from '../type/brand';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class BrandService {

  constructor(private http: HttpClient) {}

  getBrandCategory(): Observable<Brand[]> {
    return this.http.get<Brand[]>(`${environment.apiUrl}/brand`);
  }

  deleteBrandByCategory(id: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/brand/${id}`);
  }

  addBrands(name: string): Observable<Brand> {
    return this.http.post<Brand>(`${environment.apiUrl}/brand`, { name });
  }

  updateBrands(id: string, name: string): Observable<Brand> {
    return this.http.put<Brand>(`${environment.apiUrl}/brand/${id}`, { name });
  }

  getBrandById(id: string): Observable<Brand> {
    return this.http.get<Brand>(`${environment.apiUrl}/brand/${id}`);
  }
}
