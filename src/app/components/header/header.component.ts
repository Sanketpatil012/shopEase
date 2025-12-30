import { Component, OnInit, OnDestroy , EventEmitter, Output  } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { Category } from '../../type/category';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink , FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() categorySelected  = new EventEmitter<string>()
  
  categoryList: Category[] = [];
  userName: any = '';
  private authSubscription!: Subscription;
  isLoggedIn: boolean = false;
  private categoriesLoaded: boolean = false;
  showMobileMenu: boolean = false;
  showMobileSearch: boolean = false;

  SearchTerm!:string
  constructor(
    private customerService: CustomerService,
    private route: Router,
    public auth_Service: AuthService,
    private productService:ProductService
  ) {  
    this.route.events.subscribe(() => {
    this.showMobileMenu = false;
    this.showMobileSearch = false;
  });
  }

  ngOnInit(): void {
    this.isLoggedIn = this.auth_Service.isLoggedIn();
    this.userName = this.auth_Service.getUserName();
    
    if (this.isLoggedIn && !this.categoriesLoaded) {
      this.getCategory();
    }

    this.authSubscription = this.auth_Service.currentUser$.subscribe(user => {
      const newLoginState = !!user;
      
      if (newLoginState !== this.isLoggedIn) {
        this.isLoggedIn = newLoginState;
        this.userName = user?.name || '';
        
        if (this.isLoggedIn && !this.categoriesLoaded) {
          this.getCategory();
        } else if (!this.isLoggedIn) {
          this.categoryList = [];
          this.categoriesLoaded = false;
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
   
  // Method to toggle mobile menu
toggleMobileMenu(): void {
  this.showMobileMenu = !this.showMobileMenu;
}

// Method to toggle mobile search
toggleMobileSearch(): void {
  this.showMobileSearch = !this.showMobileSearch;
}

// Method to get user initials for avatar
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
    // Prevent multiple calls if already loading
    if (this.categoriesLoaded) return;
    
    this.customerService.getAllCategories().subscribe({
      next: (res: Category[]) => {
        this.categoryList = res;
        this.categoriesLoaded = true; // Mark as loaded
      },
      error: (error) => {
        console.log('Error while fetching brand Category', error);
        this.categoriesLoaded = false; // Reset flag on error
      },
    });
  }

  public logOut() {
    this.auth_Service.logout();
    this.categoryList = [];
    this.categoriesLoaded = false; // Reset the flag
    this.isLoggedIn = false;
    this.userName = '';
    this.route.navigate(['/login']);
  }

  getUserName(): string {
    return this.auth_Service.getUserName() || '';
  }

  onSearch(e: any) {
    // this.route.navigateByUrl('products?search=' + e.target.value);
    this.productService.searchTerm.next(e.target?.value || '')
  }

  onCategoryClick(categoryList: any):void  {
      this.route.navigate(['/']  , {queryParams:{category:categoryList._id  , categoryName:categoryList.name}})
  }
}