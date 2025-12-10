
import { BrandService } from './../../../services/brand.service';


import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';


import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-brand-form',
  imports: [FormsModule , MatInputModule , MatButtonModule , CommonModule],
  templateUrl: './brand-form.component.html',
  styleUrl: './brand-form.component.scss'
})
export class BrandFormComponent implements OnInit {
  isEdit = false;
  name!: string;

  constructor(
    private brandService: BrandService,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const categoryId = this.activeRoute.snapshot.paramMap.get("id");

    if (categoryId) {
      this.isEdit = true;
      this.brandService.getBrandById(categoryId).subscribe((res: any) => {
        this.name = res.name;
      });
    }
  }

  add() {
    if (!this.name?.trim()) {
      console.error("Name is required");
      return;
    }

    this.brandService.addBrands(this.name).subscribe(() => {
      this.router.navigate(["admin/brands"]);
    });
  }

  update() {
    const categoryId = this.activeRoute.snapshot.paramMap.get("id");

    if (!categoryId) {
      console.error("No category ID found in route.");
      return;
    }

    if (!this.name?.trim()) {
      console.error("Name is required");
      return;
    }

    this.brandService.updateBrands(categoryId, this.name).subscribe({
      next: () => this.router.navigate(["admin/brands"]),
      error: (error) => console.error("Update failed", error)
    });
  }
   
  
   

}

