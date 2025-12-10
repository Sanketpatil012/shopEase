import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../services/category.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-category-form',
  imports: [FormsModule , MatInputModule , MatButtonModule , CommonModule],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.scss'
})
export class CategoryFormComponent implements OnInit{
    name!:string
    isEdit=false
     id!:string
    constructor ( private categoryService :CategoryService , private router : Router , private activeRoute : ActivatedRoute ){
         
    }
   
    ngOnInit() {
      
        const categoryId = this.activeRoute.snapshot.paramMap.get('id') 

        if(categoryId){
           this.isEdit=true
          this.categoryService.getCategoryById(categoryId).subscribe((res:any)=>{
             console.log(res) 
           
            this.name=res.name
           })
        }
     }
   
    add(){
      this.categoryService.addCategory(this.name).subscribe(res =>{
        console.log(res)
         this.router.navigate(["/admin/categories"])
      })   
     
    }
    update(){
      const categoryId = this.activeRoute.snapshot.paramMap.get('id') 
        this.categoryService.getUpdatedCategory(categoryId , this.name).subscribe((res:any)=>{
        })
         this.router.navigate(["admin/categories"])
      }
}
