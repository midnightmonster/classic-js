###
WiseVirgins: Efficient watching and waiting
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

class @WV
  constructor:(scrollElement=window) ->
    @_state = {}
    if scrollElement
      scrollElement.addEventListener('scroll',@_monitor)
      scrollElement.addEventListener('touchmove',@_monitor)
    window.addEventListener('resize',@_monitor)
  watch:(name,fn) ->
    [fn,name] = [name,''+Math.random()] unless fn
    @_state[name] = {fn:fn,waits:[]}
    @_chain(name)
  waitFor:(name,val,handler) ->
    @_state[name].waits.push(
      threshold:val
      fn:handler
      last:null
    )
    @_chain(name)
  onChange:(name,handler) ->
    @_state[name].waits.push(
      all:true
      fn:handler
      last:null
    )
    @_chain(name)
  go: -> @_monitor()
  _chain:(name)->
    waitFor:(val,handler)=>@waitFor(name,val,handler)
    onChange:(handler)=>@onChange(name,handler)
    watch:(name,fn)=>@watch(name,fn)
    go:=>@go()
  _monitor:=>
    for name, watch of @_state
      res = watch.fn()
      for wait in watch.waits
        if wait.all
          if wait.last != res
            wait.fn(res,wait.last)
            wait.last = res
        else
          gte = res >= wait.threshold
          if gte != wait.last
            wait.last = gte
            wait.fn(gte,res)