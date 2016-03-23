var previousInputs, previousInputCount, inputHolderwidth, listHolderwidth, inputHolderMargin;

$(document).ready(function(){
	previousInputs = new Array();
	previousInputCount = 0;
	inputHolderwidth = $(".inputHolder").css("width");
	listHolderwidth = parseInt(inputHolderwidth) - 0;
	inputHolderMargin = $(".inputHolder").css("margin");

	/*styling autofill input field*/
	$("#autofillInput").css({
		"width": "75%",
	    "height": "98%",
	    "padding": "0% 5%",
	    "font-size": "16px",
	    "z-index": "99",
	    "float":"left",
	    "border":"none",
	    "outline-offset": "0px",
        "outline": "-webkit-focus-ring-color 0"
	});

	/*styling clear button*/
    $("#textClear").css({
		"width": "15%",
	    "height": "100%",
	    "float":"left",
	    "cursor":"pointer",
	    "border":"none"
	});

	/*styling list container*/
	$(".listHolder").css({
		"width": listHolderwidth+"px",
	    "max-height": "190px",
	    "overflow-y":"auto",
	    "margin":inputHolderMargin,
	    "height": "auto",
	});   
});

/*list matched datas from saved list*/
function listMatchedSavedDatas(inputField){
	var dataList = "";
	var currentElement = "";
	var listElement = "";
	var listHolderElement = document.getElementById("listHolderDiv");
	var enteredValue = inputField.value;
	/*remove previous listed options*/
	if($(".namesOptionList").length){
			$(".namesOptionList").remove();
	}
	
	if(enteredValue.length >= 2){ /*listing saved datas when entering atleast 2 characters*/
			dataList = getExternalData(); 
			console.log("dataList: "+JSON.stringify(dataList));
			console.log("enteredValue: "+enteredValue);
	        if(dataList.names != null){
	        	for (var i = 0; i < dataList.names.length; i++) {
	        		currentElement = dataList.names[i];
	        		console.log("currentElement: "+currentElement);
	        		if(currentElement.indexOf(enteredValue) > -1 || currentElement.toLowerCase().indexOf(enteredValue) > -1 || currentElement.toUpperCase().indexOf(enteredValue) > -1){        		  
	        			 console.log("list: "+currentElement);
	        			 listElement = document.createElement("li");
	        			 listHolderElement.appendChild(listElement);
	        			 listElement.setAttribute("class", "namesOptionList");
	        			 listElement.appendChild(document.createTextNode(currentElement));
	        		}
	        	}
	        }

	}
	else{ /*listing previous inputs before entering 2 characters*/
		listPreviousInputs(inputField);
	}
        
    /*selecting text from options*/
	$(".namesOptionList").click(function(){	
		selectTextFromList(this);
	});
}


/*
*get saved data as json object
*customise this function according to the nature of your stored data
*return data should be in the form of a json object
*/
function getExternalData(){
	var json = null;
	$.ajax({
	    'async': false,
	    'global': false,
	    'url': "json/dataList.json",
	    'dataType': "json",
	    'success': function (data) {
	        json = data;
	    }
	});
	return json;
}


/*
*list previuous inputs
*/
function listPreviousInputs(inputField){
	var listElement = "";
	var previousSelection = "";
	var listHolderElement = document.getElementById("listHolderDiv");
	var enteredValue = inputField.value;
	if(enteredValue.length >= 2){
		listMatchedSavedDatas(inputField);
	}
	else{
		if(previousInputs.length > 0){
		    for(i = previousInputs.length; i > 0; i--){		  	 
			  	previousSelection = previousInputs[i-1];			  	
				if($("#autofillInput").val() != previousSelection){
	                var listItems = $("#listHolderDiv li");
					listItems.each(function(idx, li) {
					    if($(listItems[idx]).text() == previousSelection){
							$(listItems[idx]).remove();
		                }                       
							    
					});	

				  	listElement = document.createElement("li");
				    listHolderElement.appendChild(listElement);
				    listElement.setAttribute("class", "namesOptionList");
				    listElement.appendChild(document.createTextNode(previousSelection));
							
				}
			}			
	    } 
	}
	 

	$(".namesOptionList").click(function(){	
		selectTextFromList(this);
	});    
}

/*select a text from the listed options*/
function selectTextFromList(selectedListElement){
	var selectedOption = $(selectedListElement).text();
	$("#autofillInput").val(selectedOption);
	$(".namesOptionList").remove();
	saveToStack(selectedOption);
}

/*
*save selected options into a stack
*/
function saveToStack(selectedOption){		
    var index = previousInputs.indexOf(selectedOption);
    if (index > -1) {
	    previousInputs.splice(index, 1);
	    previousInputCount = previousInputCount - 1;
	}

	if(previousInputCount < 4){
		previousInputs[previousInputCount] = selectedOption;
		previousInputCount ++;
	}
	else{
		for(var j=0;j<3;j++){
			previousInputCount[j] = previousInputs[j+1];
		}
		previousInputCount[j] = selectedOption;
	}
		
}

/*
*clear input field and options list 
*/
function clearFields(){
 	$("#autofillInput").val("");
 	if($(".namesOptionList").length){
		$(".namesOptionList").remove();
	}
}

