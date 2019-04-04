var images = ["images/bg/home2.jpg","images/bg/drama.jpg","images/bg/contact.jpg","images/bg/sponsors.jpg","images/bg/ec_back_2","images/bg/ec_back","images/bg/event.jpg","images/bg/register.jpg"];
var x1 = 0;
var percent = 0;
var i = 0;
$.preload(images);
$.preload(images,{
  eachOnLoad: function(){
    x1++;
    percent = (x1/(images.length))*100;
   	$(".count").text(percent.toFixed(0)+'%');

    if (x1 == images.length)
    {
     setTimeout(function(){
      $(".loading").fadeOut('slow');
      setTimeout(function(){
        myFunction();
      },1200)
      $(".bla").fadeOut('slow');
     },500)
    };

   	}});


  