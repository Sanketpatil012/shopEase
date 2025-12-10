import { Component, OnInit, OnDestroy } from '@angular/core';
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
  categoryList: Category[] = [];
  userName: any = '';
  private authSubscription!: Subscription;
  isLoggedIn: boolean = false;
  private categoriesLoaded: boolean = false;
  SearchTerm!:string
  constructor(
    private customerService: CustomerService,
    private route: Router,
    public auth_Service: AuthService,
    private productService:ProductService
  ) {}

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

  searchByCategory(id: string) {
     this.SearchTerm=""
    this.route.navigate(['products'], { queryParams: { categoryId: id } });
  }
}