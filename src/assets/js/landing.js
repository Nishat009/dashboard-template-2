"use strict";

// image generator section
var slider1 = new Swiper('.slider1', {
    direction: 'horizontal',
    loop: true,
    speed: 500,
    pagination: {
      el: '.swiper-pagination',
    },
    slide:true,
    autoplay: {
        delay: 1500,
        disableOnInteraction: false,
      },
  });

// latest news section
var slider2 = new Swiper(".slider2", {
    slidesPerView: 2,
    spaceBetween: 24,
    loop: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      1024: {

          spaceBetween: 20,
      },
  },
  });

// header section
var slider3 = new Swiper(".slider3", {
    slidesPerView: 1,
    loop: true,
    autoplay: {
        delay: 2300,
        disableOnInteraction: false,
      },
  });

//sticky header in the web view
if($(window).width() >= 768) {
  $(window).bind('scroll', function (e){
    if ($(window).scrollTop() >=100 && $(window).scrollTop() <=800){
      $("#top-menu").addClass('hidden');
   } 
   else if ($(window).scrollTop() >=800) {
        $('.sign-in').removeClass('sign-in-button text-white').addClass('sign-in-button-light-mode');
        $("#top-menu").removeClass('hidden md:bg-transparent text-white bg-color-14 md:dark:bg-transparent').addClass('block nav-background-color nav-background-color-dark text-color-14 dark:text-white');
        $(".artifism-logo-black").removeClass('hidden');
        $(".artifism-logo").addClass('md:hidden');
     } 
     else {
        $('.sign-in').addClass('sign-in-button text-white').removeClass('sign-in-button-light-mode'); 
        $("#top-menu").removeClass('hidden nav-background-color nav-background-color-dark text-color-14 dark:text-white').addClass('block md:bg-transparent text-white bg-color-14 md:dark:bg-transparent');
        $(".artifism-logo").removeClass('md:hidden');
        $(".artifism-logo-black").addClass('hidden');
     }
  })
}
// mobile menu
function navToggle() {
        var btn = document.getElementById('menuBtn');
        var nav = document.getElementById('menu');
        var icon = document.getElementById('icon');
        var cross_icon = document.getElementById('cross_icon');
        btn.classList.toggle('open');
        nav.classList.toggle('flex');
        nav.classList.toggle('hidden');
        icon.classList.toggle('hidden');
        cross_icon.classList.toggle('hidden');
        cross_icon.classList.toggle('show');
    }   
// wow animation integration
new WOW().init();
// accordion border design
  $(document).ready(function() {
    $('.accordion-header').on('click', function(e) {
      $(this).parent().siblings().removeClass('faq-accordion-border');
      $(this).parent().toggleClass('faq-accordion-border');
      
    });
  });