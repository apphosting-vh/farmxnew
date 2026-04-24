
    window.addEventListener('load',()=>{setTimeout(()=>{const l=document.getElementById('loading');if(l)l.style.display='none';},500);});
    if('serviceWorker'in navigator){
      window.addEventListener('load',()=>{
        navigator.serviceWorker.register('https://apphosting-vh.github.io/farmxnew/sw.js')
          .then(reg=>{
            console.log('SW registered');
            window.__swReg = reg; // expose so React can call reg.waiting.postMessage

            // If the SW updates while the page is open, fire a custom event
            reg.addEventListener('updatefound',()=>{
              const sw = reg.installing;
              if(!sw) return;
              sw.addEventListener('statechange',()=>{
                if(sw.state==='installed' && navigator.serviceWorker.controller){
                  window.dispatchEvent(new CustomEvent('swUpdateReady'));
                }
              });
            });

            // Periodic re-check: ask the browser to look for a new SW every 30 min
            setInterval(()=>reg.update().catch(()=>{}), 30*60*1000);
          })
          .catch(e=>console.log('SW failed:',e));
      });
    }
  