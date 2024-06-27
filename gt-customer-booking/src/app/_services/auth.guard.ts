import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CommonService } from './common.services';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private commonService: CommonService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (localStorage.getItem('currentCustomerUser')) {
            // logged in so return true
            return true;
        }else{
            return new Promise<any>((resolve, reject) => {
            this.commonService.isLogin()
            .then(res => {
                resolve(res);
              }, err => reject(err));
            
        })
    }

        // not logged in so redirect to login page with the return url
        // this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        // return false;
    }
}
