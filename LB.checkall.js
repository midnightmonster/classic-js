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

/* 
 * Usage
 * -------------------
 * 
 * Call at end of document or in document.ready.
 * 
 *     <script src="jquery.js"></script>
 *     <script src="LB.checkall.js"></script>
 *     <script>
 *       LB.checkall('input#checkall','#mySet :checkbox');
 *     </script>
 * 
 */

window.LB || (LB = {});
LB.checkall = (function($){
  return function(checkAllQ,setQ){
    var set = $(setQ);
    var previous = $();
    var clickAny = function(e,data){
      if(data && data.LB_checkall) return;
      if (set.length == set.filter(':checked').length) {
        $(checkAllQ).prop('checked', true).triggerHandler('click',{LB_checkall:true});
        previous = $(); // if we checked all by checking the last individually, make previous set empty 
      }
      else {
        $(checkAllQ).prop('checked',false).triggerHandler('click',{LB_checkall:true});;
      }
    }
    var clickAll = function(e,data){
      if(data && data.LB_checkall) return;
      if(this.checked) {
        if(set.length == set.filter(':checked').length) return; // if everything's already checked, ignore this event
        previous = set.filter(':checked');
        set.prop('checked',true).each(function(){
          $(this).triggerHandler('click',{LB_checkall:true});
        });
      } else {
        if(set.filter(':checked').length==0) return; // if everything's already unchecked, ignore this event
        set.prop('checked',false);
        previous.prop('checked',true);
        set.each(function(){
          $(this).triggerHandler('click',{LB_checkall:true});
        });
      }
    };
    $(checkAllQ).click(clickAll);
    set.click(clickAny);
    clickAny();
    return {
      off:function(){
        $(checkAllQ).off('click',clickAll);
        set.off('click',clickAny);
      },
      checkAll:function(){
        $(checkAllQ).click();
      }
    };
  };
})(jQuery);