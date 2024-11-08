    import { Injectable } from '@angular/core';
    import { BehaviorSubject } from 'rxjs';

    @Injectable({
    providedIn: 'root'
    })
    export class UserListService {
    private dataUpdatedSource = new BehaviorSubject<void>(undefined);
    dataUpdated$ = this.dataUpdatedSource.asObservable();

    notifyDataUpdated(): void {
        this.dataUpdatedSource.next();
    }
    }