import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonSignInComponent } from '../../../Global/CommonSignIn/CommonSignIn.component';

@Component({
  selector: 'signIn',
  templateUrl: './SignIn.component.html',
  styleUrls: ['./SignIn.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    CommonSignInComponent
  ]
})
export class SignInComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }


}

