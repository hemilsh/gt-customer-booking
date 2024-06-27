import { Component, OnInit, Injectable } from '@angular/core';
import { Router, NavigationStart, RouteConfigLoadStart, RouteConfigLoadEnd, NavigationEnd, NavigationCancel, ActivatedRoute } from '@angular/router';
import { AppUrlConstants } from './appconfig';
import { filter } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import * as $ from 'jquery';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
@Injectable()
export class AppComponent implements OnInit {
  showContent = false;
  isHeaderfooterShow = true;
  isPrivateRoute = false;
  isHeaderClassShowRoute = false;

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
    )
      .subscribe(() => {

        var rt = this.getChild(this.activatedRoute)

        rt.data.subscribe(data => {
          this.titleService.setTitle(data.title)
        })
      })

    this.router.events.subscribe(event => {

      if (event instanceof NavigationEnd || event instanceof NavigationCancel) {

        if (event.url == '/') {
          this.isHeaderClassShowRoute = false;
        } else {
          this.isHeaderClassShowRoute = true;
        }
        if(this.router.url == "/"){
          this.isHeaderClassShowRoute = false;
        }
        if(this.router.url == "/"+AppUrlConstants.changePasswordModule || this.router.url == "/"+AppUrlConstants.otpModule || event.url.indexOf("/reset-password/") > -1){
          this.isHeaderfooterShow = false;
        }
        if(this.router.url == "/"){
          this.isHeaderfooterShow = true;
        }

        this.showContent = true;

      }
    });
  }

  getChild(activatedRoute: ActivatedRoute) {
    if (activatedRoute.firstChild) {
      return this.getChild(activatedRoute.firstChild);
    } else {
      return activatedRoute;
    }

  }
  autoFocusOnErrorField(formId) {
    console.log($("#" + formId + " .form-invalid"))
    if($("#" + formId + " .form-invalid").length != 0){
      $('.focusRed').removeClass('focusRed');
      $($("#" + formId + " .form-invalid")[0]).addClass("focusRed");
      if($("#" + formId + " .form-invalid")[0].localName == 'ng-select'){
        $('div,html').animate({
          scrollTop: $($("#" + formId + " .form-invalid")[0]).offset().top - 135
        }, 10, function () {
        });
      }else{
        $("#" + formId + " .form-invalid").first().focus();
      }
    }
    if ($("#" + formId + " .ng-invalid").length != 0) {
      // console.log($("#" + formId + " .ng-invalid").first()[0].localName);
      if ($("#" + formId + " .ng-invalid").first()[0].localName != 'div') {
        console.log($("#" + formId + " .form-invalid"))
        $("#" + formId + " .ng-invalid").first().focus();
        // $('div,html').animate({
        //   scrollTop: $($("#" + formId + " .ng-invalid").first()).offset().top - 110
        // }, 500, function () {
        // });
        $($("#" + formId + " .ng-invalid")[0]).addClass("focusRed");
      } else {
        // console.log($("#" + formId + " .ng-invalid"));
        for (var i = 0; i < $("#" + formId + " .ng-invalid").length; i++) {
          if ($("#" + formId + " .ng-invalid")[i].localName == 'div') {

          } else {
            console.log($("#" + formId + " .ng-invalid"))
            $("#" + formId + " .ng-invalid")[1].focus();
            $('div,html').animate({
              scrollTop: $($("#" + formId + " .ng-invalid")[1]).offset().top - 110
            }, 10, function () {
            });
            $('.focusRed').removeClass('focusRed');
            $($("#" + formId + " .ng-invalid")[1]).addClass("focusRed");
            return;
          }
        }
      }
    }
  }
  title = 'app';
  constructor(private router: Router, private activatedRoute: ActivatedRoute,
    private titleService: Title) {

  }
}
