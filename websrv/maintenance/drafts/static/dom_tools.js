console.log("top of file dom_tools.js");

// ---------
// Primary exports:
// ---------

// AddEvtListener_ToSubElement, SetInnerHTML_OnSubElement, IncludeNestedHTML


// ---------
// DOM tools
// ---------

export function AddEvtListener_ToSubElement(inParent, inSubSelector, inEventType, inListenerFunc){
  if (! inParent) return;
  
  let oSubElement = inParent.querySelector(inSubSelector);
  //  
  if (!! oSubElement){
    oSubElement.addEventListener(inEventType, inListenerFunc);
  }  
}// AddEvtListener_ToSubElement


export function SetInnerHTML_OnSubElement(inParent, inSubSelector, inStr){
  let oSubElement = inParent.querySelector(inSubSelector);
  //  
  if (!! oSubElement){
    oSubElement.innerHTML = inStr;
  }  
}// SetInnerHTML_OnSubElement


export function IncludeNestedHTML() {
  var z, i, elmnt, file, xhttp;
  /* Loop through a collection of all HTML elements: */
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("include-nested-html");
    if (file) {
      /* Make an HTTP request using the attribute value as the file name: */
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
          if (this.status == 200) {elmnt.innerHTML = this.responseText;}
          if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
          /* Remove the attribute, and call this function once more: */
          elmnt.removeAttribute("include-nested-html");
          IncludeNestedHTML();
        }
      }
      xhttp.open("GET", file, true);
      xhttp.send();
      /* Exit the function: */
      return;
    }
  }
} // IncludeNestedHTML