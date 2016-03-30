# autofill_input_fields

	This is a plugin for auto fill input text fields. When a user focus to this auto fill input text field, user will get suggestions based on saved data list and user's previous selections.  To reduce server overhead, duplicate calls to the server are avoided.

	"jquery-2.2.0.min.js" is the only one external library we used.  

[Demo] http://suryarajm.github.io/autofill_input_fields/example/

##Installation

	Download "autofill_input_field.css" and "autofill_input_field.js" from src folder. Include these files into your project.

	You should add "jquery-2.2.0.min.js" before "autofill_input_field.js".

##Markup 
	Paste below html codes to your html file.

        <div class="inputHolder">	    	    
	    	<input type="text" id="autofillInput" placeholder="Enter Text" onkeyup="listMatchedSavedDatas(this)" onclick="listPreviousInputs(this)">               
	    	<button id="textClear" onclick="clearFields()"><img src="images/cross_btn.png" width="30px"></button>
	    </div>	    	      	 
	    <div class="listHolder" id="listHolderDiv"></div>


##Author
Surya Raj M (suryar@qburst.com)	