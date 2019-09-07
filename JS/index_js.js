// setting variables 
    // select the areas from the html document
var $table_row = document.querySelector("tbody.PROOF_OF_ALIENS");
var $renderedRow = $table_row.querySelectorAll("tr");
    // get user inputs for the search filter
var $input_date = document.querySelector("#search_date");
var $input_city = document.querySelector("#search_city");
var $input_state = document.querySelector('#search_state');
var $input_country = document.querySelector('#search_country');
var $input_shape = document.querySelector('#search_shape');
    // select the pagination section
var $result_page = document.querySelector(".pagination");
    // select the search button submit
var $search_button = document.querySelector("#submit_search");
    // select the show-all button 
var $showAll_button = document.querySelector("#show_All");
    // add eventListener to search button and show all button when clicked
$search_button.addEventListener("click", search_multi);
$showAll_button.addEventListener("click", show_all);
    // selecting all page progress rows for calculating page progress (page # out of #);
var $page_progress = document.querySelectorAll("#page_progress");
var $prev_next_btn = document.querySelectorAll("#prev_next_btn");

// initializing variables
var page1 = 1;
    // Set initial results per page (aka perPageCt) to whatever is the option selected;
var $per_page_menu = document.getElementById("results_per_page");
$per_page_select = $per_page_menu.options[$per_page_menu.selectedIndex].text;
$per_page_select = Number($per_page_select); // menu text is a number, but just in case; 
    // Change selected results per page when user chooses different number in the dropdown menu; 
$per_page_menu.addEventListener("change", function(){ 
    $per_page_select = $per_page_menu.options[$per_page_menu.selectedIndex].text;
    console.log("changed results per page: " + $per_page_select); // Logs the change
    return $per_page_select = Number($per_page_select);
});

    // get user's desired specific page value
var $input_per_page = document.getElementById("goToPage"); 
var $submit_pageInput = document.getElementById("submit_gotoPg"); // select the submit button

// End declarations/initialization section 

// Function: Search multiple filters (or just one filter or even none at all) 
function search_multi(){
    // Format the user's search by removing leading and trailing whitespace.
    var inputDate = $input_date.value.trim();
    var inputCity =  $input_city.value.trim().toLowerCase();
    var inputState = $input_state.value.trim().toLowerCase();
    var inputCountry =  $input_country.value.trim().toLowerCase();
    var inputShape =  $input_shape.value.trim().toLowerCase();

    console.log(inputDate);
    
    // *** Set filtered dates to an array of all values which match the filter ***
    /*** 
    Using the filter function, user can set multiple filters and search for UFO sightings using 
    the following criteria based on the table columns: 
    ***/ 
        // checking if any input vars have no value
        var filteredInputs = {"datetime" : inputDate, "city" : inputCity, "state" : inputState, 
            "country" : inputCountry, "shape" : inputShape};
        for (var key in filteredInputs){
            // if has no value, then delete
            if (filteredInputs[key] == ""){
                delete filteredInputs[key];
            }
        } 
    console.log(filteredInputs);

    if (Object.keys(filteredInputs).length != 0){ // if filtered object is not empty
        filteredDataSet = dataSet.filter(function(item) { //filters dataSet from data.js using a function
            for (key in filteredInputs){ // for each key in the filteredArray object
                if(item[key] === undefined || item[key] == "" || item[key].trim().toLowerCase() != filteredInputs[key]) 
                /* does not return the current item from dataSet if item at [key] is undefined or nothing
                or if the values from dataSet and filteredArray don't match at the keys*/
                    return false;
            }
            return true; /* if not(key-values do not match), then the item passes the filter and 
            is included in the filteredDataSet array */  
        });
        console.log(filteredDataSet.length);
        render_pagination(some_data=filteredDataSet, perPageCt = $per_page_select, page_num=page1);
        slice_data(some_data=filteredDataSet, perPageCt = $per_page_select, page_num=page1);
    } 
    else { //if length of keys in filteredInputs is == 0
        filteredDataSet = [];
        render_pagination(some_data=filteredDataSet, perPageCt=0, page_num=0);
        slice_data(some_data=filteredDataSet, perPageCt = 0, page_num=0);
    }

} // end of search_multi(); 


