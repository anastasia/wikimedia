// on load:
$(function () {

  getTopics();

  $('h1').on('click', function () {
    getTopics();
  });

});

//-------------------------functions--------------------------------------------//

var topics ;

var getTopics = function () {
  $('.discussion').empty();
  $.getJSON("/discussion", function ( json ) {
    topics = json.topics;
  }).done(function () {
    populateTopics(topics);
  }).fail(function () {
    console.log('error');
  });
};

var populateTopics = function ( topics ) {
  for ( var i = 0; i < topics.length; i++ ) {
    var responses = topics[i].responses;
    var lastResponse = calculateLastDate(responses[responses.length-1].age);
    $('.discussion').append('<li class="topictitle" id='
      +i+'>'
                            + topics[i].topictitle 
                            + '<span class="last_response"> ' 
                            + lastResponse +'</span>' +'</li>');
  };
  topicOnClick();
};


var showResponses = function ( id, topics ) {
  id = parseInt(id);
  for ( var i = 0; i < topics.length; i++ ) {
    id !== i ?  $('#'+i).css('display', 'none') : $('#'+i).css('display', 'inline-block')
  };

  if ( topics[id].responses.length ) {
    for ( var j = 0; j < topics[id].responses.length; j++ ) {
      $('.discussion').append('<div class="response">'
                              +'<li id='
                              +id+'_'+j+'>' 
                              +'<span class="author">'
                              +topics[id].responses[j].author
                              +'</span>' + ': ' 
                              +topics[id].responses[j].posttext 
                              + '</li><button>reply'
                              +'</button> </div>');
    }
  }
  replyToResponse();
};

var calculateLastDate = function ( seconds ) {
  var lastResponse = "";
  if ( Math.round(seconds/ 86400) < 1 ){
    lastResponse = "(less than a day ago)"
  } else if ( Math.round(seconds/ 86400) === 1 ) {
    lastResponse = "(about a day ago)"
  } else if ( Math.round(seconds/ 86400) > 1 ) {
    lastResponse = "(" + Math.round(seconds/ 86400) + " days ago)"
  }
  return lastResponse;
};

var topicOnClick = function () {
  $('.topictitle').on('click', function () {
    $.ajax({
      type: 'GET', 
      url: 'topic/'+this.id+'/',
      data: topics[this.id].responses,
      success: showResponses(this.id, topics)
    })
  });
}

var replyToResponse = function () {
  $('button').on('click', function () {
    var responseId = $(this).parent().children(":first").attr('id');
    $('#'+responseId).append('<fieldset class="replySet">'
                            +'<input type=text placeholder="write your response here">'
                            +'<input type=submit class="reply" value=reply>'
                            +'</fieldset>');
    $(this).remove();
    submitResponse();
  });
}

var submitResponse = function () {
  $('.reply').on('click', function () {
    var responseText = $(this).parent().children(":first").val();
    if ( responseText.length ) {
      $(this).parent().prepend('<li style="color:red">your message <span style="color:black"> '+responseText + ' </span> is being sent, we promise</li>');
      $(this).parent().children(":nth-child(2)").val('');
        // POST REQUEST TO JSON here
        // on success callback: 
          // find parent div
          // append new response to parent div
    }
    // $(this).remove();
    // also keep a check here for when the parent div gets clicked
    // if parent div clicked
      // remove fieldset .replySet
      // append reply button
  });
}