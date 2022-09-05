import {
  AddEvtListener_ToSubElement,
  SetInnerHTML_OnSubElement,
  IncludeNestedHTML
} from "./dom_tools.js";

//import {} from "https://cdnjs.cloudflare.com/ajax/libs/validator/13.6.0/validator.min.js";


console.log("top of file client.js");

// define variables that reference elements on our page
const TheForm_A         = document.getElementById("Form_A");


// ---------
// Kick off
// ---------

InitDomListeners();

// ---------
// DOM Listeners
// ---------

function InitDomListeners() {
  TheForm_A.addEventListener("click", Handle_TheForm_A_Click);
  /*--------------------*/
} // InitDomListeners


// ------------------
// Pull, Push, & Exec
// ------------------

function FormExec_ViaProxy() {
  console.log(`xprox`);
  //
  let strInputText  = GetValue_OnSubElement( TheForm_A, "textarea[name='InputText']");
  let strMethod     = GetSubSelectOption(    TheForm_A, "select[name='method']");
  var strEndpoint   = GetValue_OnSubElement( TheForm_A, "input[name='endpoint']");
  //
  var oProxyBody    = null;
  //
  try{
    oProxyBody = JSON.parse(strInputText);
    oProxyBody.method = strMethod;
    oProxyBody.endpoint = strEndpoint;
  }catch (err){
    SetInnerHTML_OnSubElement( TheForm_A, "p[name='TextOutput']", err );
    return;
  }// catch
  //
  var oFetchOptions =     {
    method                : 'POST',
    body                  : JSON.stringify( oProxyBody ),
    /*--------------------*
    body                  : `{
      "strFileName":"CollectionA.json",
      "arrFormPbs":[
        {
          "strMethod":"GET",
          "strEndpoint":"/api_01/getdbstatus",
          "strInput":"{\"op\":\"GetDbStatus\"}"
        },{
          "strMethod":"POST","strEndpoint":"","strInput":"{\"op\":\"GetDbStatus\"}"
        }
      ]}`,
    /*--------------------*/
    //body                  : '{"strFileName":"CollectionB.json"}',
    headers               : {'Content-Type': 'application/json'}
  };
  // fetch /save here
  /*--------------------*/
  console.log("xprox fetch options ..." );
  console.dir(oFetchOptions);
  /*--------------------*/
  // Using POST
  fetch('/proxy', oFetchOptions)
    .then(response => response.json()) // parse the JSON from the server
    .then(inParsedList => {
      let strStatusOutput = JSON.stringify(inParsedList, null, '\t');
      /*--------------------*/
      console.log("xprox.then" );
      //console.dir(oPayload);
      /*--------------------*/
      SetInnerHTML_OnSubElement( TheForm_A, "p[name='TextOutput']", strStatusOutput );
    })
    .catch(err => {
      console.error(err);
      /*--------------------*/
      console.log(`xprox.catch ${err}` );
      //console.dir(oPayload);
      /*--------------------*/
      SetInnerHTML_OnSubElement( TheForm_A, "p[name='TextOutput']", err );
  });
}// FormExec_ViaProxy


function FormExec_Old() {
  let strPayload  = GetValue_OnSubElement( TheForm_A, "textarea[name='InputText']");
  let strMethod   = GetSubSelectOption(    TheForm_A, "select[name='method']");
  var strEndpoint = GetValue_OnSubElement( TheForm_A, "input[name='endpoint']");
  //
  fetch("/o?param1=" + strPayload + "&method=" + strMethod + "&endpoint=" + strEndpoint)
    .then(response => response.json()) // parse the JSON from the server
    .then(inParsedList => {
      let strStatusOutput = JSON.stringify(inParsedList, null, '\t');
      /*--------------------*/
      console.log( "FormExec -- miniops.then response ..." );
      console.dir(inParsedList);
      /*--------------------*/
      SetInnerHTML_OnSubElement( TheForm_A, "p[name='TextOutput']", strStatusOutput );
    // MuxStatusOutput
    })
    .catch(err => {
      /*--------------------*/
      console.error("FormExec -- miniops.catch response; ", err);
      /*--------------------*/
      console.groupCollapsed("(GP) Handle_TheForm_A_Click -- miniops.catch response ...");
      console.error(err);
      console.groupEnd();
      /*--------------------*/
      //
      SetInnerHTML_OnSubElement( TheForm_A, "p[name='TextOutput']", "Request failed." );
  });
  return;
} // FormExec_Old




// ---------
//  Form_A
// ---------

function Handle_TheForm_A_Click(inEvent) {
  // Preempt refresh of the page.
  inEvent.preventDefault();
  //
  if (inEvent.target.matches("button[name='SubmitBtn']")) {
    FormExec_ViaProxy();
  }else if(inEvent.target.matches("button[name='ValidateBtn']")){
    let oFormPb = new FormPb_Ctor(TheForm_A);
    //
    if (oFormPb.IsValid()){
      /*--------------------*
      let oSubElement = TheForm_A.querySelector("p[name='TextOutput']");
      //  
      if (!! oSubElement){
        console.log(`ValidateBtn input ok`);
        oSubElement.innerHTML = "Input is valid.";
      }else{
        console.log(`ValidateBtn cannot find output area`);
        console.dir(TheForm_A);
      }
      /*--------------------*/
      console.log(`ValidateBtn input ok`);
      SetInnerHTML_OnSubElement( TheForm_A, "p[name='TextOutput']", '{"IsInputValid":true}' );
    }else{
      console.log(`ValidateBtn input fail`);
      SetInnerHTML_OnSubElement( TheForm_A, "p[name='TextOutput']", '{"IsInputValid":false}' );
    }
  }else{
    //console.log("Handle_TheForm_A_Click ignored target …");
    //console.dir(inEvent.target);    
  }
} // Handle_TheForm_A_Click


