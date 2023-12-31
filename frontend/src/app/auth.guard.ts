import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
	const api = localStorage.getItem("api");
	const tfa = localStorage.getItem("tfa");

	if (api && tfa) {
		return true;
	} else {
		this.router.navigate(['/login']);
		return false;
	}
  }

}