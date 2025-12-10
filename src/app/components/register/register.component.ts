import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import Swal from "sweetalert2"

import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RouterLink  } from "@angular/router";
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  registerForm: any;
  showPassword: boolean = false;
  constructor(
    private formbuilder: FormBuilder,
    private authService: AuthService,
    private route :Router 
  ) {
    this.registerForm = this.formbuilder.group({
      name: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required,Validators.email]],
    });
  }

  ngOnInit(): void {}
  registerUser() {
    console.log('Form validity:', this.registerForm.valid);
    console.log('Form values:', this.registerForm.value);

    if (this.registerForm.valid) {
      const formvalue = this.registerForm.value;
      console.log('Sending payload:', formvalue);

      this.authService.createregisterUser(formvalue).subscribe({
        next: (res: any) => {
          console.log('Registration response:', res);
            Swal.fire({
                   text:"User Login Successfully", 
                   icon:"success",
                   title:"Success!",
                   confirmButtonText:"OK",
                  })
           this.route.navigate(["/login"])
        },
        error: (error) => {
          console.error('Registration error:', error);
          alert(
            'Error While Registering: ' +
              (error.error?.message || error.message)
          );
        },
      });
    } else {
      console.log('Form is invalid');
      this.registerForm.markAllAsTouched();
    }
  }

  togglePasswordVisibility(){
     this.showPassword = !this.showPassword
  }
}
