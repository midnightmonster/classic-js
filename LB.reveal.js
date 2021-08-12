/*
 * Copyright 2012-2013 LetterBlock LLC
 * http://letterblock.com/ 
 * 
 * Permission to use, copy, modify, and/or distribute this software for any 
 * purpose with or without fee is hereby granted.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY 
 * AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, 
 * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM 
 * LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
 * OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR 
 * PERFORMANCE OF THIS SOFTWARE.
 */

if(!window.jQuery) throw new Error('LetterBlock Reveal requires jQuery, which seems to be missing.');
if(!window.LB) LB = {};
LB.reveal = function($)
{
	var settings = {
	  effect: 'slide',
	  speed: 'slow',
		radioSets: [],
		disableOnHide: []
	};
	function documentClick(e){
	  var el = e.target, rel;
	  while(el.tagName.toUpperCase()!='A' && (el = el.parentNode) && el.tagName){ }
	  if(!el || !el.tagName || !(rel = checkRel(el))) return true;
	  $(el.getAttribute('href',2)).each(function(){
	    if(this.style.display=='none'){
	      if(rel=='reveal'||rel=='toggle') { show(this); }
		  } else {
		    if(rel=="hide"||rel=="toggle"){ hide(this);}
		  }
	  });
		return false;
	}
	// Hook into all click events
	$(document).click(documentClick);
	function checkRel(el) {
	  var process, rel, rels, i;
	  process = { hide:'hide', reveal:'reveal', toggle:'toggle'};
	  if(!(rel = el.getAttribute('rel'))) return false;
	  rels = rel.split(' ');
	  for(i = rels.length; i--;) if(process[rels[i]]) return process[rels[i]];
	}
	function findLinks(el){
	  return $('a[rel=reveal], a[rel=hide], a[rel=toggle]').filter(function(){ return $(this.getAttribute('href',2)).index(el) > -1; });
	}
	function radioSets(el){
	  for(var i=settings.radioSets.length; i--;) {
	    var set = $(settings.radioSets[i]);
	    if(set.index(el) > -1) set.filter(':visible').each(function(){ hide(this); });
	  }
	}
	function show(el,callback)
	{
	  callback = callback || function(){ };
		if(!el.lb_revealing)
		{
		  el.lb_revealing = true;
			radioSets(el);
			switch(settings.effect)
			{
				case 'slide':
					$(el).slideDown(settings.speed,function(){ el.lb_revealing = false; callback(); });
					break;
				case 'fade':
					$(el).fadeIn(settings.speed,function(){ el.lb_revealing = false; callback(); });
					break;
				case 'combo':
					$(el).show(settings.speed,function(){ el.lb_revealing = false; callback(); });
					break;
				case 'none':
					$(el).show();
					el.lb_revealing = false;
					callback();
			}
			$(el).trigger('lb_reveal');
			consequences(findLinks(el),true);
		}
		return el;
	}
	function hide(el,callback)
	{
	  callback = callback || function(){ };
		if(!el.lb_hiding)
		{
		  el.lb_hiding = true;
			switch(settings.effect)
			{
				case 'slide':
					$(el).slideUp(settings.speed,function(){ el.lb_hiding = false; callback(); });
					break;
				case 'fade':
					$(el).fadeOut(settings.speed,function(){ el.lb_hiding = false; callback(); });
					break;
				case 'combo':
					$(el).hide(settings.speed,function(){ el.lb_hiding = false; callback(); });
					break;
				case 'none':
					$(el).hide();
					el.lb_hiding = false;
					callback();
			}
			$(el).trigger('lb_hide');
			consequences(findLinks(el),false);
		}
		return el;
	}
	function consequences(links,visible)
	{
	  links.each(function(){
			if(visible) $(this).removeClass('lb-hiding').addClass('lb-revealing');
			else $(this).removeClass('lb-revealing').addClass('lb-hiding');
		});
	}
	var doFocus = function(e){
		$(e.target).filter(':input').focus().end().find(':input').first().focus();
	};
	var doDisable = function(e){
		$(e.target).filter(':input').attr('disabled',1).end().find(':input').attr('disabled',1);
	};
	var doEnable = function(e){
		$(e.target).filter(':input').removeAttr('disabled').end().find(':input').removeAttr('disabled');
	};
	var pub = {
		init: function(dom){
			dom = $(typeof dom =='function' ? 'body' : dom);
			if(!dom) dom = 'body';
			var trueEffect = settings.effect;
			settings.effect = 'none';
			$('a[rel=reveal], a[rel=hide]',dom).each(function(){  
			  var link = this;
				$(link.getAttribute('href',2)).each(function(){
				  if(link.rel.toLowerCase()=='reveal' && !/(^|\W)viewdefault(\W|$)/i.test(this.className)) hide(this);
				  else show(this);
			  });
			});
			settings.effect = trueEffect;
			pub.revealHash();
		},
		revealHash: function(){
		  var hash, target;
			if(hash = location.hash.substr(1)) {
			  if(target = document.getElementById(hash)) show(target);
		  }
		},
		radioSet: function(q){
		  for(var i = arguments.length; i--;) settings.radioSets.push(arguments[i]);
		},
		disableOnHide: function(defaultTrue){
			var onOrOff = defaultTrue===false ? 'off' : 'on';
			$(document)[onOrOff]('lb_reveal',doEnable)[onOrOff]('lb_hide',doDisable);
		},
		focusOnReveal: function(defaultTrue){
			var onOrOff = defaultTrue===false ? 'off' : 'on';
			$(document)[onOrOff]('lb_reveal',doFocus);
		},
		effect: function(f){
			switch(f){
				case 'slide': case 'fade': case 'none': case 'combo':
					settings.effect = f;
					return pub;
			}
			alert('LetterBlock Reveal effect set to invalid value \''+f+'\'.');
			return pub;
		},
		speed: function(s){
			settings.speed = s;
			return pub;
		},
		hide: function(q,callback){ return $(q).each(function(){ hide(this,callback); }); },
		show: function(q,callback){ return $(q).each(function(){ show(this,callback); }); },
		findLinks:findLinks
	};
	return pub;
}(jQuery);

// LB.reveal.tabPanels
(function($){
  var pub = LB.reveal;
  pub.tabPanels = function(q){
    pub.radioSet.apply(pub,arguments);
    for(var i=0; i<arguments.length; i++){
      $(document).on('lb_reveal',arguments[i],function(e){
        pub.findLinks(e.target).each(function(){
          var last, parent;
          last = parent = this;
          while((parent = parent.parentNode).tagName && !(/tabs/.test(parent.className))) last = parent;
          if(!parent.tagName) return;
          $(parent).children().removeClass('active');
          last.className+=' active'; 
        });
      });
    }
  };
})(jQuery);