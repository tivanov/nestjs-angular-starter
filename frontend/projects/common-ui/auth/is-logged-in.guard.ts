import { ActivatedRouteSnapshot, Router } from "@angular/router";
import { AuthSignal } from "./auth.signal";
import { inject } from "@angular/core";

export const isLoggedIn = (route: ActivatedRouteSnapshot): boolean => {  
  if (!AuthSignal().isAuthenticated) {
    const router = inject(Router);
    router.navigate(['/auth']);
    return false;
  }
  return true;
}