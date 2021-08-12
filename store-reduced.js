/*
 * Copyright 2021 LetterBlock LLC
 * https://letterblock.com/ 
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
 * An additional 'fundamental' store type. As the `derived` store is essentially
 * `map` applied lazily over time, so the `reduced` store is essentially `reduce`
 * applied lazily over time.
 */

import {readable,derived} from 'svelte/store'

export function reduced(stores, fn, initialValue){
  const initialValueFn = (typeof initialValue === 'function') ? initialValue : ()=>initialValue
  return readable(null,set=>{
    let memo = initialValueFn();
    set(memo) // This may be unnecessary
    const store = fn.length == 3 ? derived(stores, ($stores,set)=>{
      return fn(memo,$stores,v=>set(memo = v))
    },memo) : derived(stores, ($stores)=>{
      return memo = fn(memo,$stores);
    })
    return store.subscribe(set)
  })
}