import { Component } from '@angular/core';
import { FingerprintAuth } from 'nativescript-fingerprint-auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  private fingerprintAuth: FingerprintAuth;

  public constructor() {
    this.fingerprintAuth = new FingerprintAuth();
  }
}
