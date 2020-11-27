console.log( 'Vatti Rocks' );
const app = {
  listFilter: 'all',
  dueDate: ''
}
 
$( document ).ready( function(){
  console.log( 'document ready' );
  $('#sortIndicatorId').append('Ascending')
  // Establish Click Listeners
  setupClickListeners() 
  // load existing koalas on page load
  getTodos(0);

}); // end doc ready
 
// add New Task button listeners
function setupClickListeners() {
  $( '#addButtonId' ).on( 'click', function(){
    console.log( 'in addButton on click' );
    saveTodos();
  });

  //update task button listener
  $('#modifyButtonId').on( 'click', function() {
    console.log (`modify button`);
    updateTodo();
  })
  
  // delete button listener
  $('#deleteButtonId').on ('click', function () {
    let todoId = $('#updateRecordId').text();
    if (todoId === '') {
      alert ('please select record below to delete first')
      return
    }
    // $('#deleteModalId').modal('toggle');
    // $('#deleteModalId').modal('hide');
    $('#deleteModalId').modal('show');
    $('#modalCancelId').on ('click', function (){ return });
    $('#modalDeleteId').on ('click', function (){ 
        deleteTodo (todoId)
        $('#deleteModalId').modal('hide'); 
    });
  });

  // cancel button click cpature
  $('#cancelButtonId').on ('click', clearInputEntries);

  // confirm record add modal cancel button listener
  $('#recordUpdateModalDismissId'). on ('click', function() {
    $('#recordUpdateModalId').modal('hide');
  });

  $('#viewTodoDataId').on ('click', '.trTableBodyClass', function () {
    $('.trTableBodyClass').css ('backgroundColor', '');
    todoId = $(this).closest('tr').data('id');
    $(this).css ('backgroundColor', 'yellow');
    selectRowGrabData(todoId);
  });

  
  $('#greenButtonId').on ('click', function () {
    $('#ddMenuCategoryId').css ('backgroundColor', 'green')
    $('#ddMenuCategoryId').css ('color', 'white')
    $('#ddMenuCategoryId').empty();
    $('#ddMenuCategoryId').append('Green');
    console.log (`pressed green`);
  })
  $('#redButtonId').on ('click', function () {
    $('#ddMenuCategoryId').css ('backgroundColor', 'red')
    $('#ddMenuCategoryId').css ('color', 'white')
    $('#ddMenuCategoryId').empty();
    $('#ddMenuCategoryId').append('Red');
    console.log (`pressed red`);
  })

  $('#yellowButtonId').on ('click', function () {
    $('#ddMenuCategoryId').css ('backgroundColor', 'yellow')
    $('#ddMenuCategoryId').css ('color', 'black')
    $('#ddMenuCategoryId').empty();
    $('#ddMenuCategoryId').append('Yellow');
    console.log (`pressed Yellow`);
  })

  $('#blueButtonId').on ('click', function () {
    $('#ddMenuCategoryId').css ('backgroundColor', 'blue')
    $('#ddMenuCategoryId').css ('color', 'white')
    $('#ddMenuCategoryId').empty();
    $('#ddMenuCategoryId').append('Blue');
    console.log (`pressed Blue`);
  })

  $('#greyButtonId').on ('click', function () {
    $('#ddMenuCategoryId').css ('backgroundColor', 'grey')
    $('#ddMenuCategoryId').css ('color', 'white')
    $('#ddMenuCategoryId').empty();
    $('#ddMenuCategoryId').append('Grey');
    console.log (`pressed Grey`);
  })

  $('#activeButtonId').on ('click', function () {
    $('#ddMenuStatusId').empty();
    $('#ddMenuStatusId').append ('Active');
  })

  $('#onHoldButtonId').on ('click', function () {
    $('#ddMenuStatusId').empty();
    $('#ddMenuStatusId').append ('On Hold');
  })

  $('#rainyDayButtonId').on ('click', function () {
    $('#ddMenuStatusId').empty();
    $('#ddMenuStatusId').append ('Rainy Day');
  })

  $('#completeButtonId').on ('click', function () {
    $('#ddMenuStatusId').empty();
    $('#ddMenuStatusId').append ('Complete');
  })

  // sort order listener
  $('#sortAscId').on ('click', function (){
    $('#sortIndicatorId').empty();
    $('#sortIndicatorId').append('Ascending')
    getTodos(0);
    // ascending
  })

  // sort order listener
  $('#sortDescId').on ('click', function (){
    $('#sortIndicatorId').empty();
    $('#sortIndicatorId').append('Descending')
    getTodos(0);
    // Descending
  })

  // filter on records filter (3 button group) listener
  $('#filterAllId').on ('click', function (){
    app.listFilter = 'All'
    $('#filterAllId').css ('color', 'black')
    $('#filterOpenId').css ('color', '')
    $('#filterCompleteId').css ('color', '')
    getTodos(0);
  } )
  $('#filterOpenId').on ('click', function (){
    app.listFilter = 'Open'
    $('#filterOpenId').css ('color', 'black')
    $('#filterAllId').css ('color', '')
    $('#filterCompleteId').css ('color', '')
    getTodos(0);
  } )
  $('#filterCompleteId').on ('click', function (){
    app.listFilter = 'Complete'
    $('#filterCompleteId').css ('color', 'black')
    $('#filterAllId').css ('color', '')
    $('#filterOpenId').css ('color', '')
    getTodos(0);
  } )

  // date picker found at: https://github.com/fengyuanchen/datepicker/blob/master/README.md
  // $('#dueDateId').on ('click', function (){
  //   app.dueDate = $('#dueDateId').val()
  //   console.log (`appduedate`, app.dueDate);
  // })
  // $('[data-toggle="datepicker"]').datepicker({ date: `'${app.dueDate}'` });
  $('[data-toggle="datepicker"]').datepicker({autoPick: true});
 
}  // end of button listeners


