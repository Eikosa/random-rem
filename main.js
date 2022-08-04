// ==UserScript==
// @name         Random Rem
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  it shows random rem
// @author       Eikosa
// @match        https://*.remnote.com/*
// @match        https://remnote.com/*
// @match        https://*.remnote.io/*
// @match        https://remnote.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=remnote.com
// @run-at       document-end
// @grant        GM_addStyle
// ==/UserScript==

/* globals Rem, CURRENT_KNOWLEDGE_BASE, getFocusedElementId */

GM_addStyle(`
.rotate {
  animation: rotation 3s infinite linear;
}

@keyframes rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}
`);
(function() {
    'use strict';
    let db_name;

    // DB Name
    indexedDB.databases().then(r => {
        for(let i=0; i < r.length; i++){
            let el = r[i];
            if(el.name.startsWith("remnote-")){
                db_name = el.name;
                break;
            }
        }
    });

    let dice_svg=`
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dice-5-fill" viewBox="0 0 16 16">
  <path d="M3 0a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V3a3 3 0 0 0-3-3H3zm2.5 4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm8 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zM12 13.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM5.5 12a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zM8 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
</svg>`;

    let loading_svg=`
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hourglass-split rotate" viewBox="0 0 16 16">
  <path d="M2.5 15a.5.5 0 1 1 0-1h1v-1a4.5 4.5 0 0 1 2.557-4.06c.29-.139.443-.377.443-.59v-.7c0-.213-.154-.451-.443-.59A4.5 4.5 0 0 1 3.5 3V2h-1a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 4.06c-.29.139-.443.377-.443.59v.7c0 .213.154.451.443.59A4.5 4.5 0 0 1 12.5 13v1h1a.5.5 0 0 1 0 1h-11zm2-13v1c0 .537.12 1.045.337 1.5h6.326c.216-.455.337-.963.337-1.5V2h-7zm3 6.35c0 .701-.478 1.236-1.011 1.492A3.5 3.5 0 0 0 4.5 13s.866-1.299 3-1.48V8.35zm1 0v3.17c2.134.181 3 1.48 3 1.48a3.5 3.5 0 0 0-1.989-3.158C8.978 9.586 8.5 9.052 8.5 8.351z"/>
</svg>`;

    // Your code here...,

    let load = setInterval(function() {
        if (document.querySelector("#random-rem-global") === null && document.querySelector("#document-sidebar > div.shrink-0.w-full > div.flex.items-center.p-2.gap-2 > div.flex.items-center.justify-center") !== null){
            let el = document.createElement("div")
            el.id = "random-rem-global";
            el.className = "flex items-center justify-center rn-clr-background-secondary shrink-0 w-8 h-8 rounded-md rn-clr-content-secondary cursor-pointer hover:rn-clr-background--hovered hover:font-semibold hover:text-gray-50"
            el.innerHTML = dice_svg;
            el.addEventListener ("click", function(){
                if (el.children[0].classList.contains("rotate")){
                    return
                }
                el.innerHTML = loading_svg;
                let openRequest = indexedDB.open(db_name)
                openRequest.onsuccess = () => {
                    let request =
                        openRequest.result.transaction('quanta').objectStore('quanta').index('parent').getAll()

                    request.onsuccess = ()=>{
                        let r = request.result;
                        let rnd = Math.floor(Math.random()*(r.length + 1));

                        Rem(CURRENT_KNOWLEDGE_BASE).ensureFullDBLoadedIntoReactiveStore();
                        Rem(CURRENT_KNOWLEDGE_BASE).waitUntilReactiveStoreLoadedAndFirstSync();

                        let wait = setInterval(function(){
                            try {
                                //.parent
                                Rem(CURRENT_KNOWLEDGE_BASE).findOne(r[rnd]._id).goToRem();
                                console.info(r[rnd])
                                clearInterval(wait);
                                el.innerHTML = dice_svg;
                            }
                            catch(e) {
                                console.log(e);
                            }
                        }, 1000);
                    }
                };
            } , false);
            document.querySelector("#document-sidebar > div.shrink-0.w-full > div.flex.items-center.p-2.gap-2 > div.flex.items-center.justify-center").parentElement.append(el)
        }

        if (document.querySelector("#random-rem-document") === null && document.querySelector("#DropToOpenAsDocument > div > div.flex.flex-row.items-center.pr-2") !== null){
            let el = document.createElement("div")
            el.id = "random-rem-document";
            el.innerHTML = `
	<div class="" style="grid-template-columns: 9rem auto; margin-left:16px;">
		<div class="col-span-1">
		</div>
		<div class="flex flex-row flex-wrap items-center pr-4 h-6">
			<div class="flex flex-row items-center button text-gray-40 hover:text-gray-70 text-sm opacity-0 pr-1 group-hover:opacity-100 transition-all">
				<span contenteditable="false" class="">
					<div class="flex flex-row items-center">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dice-3-fill" viewBox="0 0 16 16" style="margin-right:8px;">
						  <path d="M3 0a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V3a3 3 0 0 0-3-3H3zm2.5 4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm8 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zM8 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
						</svg>
						Random Rem
					</div>
				</span>
			</div>
		</div>
	</div>
            `;
            el.addEventListener ("click", function(){
                if (el.querySelector(".rotate") !== null){
                    return
                }

                el.querySelector("svg").outerHTML = loading_svg;
                el.querySelector("svg").style.marginRight = "8px";

                let childs = Rem(CURRENT_KNOWLEDGE_BASE).findOne(window.location.href.split("/").reverse()[0].split("-").reverse()[0]).subBlocks;


                let rnd;
                rnd = Math.floor(Math.random()*(childs.length + 1));

                let random_rem_id = childs[rnd]

                let selected = Rem(CURRENT_KNOWLEDGE_BASE).findOne(random_rem_id)


                Rem(CURRENT_KNOWLEDGE_BASE).ensureFullDBLoadedIntoReactiveStore();
                Rem(CURRENT_KNOWLEDGE_BASE).waitUntilReactiveStoreLoadedAndFirstSync();

                let wait = setInterval(function(){
                    try {
                        clearInterval(wait);
                        Rem(CURRENT_KNOWLEDGE_BASE).findOne(selected).goToRem();
                        console.info(selected)
                        el.querySelector("svg").outerHTML = dice_svg;
                        el.querySelector("svg").style.marginRight = "8px";
                    }
                    catch(e) {
                        console.log(e);
                    }
                }, 1000);
            });

            document.querySelector("#DropToOpenAsDocument > div > div.flex.flex-row.items-center.pr-2").append(el);
        }
    }, 500);
})();
