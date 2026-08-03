(function(){
  var prog=document.getElementById('prog');
  function onScroll(){
    var max=document.documentElement.scrollHeight-window.innerHeight;
    prog.style.width=(max>0?(window.scrollY/max)*100:0)+'%';
  }
  document.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',onScroll); onScroll();

  var links=[].slice.call(document.querySelectorAll('nav a'));
  var map={}; links.forEach(function(a){ map[a.getAttribute('href').slice(1)]=a; });
  var secs=[].slice.call(document.querySelectorAll('.ch'));
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){
      var a=map[e.target.id]; if(!a) return;
      if(e.isIntersecting){ links.forEach(function(l){l.classList.remove('on');}); a.classList.add('on'); }
    });
  },{rootMargin:'-15% 0px -70% 0px',threshold:0});
  secs.forEach(function(s){io.observe(s);});

  document.getElementById('bcToggle').addEventListener('change',function(e){
    document.body.classList.toggle('hide-bc',e.target.checked);
  });
})();
