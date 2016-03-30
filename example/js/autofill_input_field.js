var previousInputs, previousInputCount, inputHolderwidth, listHolderwidth, inputHolderMargin;

$(document).ready(function(){
	previousInputs = new Array();
	previousInputCount = 0;
	inputHolderwidth = $(".inputHolder").css("width");
	listHolderwidth = parseInt(inputHolderwidth) - 0;
	inputHolderMargin = $(".inputHolder").css("margin-left");	

	/*styling list container*/
	$(".listHolder").css({
		"width": listHolderwidth+"px",
	    "max-height": "190px",
	    "overflow-y":"auto",
	    "margin-left":inputHolderMargin,
	    "height": "auto",
	}); 
});

/*list matched datas from saved list*/
function listMatchedSavedDatas(inputField){
	setTimeout(function(){
		var dataList = "";
		var currentElement = "";
		var listElement = "";
		var highlitespanElement = "";
		var normalspanElement = "";
		var listHolderElement = document.getElementById("listHolderDiv");
		var enteredValue = inputField.value;
		
		/*remove previous listed options*/
		if($(".namesOptionList").length){
			$(".namesOptionList").remove();
		}
		
		if(enteredValue.length >= 2){ /*listing suggestions from saved datas when entering atleast 2 characters*/
			dataList = getExternalData();
		    if(dataList.names != null){
		       	for (var i = 0; i < dataList.names.length; i++) {
		       		currentElement = dataList.names[i];
		       		if(currentElement.indexOf(enteredValue) > -1 || currentElement.toLowerCase().indexOf(enteredValue) > -1 || currentElement.toUpperCase().indexOf(enteredValue) > -1){
	                    var styledcurrentElement = highlightMatchedCharacters(currentElement,enteredValue);	        			
		        		listElement = document.createElement("li");
		        		listHolderElement.appendChild(listElement);
		        		listElement.setAttribute("class", "namesOptionList");	        		    
		        		var listText = "<span class='listTextClass'>"+styledcurrentElement+"</span>";
		        		listElement.innerHTML = listText;
		        	}
		        }
		        $("#listHolderDiv").children('li:first-child').attr("id","currentli");
		    }

		}
		else{ /*listing previous inputs before entering 2 characters*/
			listPreviousInputs(inputField);
		}
	        
	    /*selecting text from options*/
		$(".namesOptionList").click(function(){	
			selectTextFromList(this);
		});

		/*li on hover action*/ 
		$(".namesOptionList").hover(function(){
			if($("#currentli").length <= 0){
				$(this).attr("id","currentli");
			}
			else{
				$(this).css("background-color","rgb(229, 233, 237)");
			}		
		},function(){
		   if($(this).attr("id") == "currentli"){
		   		$(this).removeAttr("id");
		   }
		   else{
		   	   $(this).css("background-color","#F0F0F0");
		   }		
		});  
    }, 500);	
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
* highlight matched characters of suggestions
*/
function highlightMatchedCharacters(currentElement,enteredValue){
    var highliteStartIndex, highliteEndIndex,currentCharacter,characterWithoutStyle;
    var  charactersForStyle = "";
    var returnJson;
    if(currentElement.indexOf(enteredValue) > -1){
    	highliteStartIndex = currentElement.indexOf(enteredValue);
    } 
    else if(currentElement.toLowerCase().indexOf(enteredValue) > -1){
    	highliteStartIndex = currentElement.toLowerCase().indexOf(enteredValue);
    } 
    else if(currentElement.toUpperCase().indexOf(enteredValue) > -1){
    	highliteStartIndex = currentElement.toUpperCase().indexOf(enteredValue);
    }
    highliteEndIndex = highliteStartIndex + enteredValue.length;
    for(var i = highliteStartIndex; i < highliteEndIndex; i++){
        currentCharacter = currentElement.charAt(i);
    	charactersForStyle = charactersForStyle + currentCharacter;
    }
    styledCharacter = "<strong>"+charactersForStyle+"</strong>";
    currentElement = currentElement.replace(charactersForStyle,styledCharacter);
    return currentElement;
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
			$("#listHolderDiv").children('li:first-child').attr("id","currentli");		
	    } 
	}
	 

	$(".namesOptionList").click(function(){	
		selectTextFromList(this);
	}); 

	/*li on hover styling*/ 
	$(".namesOptionList").hover(function(){
		if($("#currentli").length <= 0){
			$(this).attr("id","currentli");
		}
		else{
			$(this).css("background-color","rgb(229, 233, 237)");
		}		
	},function(){
	   if($(this).attr("id") == "currentli"){
	   		$(this).removeAttr("id");
	   }
	   else{
	   	   $(this).css("background-color","#F0F0F0");
	   }		
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

/*
*keyboard integration
*/
document.onkeydown = function(event){    
    if(event.keyCode == 38){ //up arrow
    	//alert("up");
        if($("#currentli").length > 0){
        	upArrowHandler(document.getElementById("currentli"));
        }
        else if($("#listHolderDiv li").length > 0){
        	upArrowHandler($("#listHolderDiv").children(":eq(0)"));
        }
        else {
        	currentliElement = "";
        }
        return false;
    } 
    else if(event.keyCode == 40){ //down arrow
    	if($("#currentli").length > 0){
        	downArrowHandler(document.getElementById("currentli"));
        }
        else if($("#listHolderDiv li").length > 0){
        	downArrowHandler($("#listHolderDiv").children(":eq(0)"));
        }
        else {
        	currentliElement = "";
        }
        return false;
    }
    else if(event.keyCode == 13){ //enter key
    	 enterKeyHandler();
       }
    else if(event.keyCode == 27){ //escape key
        clearFields();
        $('#autofillInput').blur();
    }
};

/*Up arrow handler*/
function upArrowHandler(currentliElement){
	$('#autofillInput').blur();
    if(currentliElement != "" && currentliElement != null && currentliElement !== "undefined"){
        previousOfcurrentliElement = $(currentliElement).prev('li');
        if($(previousOfcurrentliElement).is('li')){
        	$(currentliElement).removeAttr("id");
        	if($("#currentli").length > 0){
	    		var elemntHavingcurrentli = document.getElementById("currentli");
	    		$(elemntHavingcurrentli).removeAttr("id");
       	    }
        	$(previousOfcurrentliElement).attr("id","currentli");
        	var newpos = $(previousOfcurrentliElement).offset().top - $(currentliElement).offset().top;    
            $('#listHolderDiv').scrollTop(newpos);
        }
        else{
        	$(currentliElement).removeAttr("id");
        	var lastLi = $("#listHolderDiv li").last();
        	$(lastLi).attr("id","currentli");
        	var newpos = $(lastLi).offset().top - $(currentliElement).offset().top;    
            $('#listHolderDiv').scrollTop(newpos);
        }
    } 
    
}

/*down arrow handler*/
function downArrowHandler(currentliElement){	
	$('#autofillInput').blur();
	console.log("focus: "+document.activeElement.tagName);
    if(currentliElement != "" && currentliElement != null && currentliElement !== "undefined"){
       	nextOfCurrentliElement = $(currentliElement).next('li');
       	if($(nextOfCurrentliElement).is('li')){       	
       		$(currentliElement).removeAttr("id");
       		if($("#currentli").length > 0){
       			var elemntHavingcurrentli = document.getElementById("currentli");
       			$(elemntHavingcurrentli).removeAttr("id");
       		}
       		$(nextOfCurrentliElement).attr("id","currentli");
       		var newpos = $(nextOfCurrentliElement).offset().top - $(currentliElement).offset().top;    
            $('#listHolderDiv').scrollTop(newpos);
       	}
       	else{          		 
       	    $(currentliElement).removeAttr("id"); 
       	    var firtstLi = $("#listHolderDiv").children(":eq(0)");   		
        	$(firtstLi).attr("id","currentli");
        	var newpos = $(firtstLi).offset().top - $(currentliElement).offset().top;    
            $('#listHolderDiv').scrollTop(newpos);
       	}       	
    }
}

/*enter key press handler*/
function enterKeyHandler(){	
	if($("#currentli").length > 0){
		selectTextFromList(document.getElementById("currentli"));
	}
    else{
        selectTextFromList($("#listHolderDiv").children(":eq(0)"));
    }
}	