// ajax call to server to get todos
function getTodos(todoId){
  clearInputEntries();
  let sortOrder = $('#sortIndicatorId').text()
  if ( sortOrder === 'Ascending') {sortOrder = 'ASC'} else {sortOrder = 'DESC'}
  let html = '';
  $("#viewTodoDataId").empty();
  $.ajax({
    type: 'GET',
    url: `/tododata/${todoId}?order=${sortOrder}`
  }).then(function (response) {
    // append data to the DOM
    let dueDate = null;
    for (let i = 0; i < response.length; i++) {
      if ( app.listFilter === 'Complete' ) {
        if ( response[i].status !== 'Complete' ) continue
      } else if ( app.listFilter === 'Open' ) {
        if ( response[i].status === 'Complete' ) continue
      };

      if ( (response[i].due_date == null) || (response[i].due_date == undefined) ) {
        dueDate = ' ';
      } else {
        dueDate = formatSqlDate(response[i].due_date);
      }
      
      html = `<tr class="trTableBodyClass" data-id="${response[i].id}" id="trId${response[i].id}">
                    <td>${response[i].name}</td>
                    <td>${response[i].comment}</td>
                    <td>${formatSqlDate(response[i].create_date)}</td>
                    <td>${formatSqlDate(response[i].modified_date)}</td>
                    <td>${dueDate}</td>
                    <td id="catColorId${response[i].id}">${response[i].category_color}</td>
                    <td>${response[i].status}</td>
              `;
      $('#viewTodoDataId').append(html)
      let catColor = response[i].category_color
      if ( catColor === 'Yellow') catColor = '#bebe02'
      $(`#catColorId${response[i].id}`).css ('color', catColor)
      if ( response[i].status === 'Complete' )  $(`#trId${response[i].id}` ).css ('textDecoration', 'line-through')
      }  // end of for loop
  })
  .catch ( function (error){
    console.log (`Error:`, error);
    alert ('Something bad happened in GET')
  });
}   // end get todos

// formatting and POST of todo data
function saveTodos(  ){
  // ajax call to server to get todos
  let dueDate = null;
  let completedDate = null;
  let today = new Date();
  let formattedTodayDate= `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`
  if ( $('#ddMenuStatusId').text() === 'Completed') {
    completedDate = formattedTodayDate;
  }
  console.log (`$('#dueDateId').val()`, $('#dueDateId').val());
  if ( ($('#dueDateId').val() == '') || ($('#dueDateId').val() == null) ) {
    dueDate = null;
  } else {
    dueDate = $('#dueDateId').val();
  }
  if ( !isValidString($('#nameId').val()) ) {
    alert ('Task Name needs at least 3 characters');
    return;
  }
  let payloadObject = {  // these tacos must match those in the router
        name: $('#nameId').val(),
        comment: $('#noteId').val(),
        create_date: formattedTodayDate,
        modified_date: formattedTodayDate,
        // due_date: $('#dueDateId').val(),
        due_date: dueDate,
        completed_date: completedDate,
        category_color: $('#ddMenuCategoryId').text(),
        status: $('#ddMenuStatusId').text(),
    }
    console.log (`Payload to POST`, payloadObject);
    $.ajax({
        type: 'POST',
        url: '/tododata',
        data: payloadObject
    }).then( function (response) {
      $('#recordUpdateModalId').modal('show');
      clearInputEntries();
      getTodos(0);
    })
    .catch ( function (error){
        console.log (`Error:`, error);
        alert ('Something bad happened in POST')
    });
}

// delete selected todo record (selected from DOM table)
function deleteTodo( todoId ) {
  console.log (`delete ID`, todoId);
  $.ajax({
    method: 'DELETE',
    url: `/tododata/${todoId}`
  })
    .then(function (response) {
      getTodos(0);
    })
    .catch(function (error) {
      console.log('Error:', error);
      alert('Something bad happened in DELETE. Try again later');
    })
  clearInputEntries();
} // end of deleteTodo fn

