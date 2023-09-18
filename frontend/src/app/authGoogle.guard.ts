import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable()
export class AuthGoogleGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
	const jwt = localStorage.getItem("jwt");

	if (jwt) {
		return true;
	} else {
		this.router.navigate(['/login']);
		return false;
	}
  }
}