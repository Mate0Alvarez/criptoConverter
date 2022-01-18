import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import Swal from 'sweetalert2';
import * as M from 'materialize-css';

@Component({
  selector: 'app-convertidor',
  templateUrl: './convertidor.component.html',
  styleUrls: ['./convertidor.component.css']
})
export class ConvertidorComponent implements OnInit {
  cantidad = 1;
  tengo = 'Seleccione una moneda';
  quiero = 'Seleccione una moneda';
  quieroIndex: number = 0;
  tengoIndex:number = 0;
  total = 0;
  cargando: boolean = true;
  monedas: any[] =  [
    { nombre: 'USDT', src: '../../../assets/USDT.svg'},
    { nombre: 'BTC', src: '../../../assets/BTC.svg'},
    { nombre: 'ETH', src: '../../../assets/ETH.svg'},
    { nombre: 'BNB', src: '../../../assets/BNB.svg'},
    { nombre: 'ADA', src: '../../../assets/ADA.svg'},
    { nombre: 'VTHO', src: '../../../assets/VTHO.svg'},
    { nombre: 'LUNA', src: '../../../assets/LUNA.svg'},
    { nombre: 'XRP', src: '../../../assets/XRP.svg'},
  ];
  symbols: any[] = [];
  constructor(private http : HttpClient) { }

  ngOnInit(): void {
    this.obtenerSymbols();
    setTimeout(()=>{
      this.armarCarousel();
    },1000)

  }

  obtenerSymbols(){
    const binanceApi= `https://api.binance.com/api/v3/ticker/price`;
    fetch(binanceApi)
    .then(response => response.json())
    .then((results) =>{
      this.symbols = results;
    })
  }

  convertir(){
    const tengo = $('.carousel-item.active')[0].querySelector('h2')!.innerHTML;
    const quiero = $('.carousel-item.active')[1].querySelector('h2')!.innerHTML;
    this.quiero = quiero;
    this.tengo = tengo;

    if (quiero == tengo) {
      this.total = this.cantidad;
      return;
    }
    for (const result of this.symbols) {
      if (result['symbol'] == `${this.quiero}${this.tengo}`) {
        this.total = this.cantidad/result['price'];
        return;
      }
      if (result['symbol'] == `${this.tengo}${this.quiero}`) {
        this.total = this.cantidad*result['price'];
        return;
      }
    }
    for (const newSearch of this.symbols) {
      //SI NO EXISTE EL SIMBOLO, IGUALO A USDT
      let usdsQueTengo = 0;
      const symbol1 = `${this.tengo}USDT`;
      const symbol2 = `USDT${this.tengo}`;

      if (newSearch['symbol'] == symbol1) {
        usdsQueTengo = this.cantidad*newSearch['price'];
      }
      if (newSearch['symbol'] == symbol2) {
        usdsQueTengo = this.cantidad/newSearch['price'];
      }

      if (usdsQueTengo != 0) {
        for (const newSearch2 of this.symbols) {
          if (newSearch2['symbol'] == `${this.quiero}USDT`) {
            this.total = usdsQueTengo/newSearch2['price'];
            return;
          }
          if (newSearch2['symbol'] == `USDT${this.quiero}`) {
            this.total = usdsQueTengo*newSearch2['price'];
            return;
          }
        }
      }
    }
  }

  convertir2(){
    setTimeout(()=>{
      this.convertir();
    },300)
  }
  switchMonedas(){
    const quieroElements = $('.carousel')[0];
    const tengoElements = $('.carousel')[1];
    const quieroIndex = parseInt($('.carousel-item.active')[0].querySelector('input')!.value);
    const tengoIndex = parseInt($('.carousel-item.active')[1].querySelector('input')!.value);
    const quieroCarousel = M.Carousel.getInstance(quieroElements);
    const tengoCarousel = M.Carousel.getInstance(tengoElements);

    quieroCarousel.set(tengoIndex);
    tengoCarousel.set(quieroIndex);
    setTimeout(()=>{
      this.convertir();
    },100)
  }

  armarCarousel(){
    const elementosCarousel = document.querySelectorAll('.carousel');
    M.Carousel.init(elementosCarousel,{
      duration: 1,
      dist: -50,
      shift: -5,
      padding: 5,
      numVisible: 5,
      noWrap: false,
    });
    this.cargando = !this.cargando;
  }
}
