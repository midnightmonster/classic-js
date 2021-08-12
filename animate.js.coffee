###
Copyright 2014-2015 Joshua Paine

Permission to use, copy, modify, and/or distribute this software for any purpose
with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH 
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND 
FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, 
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS
OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF
THIS SOFTWARE.
###

raf = window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  (f)-> setTimeout(f,16)

@animate = (el,prop,dest,msec=500) ->
  ease = [0,2,9,20,36,56,80,109,142,180,222,269,320,376,436,500,564,624,680,731,778,820,858,891,920,944,964,980,991,998,1000] # easeInOutCubic
  initial = if prop.get then prop.get.call(el) else el[prop]
  start = +new Date
  stepMax = ease.length-1
  callbacks = []
  next = ->
    now = +new Date
    i = Math.round(Math.min((now-start)/msec,1)*(stepMax));
    val = initial + (dest-initial)*ease[i]/1000
    if prop.set
      prop.set.call(el,val)
    else
      el[prop] = val
    if i < stepMax
      raf(next) 
    else
      callback.call(el,el) for callback in callbacks
  raf(next)
  out = 
    then: (callback)->
      callbacks.push(callback)
      out