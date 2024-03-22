import { ActivatedRouteSnapshot } from "@angular/router";
import { AuthSignal } from "./auth.signal";

export const isLoggedIn = (route: ActivatedRouteSnapshot): boolean => {  
  return AuthSignal().isAuthenticated;
}