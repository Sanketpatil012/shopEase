// components/order/order.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService, Order, OrderItem } from '../../services/order.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit, OnDestroy {
  currentOrderItems: OrderItem[] = [];
  totalAmount: number = 0;
  pastOrders: Order[] = [];
  selectedTab: 'current' | 'past' = 'current';
  private destroy$ = new Subject<void>();

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    // Subscribe to cart changes
    this.orderService.subjectCart
      .pipe(takeUntil(this.destroy$))
      .subscribe(cartData => {
        if (cartData) {
          this.currentOrderItems = cartData.items || [];
          this.totalAmount = cartData.totalAmount || 0;
        } else {
          this.currentOrderItems = [];
          this.totalAmount = 0;
        }
      });

    // Subscribe to orders history
    this.orderService.subjectOrders
      .pipe(takeUntil(this.destroy$))
      .subscribe(orders => {
        console.log('Orders received:', orders); // Debug log
        this.pastOrders = orders || [];
      });
  }

  getTotalQuantity(): number {
    let total = 0;
    for (let item of this.currentOrderItems) {
      total += item.quantity;
    }
    return total;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  updateQuantity(product: any, newQuantity: number): void {
    if (newQuantity < 1) {
      this.removeItem(product);
    } else {
      this.orderService.updateCartItem(product._id, newQuantity).subscribe({
        error: (error) => console.error('Error updating quantity:', error)
      });
    }
  }

  removeItem(product: any): void {
    if (confirm('Remove this item from your order?')) {
      this.orderService.removeFromCart(product._id).subscribe({
        error: (error) => console.error('Error removing item:', error)
      });
    }
  }

  placeOrder(): void {
    if (this.currentOrderItems.length === 0) {
      alert('Please add items to your order');
      return;
    }

    const orderData = {
      paymentMethod: 'cod',
      notes: ''
    };

    this.orderService.placeOrder(orderData).subscribe({
      next: (response) => {
        alert(`Order placed successfully! Order ID: ${response.order.orderId}`);
        this.selectedTab = 'past';
      },
      error: (error) => {
        console.error('Error placing order:', error);
        alert(error.error?.message || 'Failed to place order');
      }
    });
  }

  cancelOrder(order: Order): void {
    if (confirm(`Are you sure you want to cancel order ${order.orderId}?`)) {
      this.orderService.cancelOrder(order.orderId).subscribe({
        next: () => alert('Order cancelled successfully'),
        error: (error) => console.error('Error cancelling order:', error)
      });
    }
  }

  getFinalPrice(product: any): number {
    return (product.price || 0) - (product.discount || 0);
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }

  // ========== ADD THESE HELPER METHODS FOR PAST ORDERS ==========

  // Get product image from either product or productSnapshot
  getProductImage(item: any): string {
    // For current cart items
    if (item.product && item.product.image && item.product.image.length > 0) {
      return item.product.image[0];
    }
    // For past orders - use productSnapshot
    if (item.productSnapshot && item.productSnapshot.image && item.productSnapshot.image.length > 0) {
      return item.productSnapshot.image[0];
    }
    // Return a default image if no image found
    return 'assets/images/default-product.png';
  }

  // Get product name from either product or productSnapshot
  getProductName(item: any): string {
    // For current cart items
    if (item.product && item.product.name) {
      return item.product.name;
    }
    // For past orders - use productSnapshot
    if (item.productSnapshot && item.productSnapshot.name) {
      return item.productSnapshot.name;
    }
    return 'Product Name Not Available';
  }

  // Get product description from either product or productSnapshot
  getProductDescription(item: any): string {
    // For current cart items
    if (item.product && item.product.shortDescription) {
      return item.product.shortDescription;
    }
    // For past orders - use productSnapshot
    if (item.productSnapshot && item.productSnapshot.shortDescription) {
      return item.productSnapshot.shortDescription;
    }
    return 'Description not available';
  }

  // Get product price from either product, priceAtTime, or productSnapshot
  getProductPrice(item: any): number {
    // For current cart items
    if (item.product && item.product.price) {
      return (item.product.price || 0) - (item.product.discount || 0);
    }
    // For past orders - use priceAtTime which was saved when order was placed
    if (item.priceAtTime) {
      return item.priceAtTime;
    }
    // Fallback to productSnapshot price
    if (item.productSnapshot && item.productSnapshot.price) {
      return (item.productSnapshot.price || 0) - (item.productSnapshot.discount || 0);
    }
    return 0;
  }
}