// Function: Show all rows 
function show_all(){
    console.log(`Showing all the data: ${dataSet.length} rows in total`);
    render_pagination(some_data=dataSet, perPageCt=$per_page_select, page_num=page1); // default records per page set very high
    slice_data(some_data=dataSet, perPageCt = $per_page_select, page_num=page1);
} // end show_all();


// Pagination without use of jquery 
// render the pagination lists
// @TODO: find a way to get user's desired per page Ct (how many results shown at once) or set it

function render_pagination(some_data, perPageCt=50, page_num=page1) { // parameters: list of objects and page number to start
    // just making sure the parameters do not default to the default values
    var some_data = some_data;
    var perPageCt = perPageCt;
    var page_num = Number(page_num); // the page number first inputted. Need this to reset currentPageNum later; 

    // variable to keep track of current page number
    var currentPageNum = page_num; 

    // clear all previous paginations:
    while($result_page.firstChild){
        $result_page.removeChild($result_page.firstChild);
    }

    // clear all the previous page progress
    while($page_progress.firstChild){
        $page_progress.removeChild($page_progress.firstChild);
        }

    // clear all the previous prev-next buttons
    for (var i=0; i<$prev_next_btn.length; i++){
        while ($prev_next_btn.firstChild){
            $prev_next_btn.removeChild($prev_next_btn.firstChild);
        }
    }

    // get total # of pages needed to encompass all data.
    if (page_num >= 1){ // but only if page number is positive
        var last_page = Math.ceil(some_data.length / perPageCt); // rounds up the resulting number;
    } else {
        var last_page = 0;
    }
   
    // FUNCTION: Create buttons and append under "pagination" <ul>. 
    for (var i=0; i<last_page; i++) { 
        var newPageLink = document.createElement('button');
        currentPageNum = i + 1;
        newPageLink.innerText = currentPageNum;
        newPageLink.setAttribute("class", "btn btn-outline-danger");
        newPageLink.setAttribute("id", currentPageNum); // set id at the current page number to easily get page number
    //  add event listener for each button
        newPageLink.addEventListener("click", function (){ // on click, execute custom function
            var current_button = this.id; // get the current ID, which is the button/page number
            currentPageNum = Number(current_button); // turn string into a number b/c javascript is stupid; 
            console.log("button clicked: " + currentPageNum);
            slice_data(some_data=some_data, perPageCt, page_num=currentPageNum);
            calc_page_progress(current_page=currentPageNum, end_page=last_page);
            window.scrollTo(0, 0); // scroll to the top of the window after rendering new table;
        });

        $result_page.appendChild(newPageLink); // append new pagination under the pagination <ul> 
    }   

    //reset currentPageNum as the above create pagination button loop increments it to the last page number;
    currentPageNum = page_num;

    // renders the page progress for the first page
    if (page_num >= 1){
        calc_page_progress(current_page=page1, end_page=last_page); 
    } 
    else { // if page = 0, remove all pagination. For aesthetic purposes.
                // clear the previous page progress
                // may be broken
        for (var i=0; i<$page_progress.length; i++) {
            while($page_progress[i].firstChild){
                $page_progress[i].removeChild($page_progress[i].firstChild);
            }
        }
                // clear the previous Previous button
        for (i=0; i<$prev_next_btn.length; i++) {
            while ($prev_next_btn[i].firstChild) {
                $prev_next_btn[i].removeChild($prev_next_btn[i].firstChild);
            }
        }
    }

    // Set up button for previous & next page
    // Append a fresh prev button separate from the rest of the pagination
    for (i=0; i<$prev_next_btn.length; i++) {
        // clear the previous Previous button
        while ($prev_next_btn[i].firstChild) {
            $prev_next_btn[i].removeChild($prev_next_btn[i].firstChild);
        }
        // create Previous button
        previous_page = document.createElement('button');
        previous_page.innerText = "Previous";
        previous_page.setAttribute("class", "btn btn-outline-danger");
        previous_page.setAttribute("id", "previous");
        // execute function with a click
        previous_page.addEventListener("click", function (){
            // set so that page number is never 0 or negative
            if (currentPageNum > 0){  
                currentPageNum = currentPageNum - 1
                console.log("button clicked: Previous");
                console.log("Page number is now: " + currentPageNum);
                slice_data(some_data=some_data, perPageCt, page_num=currentPageNum);
                calc_page_progress(current_page=currentPageNum, end_page=last_page);
            }
            else {
            }
        });
        
        $prev_next_btn[i].appendChild(previous_page);

        // create the next button
        next_page = document.createElement('button');
        next_page.innerText = "Next";
        next_page.setAttribute("class", "btn btn-outline-danger");
        next_page.setAttribute("id", "next");
        // execute function with a click
        next_page.addEventListener("click", function(){ 
            console.log("Page number: " + currentPageNum);
            if (currentPageNum < last_page){
                currentPageNum ++;
                console.log("button clicked: Next");
                console.log("Page number is now: " + currentPageNum);
                slice_data(some_data=some_data, perPageCt, page_num=currentPageNum);
                calc_page_progress(current_page=currentPageNum, end_page=last_page);
                }
            else {
                console.log("button clicked: Next");
                console.log("You've reached the last page: " + currentPageNum);
            }
        });
        $prev_next_btn[i].appendChild(next_page);
    } // end prev-next button for loop; 

//  When user specifies page number, switch to page number 
    $submit_pageInput.addEventListener("click", function(){ // execute funtion when submit goto page is clicked
        currentPageNum = Number($input_per_page.value.trim());
        console.log("user selected page number: " + currentPageNum);
        slice_data(some_data=some_data, perPageCt, page_num=currentPageNum);
        calc_page_progress(current_page=currentPageNum, end_page=last_page);
    });

} // END render_pagination();

