import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../type/product';
import { Category } from '../type/category';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    });
  }

  getNewProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.apiUrl}/customer/home/new-product`, {
      headers: this.getHeaders()
    });
  }

  getFeaturedProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.apiUrl}/customer/home/featured-products`, {
      headers: this.getHeaders()
    });
  }

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${environment.apiUrl}/customer/categories`, {
      headers: this.getHeaders()
    });
  }
}