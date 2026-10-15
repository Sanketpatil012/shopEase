// services/order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface OrderItem {
  product: any;
  quantity: number;
  priceAtTime?: number;
}

export interface Order {
  _id: string;
  orderId: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  orderDate: Date;
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  subjectCart = new BehaviorSubject<any>(null);
  subjectOrders = new BehaviorSubject<Order[]>([]); 
  
  private cartItemCount = new BehaviorSubject<number>(0);
  
  cartItemCount$ = this.cartItemCount.asObservable();

  constructor(private http: HttpClient) {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    this.getCart().subscribe({
      next: (response) => {
        if (response?.success) {
          this.subjectCart.next(response.cart);
          this.updateCartItemCount(response.cart?.itemCount || 0);
        }
      },
      error: (error) => console.error('Error loading cart:', error)
    });

    this.getUserOrders().subscribe({
      next: (response) => {
        if (response?.success) {
          this.subjectOrders.next(response.orders);
        }
      },
      error: (error) => console.error('Error loading orders:', error)
    });
  }

  private updateCartItemCount(count: number): void {
    this.cartItemCount.next(count);
  }

  getCart(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/orders/cart`);
  }

  addCart(productId: number, quantity: number = 1): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/api/orders/cart/add`, { productId, quantity })
      .pipe(
        tap(response => {
          if (response?.success) {
            this.subjectCart.next(response.cart);
            this.updateCartItemCount(response.cart?.itemCount || 0);
          }
        })
      );
  }

  updateCartItem(productId: number, quantity: number): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/api/orders/cart/update/${productId}`, { quantity })
      .pipe(
        tap(response => {
          if (response?.success) {
            this.subjectCart.next(response.cart);
            this.updateCartItemCount(response.cart?.itemCount || 0);
          }
        })
      );
  }

  removeFromCart(productId: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/api/orders/cart/remove/${productId}`)
      .pipe(
        tap(() => {
          this.loadInitialData();
        })
      );
  }

  placeOrder(orderData: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/api/orders/order/place`, orderData)
      .pipe(
        tap(() => {
          this.loadInitialData();
        })
      );
  }

  getUserOrders(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/orders/orders`);
  }

  getOrderById(orderId: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/orders/order/${orderId}`);
  }

  cancelOrder(orderId: string): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/api/orders/order/${orderId}/cancel`, {})
      .pipe(
        tap(() => {
          this.loadInitialData();
        })
      );
  }

  getCurrentCartValue(): any {
    return this.subjectCart.value;
  }

  getCurrentOrdersValue(): Order[] {
    return this.subjectOrders.value;
  }

  clearCart(): void {
    this.subjectCart.next(null);
    this.subjectOrders.next([]);
    this.updateCartItemCount(0);
  }
}