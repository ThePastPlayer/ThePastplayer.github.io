var utf8_compatible = "é";
//slodeshow extension ste
jQuery(document).ready(function($){
	
	// slodeshow
	var currentSlideshow = -1, slideshowTimer, slideshowAutoDelay = 7000;
	
	function changeSlideShow (delai, direction){
		if (direction == "right"){
			currentSlideshow++;
			if ($(".slide[slideId="+currentSlideshow+"]").length == 0){
				currentSlideshow = 0;
			}
		}else if (direction == "left"){
			currentSlideshow--;
			if ($(".slide[slideId="+currentSlideshow+"]").length == 0){
				currentSlideshow = $(".slide").attr("slideMax") - 1;
			}
		}
		$(".slide").each(function(){
			var slide = $(this);
			if (slide.attr("slideId") == currentSlideshow){
				slide.css("z-index", 1);
				slide.animate({opacity: 1}, delai);
				$("[slideshowBulletId="+(slide.attr("slideId"))+"]").addClass("bullet_selected");
			}else{
				slide.css("z-index", 0);
				slide.animate({display:""}, 700, function(){
					slide.animate({opacity: 0}, 0);
				});
				$("[slideshowBulletId="+(slide.attr("slideId"))+"]").removeClass("bullet_selected");
			}
		});
		
	}
	if ($(".slideshow").length){
		$(".slideshow").find($(".arrow_left")).css("cursor", "pointer");
		$(".slideshow").find($(".arrow_left")).click(function(){
			if (!$(".slide").is(":animated")){
				clearInterval (slideshowTimer);
				changeSlideShow (700, "left");
			}
		});
		$(".slideshow").find($(".arrow_right")).css("cursor", "pointer");
		$(".slideshow").find($(".arrow_right")).click(function(){
			if (!$(".slide").is(":animated")){
				clearInterval (slideshowTimer);
				changeSlideShow (700, "right");
			}
		});
		changeSlideShow (0, "right");
		slideshowTimer = setInterval (function(){changeSlideShow(700, "right")}, slideshowAutoDelay);
	}
	
	// colorbox
	var cbResizeTimer;
	$(".colorboxImage").each(function(){
		if ($(this).attr("rel")){
			$(this).colorbox({
				rel: $(this).attr("rel"),
				width: "95%",
				height: "90%"
			});
		}
	});
	$(".colorboxVideo").each(function(){
		if ($(this).attr("rel")){
			$(this).colorbox({
				rel: $(this).attr("rel"),
				width: "95%",
				height: "90%",
				iframe: true
			});
		}
	});
	$(".colorboxHtml").each(function(){
		$(this).colorbox({
			width: "90%",
			height: "90%",
			maxWidth: "660px",
			maxHeight: "520px",
			html: $(this).attr("text")
		});
	});
	$(window).resize(function(){
		colorboxResizeTimer ();
	});
	function colorboxResizeTimer (){
		if ($('#cboxOverlay').is(':visible')) {
			if (cbResizeTimer) clearTimeout(cbResizeTimer);
			cbResizeTimer = setTimeout(function(){
				$.colorbox.resize({width:"95%", height:"90%"});
				var $element = $.colorbox.element();
				if (!$element.attr("class").match(/colorboxVideo/)){
					$.colorbox.reload();
				}
			}, 250);
		}
	}
				
	
});
