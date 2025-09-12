import { Component, Injectable, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApplicationUser, LoginService } from '../login/login.service';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { RouteValidator } from '../common/route-validator';
import { BuscarContestacionesService } from '../monitor/monitor.component.service';
import { ToastrService } from 'ngx-toastr';
import { format } from 'date-fns';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  private subscription!: Subscription;
  username: string;
  password: string;
  loginError: boolean;
  busy: boolean;
  isLogin!: boolean;
  rfc: string = '';
  rfcUser: string = '';

  declare Sum: any;

  // user!: ApplicationUser;
  // empId!: number;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    public http: HttpClient,
    public loginService: LoginService,
    private buscarContestacionesService: BuscarContestacionesService,
    private toastr: ToastrService
  ) {
    this.username = 'user_suc1';
    this.password = '12345678';
    this.busy = false;
    this.loginError = undefined!;
    this.loginService.clearAll();

    //this.user=JSON.parse(localStorage.getItem("user")!);
    //this.empId = this.user.usrEmpId;
  }

  ngOnInit(): void {
    this.subscription = this.loginService.user$.subscribe((usr) => {
      this.isLogin = usr != undefined;
      //if (this.route.snapshot.url[0].path === 'login') {
      //}
    });
    console.log('RFC DESPUES');
    console.log(this.rfc);
    //console.log('Emprendedor id', this.user);
  }
  onSubmit() {
    console.log('RFC:', this.rfcUser);

    ////borrar para la demo
    this.router.navigate(['emprendedor/registro']);


    return; 
 
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  isValidRfc(rfc: string): boolean {
    const rfcRegex: RegExp = /^[A-Z&]{3,4}\d{6}(?:[A-Z\d]{3})?$/i;
    return rfcRegex.test(rfc);
  }

  login() {
    if (!this.username || !this.password) {
      return;
    }
    this.busy = true; 
    this.loginService
      .login(this.username, this.password)
      .pipe(finalize(() => (this.busy = false)))
      .subscribe(
        () => {
          this.router.navigate(['/menu-perfil']);
          return; 
          RouteValidator.isNextStep = true;
          let user: ApplicationUser = JSON.parse(localStorage.getItem("user")!)
          if (user && user.empId==0) this.router.navigate(['/estadistica']);
          else this.router.navigate(['/respuesta-a3']);
        },
        () => {
          this.loginError = true;
        }
      );
  }
}
