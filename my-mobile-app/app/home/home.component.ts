import { Component } from '@angular/core';
import { FingerprintAuth, BiometricIDAvailableResult } from 'nativescript-fingerprint-auth';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  moduleId: module.id,
})
export class HomeComponent {
  title = 'First TNS app';
  private counter = 42;

  public status: string = 'Tap a button below..';
  private static CONFIGURED_PASSWORD = 'MyPassword';

  private fingerprintAuth: FingerprintAuth;

  constructor() {
    this.fingerprintAuth = new FingerprintAuth();
  }

  public getMessage() {
    return this.counter > 0 ? `${this.counter} taps left` : 'Yeah! Hoorraaay! You unlocked the NativeScript clicker achievement!';
  }

  public onTap() {
    this.counter--;
  }

  public doCheckAvailable(): void {
    this.fingerprintAuth
      .available()
      .then((result: BiometricIDAvailableResult) => {
        console.log('doCheckAvailable result: ' + JSON.stringify(result));
        this.status = 'Biometric ID available? - ' + (result.any ? (result.face ? 'Face' : 'Touch') : 'NO');
      })
      .catch(err => {
        console.log('doCheckAvailable error: ' + err);
        this.status = 'Error: ' + err;
      });
  }

  public doCheckFingerprintsChanged(): void {
    this.fingerprintAuth.didFingerprintDatabaseChange().then((changed: boolean) => {
      this.status = 'Biometric ID changed? - ' + (changed ? 'YES' : 'NO');
    });
  }

  public doVerifyFingerprint(): void {
    this.fingerprintAuth
      .verifyFingerprint({
        message: 'Scan yer finger', // optional
        authenticationValidityDuration: 10, // Android
      })
      .then(() => {
        alert({
          title: 'Biometric ID / passcode OK',
          okButtonText: 'Sweet',
        });
      })
      .catch(err => {
        alert({
          title: 'Biometric ID NOT OK / canceled',
          message: JSON.stringify(err),
          okButtonText: 'Mmkay',
        });
      });
  }

  public doVerifyFingerprintWithCustomUI(): void {
    this.fingerprintAuth
      .verifyFingerprint({
        message: 'Scan yer finger', // optional
        useCustomAndroidUI: true, // Android
      })
      .then((enteredPassword?: string) => {
        if (enteredPassword === undefined) {
          this.status = 'Biometric ID OK';
        } else {
          // compare enteredPassword to the one the user previously configured for your app (which is not the users system password!)
          if (enteredPassword === HomeComponent.CONFIGURED_PASSWORD) {
            this.status = 'Biometric ID OK, using password';
          } else {
            this.status = `Wrong password. Try '${HomeComponent.CONFIGURED_PASSWORD}' 😉`;
          }
        }
      })
      .catch(err => (this.status = `Biometric ID NOT OK: " + ${JSON.stringify(err)}`));
  }

  public doVerifyFingerprintWithCustomFallback(): void {
    this.fingerprintAuth
      .verifyFingerprintWithCustomFallback({
        message: 'Scan yer finger', // optional
        fallbackMessage: 'Enter PIN', // optional
        authenticationValidityDuration: 10, // Android
      })
      .then(() => {
        this.status = 'Biometric ID OK';
        alert({
          title: 'Biometric ID OK',
          okButtonText: 'Sweet',
        });
      })
      .catch(error => {
        this.status = 'Biometric ID NOT OK: ' + JSON.stringify(error);
        alert({
          title: 'Biometric ID NOT OK',
          message: error.code === -3 ? 'Show custom fallback' : error.message,
          okButtonText: 'Mmkay',
        });
      });
  }
}
