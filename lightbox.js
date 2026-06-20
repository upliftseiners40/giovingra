/* Fullscreen carousel for collection galleries.
   Click any painting to open; arrows / swipe / keyboard to slide through. */
(function(){
  var figs = Array.prototype.slice.call(document.querySelectorAll('.gallery figure'));
  if(!figs.length) return;

  var items = figs.map(function(f){
    var img = f.querySelector('img');
    var t = f.querySelector('figcaption .t');
    var d = f.querySelector('figcaption .d');
    return { src: img ? img.src : '', t: t ? t.textContent : '', d: d ? d.textContent : '' };
  });

  // Build overlay
  var lb = document.createElement('div');
  lb.className = 'lb';
  lb.innerHTML =
    '<div class="lb-count"></div>' +
    '<button class="lb-close" aria-label="Chiudi">&times;</button>' +
    '<button class="lb-prev" aria-label="Precedente">&#8249;</button>' +
    '<img alt="">' +
    '<button class="lb-next" aria-label="Successiva">&#8250;</button>' +
    '<div class="lb-cap"><span class="t"></span><span class="d"></span></div>';
  document.body.appendChild(lb);

  var imgEl = lb.querySelector('img'),
      capT  = lb.querySelector('.lb-cap .t'),
      capD  = lb.querySelector('.lb-cap .d'),
      count = lb.querySelector('.lb-count'),
      idx = 0;

  function show(i){
    idx = (i + items.length) % items.length;
    var it = items[idx];
    imgEl.src = it.src;
    capT.textContent = it.t || '';
    capD.textContent = it.d || '';
    count.textContent = (idx+1) + ' / ' + items.length;
  }
  function open(i){ show(i); lb.classList.add('open'); document.body.style.overflow='hidden'; }
  function close(){ lb.classList.remove('open'); document.body.style.overflow=''; }
  function next(){ show(idx+1); }
  function prev(){ show(idx-1); }

  figs.forEach(function(f,i){ f.addEventListener('click', function(){ open(i); }); });
  lb.querySelector('.lb-next').addEventListener('click', function(e){ e.stopPropagation(); next(); });
  lb.querySelector('.lb-prev').addEventListener('click', function(e){ e.stopPropagation(); prev(); });
  lb.querySelector('.lb-close').addEventListener('click', function(e){ e.stopPropagation(); close(); });
  lb.addEventListener('click', function(e){ if(e.target === lb) close(); });

  document.addEventListener('keydown', function(e){
    if(!lb.classList.contains('open')) return;
    if(e.key === 'Escape') close();
    else if(e.key === 'ArrowRight') next();
    else if(e.key === 'ArrowLeft') prev();
  });

  // Touch swipe
  var x0 = null;
  lb.addEventListener('touchstart', function(e){ x0 = e.touches[0].clientX; }, {passive:true});
  lb.addEventListener('touchend', function(e){
    if(x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    if(Math.abs(dx) > 40){ dx < 0 ? next() : prev(); }
    x0 = null;
  }, {passive:true});
})();
