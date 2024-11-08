import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewUserFormComponent } from './new-user-form/new-user-form.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private dialog: MatDialog) {}
  title = 'userManagementSystem';

  readonly newTaskDialog = inject(MatDialog);
  readonly deleteDialog = inject(MatDialog);
  userData:any
  openDialog(): void {
    const dialogRef = this.dialog.open(NewUserFormComponent, {
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed');
    });
  }
 
}
