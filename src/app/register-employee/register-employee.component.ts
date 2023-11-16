import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import * as shajs from 'sha.js';
import { ToastrModule, ToastrService } from 'ngx-toastr';

import { ServicesService } from '../services/services.service';
import { ModalServiceService } from '../services/modal-service.service';

@Component({
    selector: 'app-register-employee',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule,ToastrModule],
    providers: [ToastrService],
    templateUrl: './register-employee.component.html',
})

export class RegisterEmployeeComponent {
    registrationForm!: FormGroup;
    selectedFile: any;

    constructor(private fb: FormBuilder,private toastr: ToastrService, private router: Router, private service: ServicesService,private ModalService:ModalServiceService) {}

    ngOnInit() {
        this.registrationForm = this.fb.group ({
          EmployeeName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]],
          PasswordHash: ['', Validators.required],
          Email: ['', [Validators.required, Validators.email]],
            ProfilePicture: [''],
            isAdmin: [],
        });
    }

    errorToastr() {
      console.log(('error toaster'))
      this.toastr.error("Error", "This is error Toastr");
  }

    onSubmit() {
        if (this.registrationForm.value.isAdmin === 'false') {
          this.registrationForm.value['isAdmin'] = false;
        } 
        else {
          this.registrationForm.value['isAdmin'] = true;

        }

        this.registrationForm.value.PasswordHash = shajs('sha256').update(this.registrationForm.value.PasswordHash).digest('hex');
        this.registrationForm.value.ProfilePicture = this.selectedFile;
        console.log(this.registrationForm.value);
        this.service.setNewEmployee(this.registrationForm.value).subscribe({
          next: (data)=> {
            console.log(data);
            this.router.navigate(['/pulseSurvey/login']);
          },
          error:(e)=>{
            if(e.status === 409) {
              this.errorToastr();
              alert("User Already exists");
            }
            else {
              console.log(e);
            }
          }});
    }

    onFileSelected(event: Event) {
        const inputElement = event.target as HTMLInputElement;
        if (inputElement.files && inputElement.files.length > 0) {
          const selectedFile = inputElement.files[0];
          const fileReader = new FileReader();
          fileReader.onload = (e: ProgressEvent<FileReader>) => {
            const dataURL = e.target?.result?.toString();
            if (dataURL) {
              this.selectedFile = dataURL;
              this.ModalService.setImage(this.selectedFile);
            } else {
              console.error('Error reading file');
            }
          };
          fileReader.readAsDataURL(selectedFile);
        }
      }        
}