// make the date look 'prettier'
function formatSqlDate (passedDate) {
    let year = passedDate.slice(0, 4);
    let month = passedDate.slice(5, 7);
    let day = passedDate.slice(8, 10);
    return `${month}/${day}/${year}`
};

// clears all user input entries
function clearInputEntries() {
  $('.trTableBodyClass').css ('backgroundColor', '');
  $('#ddMenuCategoryId').css ('backgroundColor', '');
  $('#ddMenuCategoryId').css ('color', '')
  $('#ddMenuCategoryId').empty();
  $('#ddMenuCategoryId').append('Category');
  $('#ddMenuStatusId').empty();
  $('#ddMenuStatusId').append('Status');
  $('#nameId').val('');
  $('#noteId').val('');
  $('#dueDateId').val('');
  $('#updateRecordLabelId').empty();
  $('#updateRecordId').empty();
  $('#lastUpdateLabelId').empty();
  $('#lastUpdateDateId').empty();
  $('#completedDateLabelId').empty();
  $('#completedDateId').empty();
  // basic DOM staging for defaults
  $('#ddMenuCategoryId').css ('backgroundColor', 'green')
  $('#ddMenuCategoryId').css ('color', 'white')
  $('#ddMenuCategoryId').empty();
  $('#ddMenuCategoryId').append('Green');
  $('#ddMenuStatusId').empty();
  $('#ddMenuStatusId').append ('Active');
} // end of clearInputEntries fn

// stage data for PUT
function selectRowGrabData (todoId) {
  $(this).css ('backgroundColor', 'yellow');
  $.ajax({
    type: 'GET',
    url: `/tododata/${todoId}`
  }).then(function (response) {
    // fill in form
    $('#updateRecordLabelId').empty();
    $('#updateRecordLabelId').append(`Record #:`);
    $('#updateRecordId').empty();
    $('#updateRecordId').append(response[0].id);

    $('#lastUpdateLabelId').empty();
    $('#lastUpdateLabelId').append(` Last Update: `);
    $('#lastUpdateDateId').empty();
    $('#lastUpdateDateId').append(formatSqlDate(response[0].modified_date));

    $('#completedDateLabelId').empty();
    $('#completedDateId').empty();
    if ( response[0].completed_date != null ) {
      $('#completedDateLabelId').append(` Completed On: `);
      $('#completedDateId').append(formatSqlDate(response[0].completed_date));
    }
    
    $('#nameId').val(response[0].name);
    $('#noteId').val(response[0].comment);
    if ( (response[0].due_date == null) || (response[0].due_date == undefined) ) {
    } else {
      $('#dueDateId').val(formatSqlDate(response[0].due_date));
    }
    $('#ddMenuCategoryId').empty()
    $('#ddMenuCategoryId').append(response[0].category_color);
    $('#ddMenuCategoryId').css ('backgroundColor', response[0].category_color)
    if ( response[0].category_color === "Yellow") {
      $('#ddMenuCategoryId').css ('color', 'black' )
    } else {
      $('#ddMenuCategoryId').css ('color', '' )
    };
    $('#ddMenuStatusId').empty()
    $('#ddMenuStatusId').append(response[0].status)
  })
  .catch ( function (error){
    console.log (`Error:`, error);
    alert ('Something bad happened')
  });
} //end of selectRowGrabData fn

// update selected record (selected form the DOM)
function updateTodo () {
  if ( !$('#updateRecordId').text() ) {
    alert ('Please select a record from the table below to update')
    return
  }
  let today = new Date();
  let formattedTodayDate= `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`
  let todoId = $('#updateRecordId').text();
  let completedDate = null;
  let dueDate = null;
  if ( ($('#completedDateId').text() != null)  && ($('#ddMenuStatusId').text() === 'Completed') ) {
    completedDate = formattedTodayDate;
  }
  if ( ($('#dueDateId').val() == '') || ($('#dueDateId').val() == null) ) {
    dueDate = null;
  } else {
    dueDate = $('#dueDateId').val();
  }

  let payloadObject = {  // these tacos must match those in the router
    id: todoId,
    name: $('#nameId').val(),
    comment: $('#noteId').val(),
    modified_date: formattedTodayDate,
    due_date: dueDate,
    completed_date: completedDate,
    category_color: $('#ddMenuCategoryId').text(),
    status: $('#ddMenuStatusId').text(),
  }
  console.log (`Just before AJAX`, payloadObject);
  $.ajax({
    method: 'PUT',
    url: `/tododata/${todoId}`,
    data: payloadObject
  })
  .then(function (response) {
    $('#recordUpdateModalId').modal('show');
    getTodos(0);
    clearInputEntries();
  })
  .catch(function (error) {
    console.log('Error:', error);
    alert('Something bad happened. Try again later');
  });
}

// check for specific user input criteria 
function isValidString(str) {  
    if ( typeof str != "string" ) return false  
    if ( str.trim().length < 3 ) return false
    return true
};  //end of isValidString fn
    