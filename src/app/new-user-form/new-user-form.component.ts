    import { Component, Inject, OnInit } from '@angular/core';
    import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
    import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
    import { UserListComponent } from '../user-list/user-list.component';
    import { UserListService } from '../user-Service';

    @Component({
      selector: 'app-new-user-form',
      templateUrl: './new-user-form.component.html',
      styleUrls: ['./new-user-form.component.scss']
    })
    export class NewUserFormComponent implements OnInit {
      userForm: FormGroup;
      isEditMode = false;
      constructor(private fb: FormBuilder, private userListService: UserListService, @Inject(MAT_DIALOG_DATA) public data: any) {
        this.userForm = this.fb.group({
          name: ['', Validators.required],
          email: ['', [Validators.required, Validators.email]],
          position: ['', Validators.required]
        });
      }

      ngOnInit(): void {
        if (this.data && this.data.user) {
          this.isEditMode = true;
          this.userForm.patchValue(this.data.user);
        }
      }
      submit(): void {
        if (this.userForm.valid) {
          const formData = this.userForm.value;
          let existingData = JSON.parse(localStorage.getItem('users') || '[]');
    
          if (this.isEditMode) {
            existingData = existingData.map((item: any) =>
              item.email === this.data.user.email ? formData : item
            );
          } else {
            existingData.push(formData);
          }
    
          localStorage.setItem('users', JSON.stringify(existingData));
          this.userListService.notifyDataUpdated();
        }
      }
    }
