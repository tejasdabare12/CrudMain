import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { UserListService } from '../user-Service';
import { MatDialog } from '@angular/material/dialog';
import { NewUserFormComponent } from '../new-user-form/new-user-form.component';
import { ConfirmDeleteDialogComponent } from '../confirm-delete-dialog/confirm-delete-dialog.component';

export interface PeriodicElement {
  name: string;
  email: string;
  position: string;
}

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['name', 'email','position','actions'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  resultsLength = 0;
  private dataUpdatedSubscription: Subscription = new Subscription;

  constructor(private userListService: UserListService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadData();
    this.dataUpdatedSubscription = this.userListService.dataUpdated$.subscribe(() => {
      this.loadData();
    });
  }
 
  ngOnDestroy(): void {
    if (this.dataUpdatedSubscription) {
      this.dataUpdatedSubscription.unsubscribe();
    }
  }

  loadData(): void {
    const storedData = JSON.parse(localStorage.getItem('users') || '[]');
    this.dataSource.data = storedData; 
    this.resultsLength = storedData.length;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editUser(user: PeriodicElement): void {
    const dialogRef = this.dialog.open(NewUserFormComponent, {
      data: { user }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadData();
    });
  }

  confirmDeleteUser(user: PeriodicElement): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      data: { user }
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.deleteUser(user);
      }
    });
  }
  deleteUser(user: PeriodicElement): void {
    const storedData = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedData = storedData.filter((item: PeriodicElement) => item.email !== user.email);
    localStorage.setItem('users', JSON.stringify(updatedData));
    this.loadData();
  }
}