// calculate page number, slice data accordingly, and call render_table() on the new data. 
function slice_data(some_data, perPageCt=50, page_num=page1) { // parameters: object, number of results displayed per page, page number    
    var page_num = Number(page_num); // making sure this is a number
    console.log(page_num);
    startIndex = (page_num - 1) * perPageCt; 
    endIndex =  startIndex + perPageCt; 
    
    var slicedArray = some_data.slice(startIndex, endIndex); // Can slice object by index, 
    // but may return [Object{}, Object{}, ...], which could cause problems when passing into render_table 
    render_table(slicedArray); 
    console.log("Current page: " + page_num);
    console.log("start: " + startIndex + "; end: " + endIndex);
}

// calculate the page progress (page # out of ###). Called by render_pagination()
function calc_page_progress(current_page, end_page) {
    var current_page = Number(current_page); // making sure these are numbers, just in case
    var end_page = Number(end_page);
    // get page progress for each id="page_progress", before & after the alien sightings table; 
    for (var i=0; i<$page_progress.length; i++){
        // clear the previous page progress
        while($page_progress[i].firstChild){
            $page_progress[i].removeChild($page_progress[i].firstChild);
        }
        // create new paragraph element and let reader know what page they're on
        var progressElem = document.createElement("p");
        progressElem.innerHTML = `Page <b>${current_page}</b> out of <b>${end_page}</b>`
        $page_progress[i].appendChild(progressElem);
    }

}

function render_table(some_data){
/*** calls dataSet from data.js. Loop through and insert rows first ***/ 
/*    first clear all input field, clearing previous values  */
    $input_date.value = "";
    $input_city.value = "";
    $input_state.value = "";
    $input_country.value = "";
    $input_shape.value = "";
    // note: originally planned to clear goTo page input, but that caused a bug that grabs empty values under some situations 

    /* clear any previous table rows */
    while($table_row.firstChild){
        $table_row.removeChild($table_row.firstChild);
    }

    /* generate table */
    for (i=0; i<some_data.length; i++){
        var data = some_data[i];
        var row = $table_row.insertRow(i);
        var keys = Object.keys(data) //returns the keys for each "entry" in the object
        var col_length = keys.length - 1; //get column length of the end table
        /* loop through columns and sets columns, excluding "durationMinutes" data */
        for (j=0; j<col_length; j++){
            var cell = row.insertCell(j);
            if (keys[j] != "durationMinutes") { // excludes "durationMinutes" variable
                var data_value = data[keys[j]]; //this is the value of the dataSet at entry number i and key number j 
                cell.innerText = data_value;
            }
            else {
                var data_value = data[keys[j+1]]; //moves on to the next value
                cell.innerText = data_value;
            }
        }
    }
}

// Render the first 100 entries from dataSet when first enter page:
show_all(dataSet, perPageCt=100, page_num=page1);
slice_data(dataSet, perPageCt = 100, page_num=page1); // Need to start the data slice, rendering the table.
// Otherwise, current page count gets screwed up and pushed to the last page number. 