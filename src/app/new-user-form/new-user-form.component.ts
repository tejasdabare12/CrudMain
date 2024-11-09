import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserListService } from '../user-Service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-new-user-form',
  templateUrl: './new-user-form.component.html',
  styleUrls: ['./new-user-form.component.scss']
})
export class NewUserFormComponent implements OnInit {
  userForm: FormGroup;
  isEditMode = false;
  originalEmail: string | null = null;
  originalName: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userListService: UserListService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, this.checkDuplicateName.bind(this)]],
      email: ['', [Validators.required, Validators.email, this.checkDuplicateEmail.bind(this)]],
      position: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.data && this.data.user) {
      this.isEditMode = true;
      this.originalName = this.data.user.name;
      this.originalEmail = this.data.user.email;
      this.userForm.patchValue(this.data.user);
    }
  }

  // Custom validator to check for duplicate usernames
  checkDuplicateName(control: FormControl): { [key: string]: boolean } | null {
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const isDuplicate = existingUsers.some((user: any) => 
      user.name === control.value && user.name !== this.originalName
    );
    return isDuplicate ? { 'duplicateName': true } : null;
  }

  // Custom validator to check for duplicate emails
  checkDuplicateEmail(control: FormControl): { [key: string]: boolean } | null {
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const isDuplicate = existingUsers.some((user: any) => 
      user.email === control.value && user.email !== this.originalEmail
    );
    return isDuplicate ? { 'duplicateEmail': true } : null;
  }

  submit(): void {
    if (this.userForm.valid) {
      const formData = this.userForm.value;
      let existingData = JSON.parse(localStorage.getItem('users') || '[]');

      if (this.isEditMode) {
        existingData = existingData.map((item: any) =>
          item.email === this.originalEmail ? formData : item
        );
      } else {
        existingData.push(formData);
      }

      localStorage.setItem('users', JSON.stringify(existingData));
      this.userListService.notifyDataUpdated();
      this.snackBar.open('User data saved successfully', 'Close', {
        duration: 3000
      });
    } else {
      if (this.userForm.get('name')?.hasError('duplicateName')) {
        this.snackBar.open('The username is already taken.', 'Close', {
          duration: 3000
        });
      }
      if (this.userForm.get('email')?.hasError('duplicateEmail')) {
        this.snackBar.open('The email is already taken.', 'Close', {
          duration: 3000
        });
      }
      if (this.userForm.get('email')?.hasError('email')) {
        this.snackBar.open('Invalid email address.', 'Close', {
          duration: 3000
        });
      }
    }
  }
}