function GetJsonAtFormA(){
  return GetValue_OnSubElement( TheForm_A, "textarea[name='InputText']");
}


function SetJsonAtFormA(in_strJson){
  SetInnerHTML_OnSubElement( TheForm_A, "textarea[name='InputText']", in_strJson );
}


// ---------
//  Form_Z
// ---------

function Handle_TheForm_Z_Click(inEvent) {
  // Preempt refresh of the page.
  inEvent.preventDefault();
  //
  if (inEvent.target.matches("button[name='AddClipSlot']")) {
    AddClipSlot_BeforeElem(TheForm_Z, null);
  }else if (inEvent.target.matches("button[name='LoadClips']")) {
    LoadClips( GetValue_OnSubElement( TheForm_Z, "input[name='CollectionName']") );
  }else if(inEvent.target.matches("button[name='SaveClips']")) {
    SaveClips( GetValue_OnSubElement( TheForm_Z, "input[name='CollectionName']") );
  }
} // Handle_TheForm_Z_Click



// ---------
// Collection Validation & Serialization
// ---------


function SaveClips(in_strFileName){
  console.log(`SaveClips`);
  //
  var oCollectionToSave = new Collection_Ctor(in_strFileName);
  //
  oCollectionToSave.strDefaultConfig = GetValue_OnSubElement( TheForm_Z, "textarea[name='ConfigText']");
  oCollectionToSave.AppendFromClipForms(TheClipForms);
  //
  var oFetchOptions =     {
    method                : 'POST',
    body                  : JSON.stringify( oCollectionToSave ),
    /*--------------------*
    body                  : `{
      "strFileName":"CollectionA.json",
      "arrFormPbs":[
        {
          "strMethod":"GET",
          "strEndpoint":"/api_01/getdbstatus",
          "strInput":"{\"op\":\"GetDbStatus\"}"
        },{
          "strMethod":"POST","strEndpoint":"","strInput":"{\"op\":\"GetDbStatus\"}"
        }
      ]}`,
    /*--------------------*/
    //body                  : '{"strFileName":"CollectionB.json"}',
    headers               : {'Content-Type': 'application/json'}
  };
  // fetch /save here
  /*--------------------*/
  console.log("SaveClips fetch options ..." );
  console.dir(oFetchOptions);
  /*--------------------*/
  // Using POST
  fetch('/save', oFetchOptions)
    .then(response => response.json()) // parse the JSON from the server
    .then(inParsedList => {
      /*--------------------*/
      console.log("SaveClips.then" );
      //console.dir(oPayload);
      /*--------------------*/
      SetInnerHTML_OnSubElement( TheForm_A, "p[name='TextOutput']", inParsedList );
    })
    .catch(err => {
      console.error(err);
      /*--------------------*/
      console.log(`SaveClips.catch ${err}` );
      //console.dir(oPayload);
      /*--------------------*/
      SetInnerHTML_OnSubElement( TheForm_A, "p[name='TextOutput']", err );
  });

}// SaveClips


// ---------
// Dom tools
// ---------

function GetValue_OnSubElement(inParent, inSubSelector){
  let oSubElement = inParent.querySelector(inSubSelector);
  //  
  if (!! oSubElement){
    return oSubElement.value;
  }
  return '';
}// GetValue_OnSubElement


function SetValue_OnSubElement(inParent, inSubSelector, inValue){
  let oSubElement = inParent.querySelector(inSubSelector);
  //  
  if (!! oSubElement){
    oSubElement.value = inValue;
  }
}// SetValue_OnSubElement


function GetInner_OnSubElement(inParent, inSubSelector){
  let oSubElement = inParent.querySelector(inSubSelector);
  //  
  if (!! oSubElement){
    return oSubElement.innerHTML;
  }
  return '';
}// GetInner_OnSubElement


function GetSubSelectOption(inParent, inSubSelectSelector){
  let oSelectElement = inParent.querySelector(inSubSelectSelector);
  //  
  if (!! oSelectElement){
    return oSelectElement.options[oSelectElement.selectedIndex].value;
  }
  return '';
}// GetSubSelectOption


function SetSubSelectOption(inParent, inSubSelectSelector, inOptionValue){
  /*--------------------*/
  SetValue_OnSubElement(inParent, inSubSelectSelector, inOptionValue);
  /*--------------------*
  let oSelectElement = inParent.querySelector(inSubSelectSelector);
  //  
  if (!! oSelectElement){
    oSelectElement.value = inOptionValue;
  }
  /*--------------------*/
}// SetSubSelectOption
