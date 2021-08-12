/*
 * Copyright 2010 LetterBlock LLC
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

if(!window.LB) LB = {};
LB.calculator = (function($){ return {
  init:function(spec){
    var lastValues = {};
    var allValues = {};
    var handle = function(){
      var _values = {}, key, changed = false;
      for(key in spec.inputs) {
        _values[key] = $(spec.inputs[key]).val();
        if(_values[key]!=lastValues[key]) changed = true;
        lastValues[key] = _values[key];
        // Number-ize values
        _values[key] = 1*(_values[key] || '').replace(/[, ]/g,'');
        if(isNaN(_values[key])) _values[key] = 0;
      }
      if(!changed) return true;
      // copy functions into namespace
      if(spec.functions) for(key in spec.functions) _values[key] = spec.functions[key];
      // process calculations
      var _totalCallback = spec.calculations[0];
      _values['total'] = _totalCallback['total'](_values['forms']);
      var _avgCallback = spec.calculations[1];
      _values['avg'] = _avgCallback['avg'](_values['total'], _values['forms']);
      allValues = _values;
      // do output
      var _outValue = spec.output['callback'](_values['avg']);
      $(spec.output['target']).each(function(){
        if({input:true,button:true,textarea:true}[this.tagName.toLowerCase()]) {
          this.value = _outValue;
        } else {
          this.innerHTML = _outValue;
        }
      });
      return true;
    };
    var selectors = [];
    for(var key in spec.inputs) selectors.push(spec.inputs[key]);
    $(document).delegate(selectors.join(', '),'keyup click',function(){ setTimeout(handle,10); return true; });
    $(handle);
    var pub = {
      getValues:function(){ return allValues; }
    };
    return pub;
  }
};})(jQuery);
