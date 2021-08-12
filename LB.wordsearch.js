/*
 * Copyright 2012-2021 LetterBlock LLC
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

// Sample usage:
// $(document).ready(function(){
//   var ws = new LB.wordsearch('#doc span');
//   LB.wordsearch.box('#search',ws);
// }

window.LB || (window.LB = {});
LB.wordsearch = (function($){ return function(hayQuery){
  var haystack;
  if(hayQuery) haystack = $(hayQuery);
  var stopWords = ["i", "a", "about", "an", "are", "as", "at", "be", "by", "for", "from", "how", "in", "is", "it", "of", "on", "or", "that", "the", "this", "to", "was", "what", "when", "where", "who", "will", "with"];
  var searchActive = false;
  var textContent = function(e){
    if(typeof e.textContent != "undefined") textContent = function(e){ return e.textContent; };
    else if(typeof e.innerText != "undefined") textContent = function(e){ return e.innerText; };
    else textContent = function(e){
      var str = '';
      var cn = e.childNodes;
      for (var i = 0; i < cn.length; i++) {
        if (cn[i].nodeType == 3) str += cn[i].nodeValue;
        if (cn[i].nodeType == 1) str += pub.innerText(cn[i]);
      }
      return str;
    }
    return textContent(e);
  };
  var tokenizeAndRemoveStopWords = function(str){
    var ar = str.split(/[^\w'\-]+/),
        ret = [], x;
    for(x=0; x<ar.length; x++){ if(ar[x] && $.inArray(ar[x],stopWords)==-1){ ret.push(ar[x]); } }
    return ret;
  }
  var _pub = {
    init:function(hayQuery){
      haystack = $(hayQuery);
      return _pub;
    },
    search:function(str){
      if(str===searchActive) return;
      if(searchActive) _pub.clear();
      words = tokenizeAndRemoveStopWords(str);
      if (words.length) {
        var str = words.join('|');
        var colors = {};
        for(var x=0; x<words.length; x++) colors[words[x]] = x%5;
        var hits = 0;
        var rx = new RegExp('\\b(' + str + ')\\b', 'gi');
        haystack.each(function(){
          var hayHits = this.innerHTML.match(rx);
          if (hayHits) {
            hits += hayHits.length;
            this._oldInnerHTML = this.innerHTML;
            this.innerHTML = this.innerHTML.replace(rx, function(str, w){
              return '<em class="hit hit' + colors[w.toLowerCase()] + '">' + w + '</em>';
            });
          }
        });
      }
      hits && (searchActive = str);
      return hits;
    },
    clear:function(){
      haystack.each(function(){
        if (this._oldInnerHTML) {
          this.innerHTML = this._oldInnerHTML;
          this._oldInnerHTML = null;
        }
      });
    }
  };
  return _pub;
}; })(jQuery)
LB.wordsearch.jQuery = jQuery;
LB.wordsearch.box = function(boxQuery,ws,callback){
  function runSearch(){
    var hits = ws.search(this.value);
    if(callback) callback(hits);
    return false;
  }
  $(boxQuery).keypress(function(e){ if (e.which == 13) { // return searches
    return runSearch.apply(this);
  } }).each(function(){ // submit searches
    var box = this;
    if(box.form) $(box.form).submit(function(){ return runSearch.apply(box); });
  });
  return {
    search: function(str){
      $(boxQuery).val(str).each(runSearch);
    }
  }
};
LB.wordsearch.getJumpCallback = function(containerQ,stickyNavHeight){
  var $ = LB.wordsearch.jQuery;
  var container = $(containerQ||'body');
  var $doc = $('body,html');
  return function(hitCount){
    var hits = $('em.hit',container);
    if(hits.length) {
      $doc.scrollTop(hits.offset().top-(stickyNavHeight||0));
    }
  }
};
LB.wordsearch.getNextPrevCallback = function(containerQ,nextQ,prevQ){
  var $ = LB.wordsearch.jQuery;
  var container, current, total, hits;
  var $doc = $('body,html');
  var scrollTo = function(index){
    $doc.scrollTop($(hits.get(index)).offset().top);
  };
  var clickNext = function(){
    if(++current < total) scrollTo(current);
    disableButtons();
  };
  var clickPrev = function(){
    if(--current >= 0) scrollTo(current);
    disableButtons();
  };
  var disableButtons = function(){
    if(current+1 < total) next.removeAttr('disabled');
    else next.attr('disabled','disabled');
    if(current > 0) prev.removeAttr('disabled');
    else prev.attr('disabled','disabled'); 
  };
  container = $(containerQ||'body');
  next = $(nextQ).click(clickNext).dblclick(clickNext);  // IE interprets second of two fast clicks as dblclick, doesn't fire click event second time
  prev = $(prevQ).click(clickPrev).dblclick(clickPrev);
  return function(hitCount){
    current = -1;
    total = hitCount;
    hits = $('em.hit',container);
    if(hits.length != total) throw new Exception('Actual search hits doesn\'t match hit count.');
    disableButtons();
    if(hits.length) clickNext();
  }
};