import { ActivatedRouteSnapshot, CanActivateFn } from "@angular/router";
import { AuthSignal } from "./auth.signal";

export const hasRole: CanActivateFn = (route: ActivatedRouteSnapshot) => {  
  if (!AuthSignal().isAuthenticated) {
    return false;
  }

  const requiredRoles = route.data['roles'];
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  return requiredRoles.find((role: string) => AuthSignal().user.role === role);
};