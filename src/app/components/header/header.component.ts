// components/header/header.component.ts
import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { Category } from '../../type/category';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() categorySelected = new EventEmitter<string>()
  
  categoryList: Category[] = [];
  userName: any = '';
  private authSubscription!: Subscription;
  isLoggedIn: boolean = false;
  private categoriesLoaded: boolean = false;
  showMobileMenu: boolean = false;
  showMobileSearch: boolean = false;
  showCartDropdown: boolean = false;
  
  cartItems: any[] = [];
  cartItemCount: number = 0;
  cartTotalAmount: number = 0;

  SearchTerm!: string
  
  constructor(
    private customerService: CustomerService,
    private route: Router,
    public auth_Service: AuthService,
    private productService: ProductService,
    private orderService: OrderService
  ) {  
    this.route.events.subscribe(() => {
      this.showMobileMenu = false;
      this.showMobileSearch = false;
      this.showCartDropdown = false;
    });
  }

  ngOnInit(): void {
    this.isLoggedIn = this.auth_Service.isLoggedIn();
    this.userName = this.auth_Service.getUserName();
    
    if (this.isLoggedIn && !this.categoriesLoaded) {
      this.getCategory();
      this.loadCartData();
    }

    this.authSubscription = this.auth_Service.currentUser$.subscribe(user => {
      const newLoginState = !!user;
      
      if (newLoginState !== this.isLoggedIn) {
        this.isLoggedIn = newLoginState;
        this.userName = user?.name || '';
        
        if (this.isLoggedIn && !this.categoriesLoaded) {
          this.getCategory();
          this.loadCartData();
        } else if (!this.isLoggedIn) {
          this.categoryList = [];
          this.categoriesLoaded = false;
          this.cartItems = [];
          this.cartItemCount = 0;
          this.cartTotalAmount = 0;
        }
      }
    });

    // Subscribe to cart updates
    this.orderService.subjectCart.subscribe(cartData => {
      if (cartData) {
        this.cartItems = cartData.items || [];
        this.cartItemCount = cartData.itemCount || 0;
        this.cartTotalAmount = cartData.totalAmount || 0;
      }
    });

    // Subscribe to cart item count for badge
    this.orderService.cartItemCount$.subscribe(count => {
      this.cartItemCount = count;
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  private loadCartData(): void {
    this.orderService.getCart().subscribe({
      next: (response) => {
        if (response?.success && response?.cart) {
          this.cartItems = response.cart.items || [];
          this.cartItemCount = response.cart.itemCount || 0;
          this.cartTotalAmount = response.cart.totalAmount || 0;
        }
      },
      error: (error) => {
        console.error('Error loading cart:', error);
      }
    });
  }
   
  toggleMobileMenu(): void {
    this.showMobileMenu = !this.showMobileMenu;
    if (this.showCartDropdown) this.showCartDropdown = false;
  }

  toggleMobileSearch(): void {
    this.showMobileSearch = !this.showMobileSearch;
    if (this.showCartDropdown) this.showCartDropdown = false;
  }

  toggleCartDropdown(event: Event): void {
    event.stopPropagation();
    this.showCartDropdown = !this.showCartDropdown;
    if (this.showMobileMenu) this.showMobileMenu = false;
    if (this.showMobileSearch) this.showMobileSearch = false;
  }

  closeCartDropdown(): void {
    this.showCartDropdown = false;
  }

  getUserInitials(): string {
    const userName = this.getUserName();
    if (!userName) return 'U';
    
    return userName
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  getCategory() {
    if (this.categoriesLoaded) return;
    
    this.customerService.getAllCategories().subscribe({
      next: (res: Category[]) => {
        this.categoryList = res;
        this.categoriesLoaded = true;
      },
      error: (error) => {
        console.log('Error while fetching brand Category', error);
        this.categoriesLoaded = false;
      },
    });
  }

  public logOut() {
    this.auth_Service.logout();
    this.orderService.clearCart(); // Clear cart on logout
    this.categoryList = [];
    this.categoriesLoaded = false;
    this.isLoggedIn = false;
    this.userName = '';
    this.cartItems = [];
    this.cartItemCount = 0;
    this.cartTotalAmount = 0;
    this.route.navigate(['/login']);
  }

  getUserName(): string {
    return this.auth_Service.getUserName() || '';
  }

  onSearch(e: any) {
    this.productService.searchTerm.next(e.target?.value || '')
  }

  onCategoryClick(categoryList: any): void {
    this.route.navigate(['/'], { queryParams: { category: categoryList._id, categoryName: categoryList.name } })
  }

  // Cart Methods
  updateCartQuantity(productId: number, quantity: number): void {
    if (quantity < 1) {
      this.removeFromCart(productId);
    } else {
      this.orderService.updateCartItem(productId, quantity).subscribe({
        error: (error) => console.error('Error updating quantity:', error)
      });
    }
  }

  removeFromCart(productId: number): void {
    if (confirm('Remove this item from your cart?')) {
      this.orderService.removeFromCart(productId).subscribe({
        error: (error) => console.error('Error removing item:', error)
      });
    }
  }

  // proceedToCheckout(): void {
  //   this.closeCartDropdown();
  //   this.route.navigate(['/checkout']);
  // }

  viewOrders(): void {
    this.closeCartDropdown();
        console.log('Navigating to orders...'); // Debug log

    this.route.navigate(['/orders']);
  }

  getFinalPrice(product: any): number {
    return (product.price || 0) - (product.discount || 0);
  }
}