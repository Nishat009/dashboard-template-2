"use strict";

$( document ).ready(function() {
    var currentUrl = window.location.href.indexOf("content/edit") > -1;
    currentUrl ? $('.content-update').show() : $('.content-update').hide();
});

$(document).on('keyup', '.questions', function () {
    $(this).next('p').text($(this).val().length + '/' + $(this).attr('maxlength'));
});
$(document).on("click", function () {
    $(".drop-down").hide();
});
/**
 * @param mixed url, which url hit this call
 * @param mixed params, paramters
 * @param mixed type, get, post
 * @param mixed dataType, json, html
 * 
 * @return [type]
 */
function doAjaxprocess(url, params, type, dataType) {
     return $.ajax({
        data : params,
        url : url,
        type : type,
        dataType : dataType
    });
}

$(document).on('click', '.content-update', function () {
    parts = window.location.href.split("/"),
    doAjaxprocess(
        SITE_URL + "/openai/updateContent", 
        { 
                contentSlug: parts[parts.length-1],
                content: tinymce.activeEditor.getContent(),
                _token: CSRF_TOKEN
        }, 
        'post',
        'json'
    ).done(function(data) {
        toastMixin.fire({
            title: data.message,
            icon: 'success'
          });
    });
});

$(document).on('click', '.saved-content', function () {
    if ($('.partialContent-' + this.id).length) {
        return true;
    }
    $("#partial-history").html(''); 
    $('.loader-history').removeClass('hidden');
    $('.save-content-' + this.id).removeClass("border-design-3");  
    $(".saved-content").each(function () {
        $(this).removeClass("border-design-3-active");
    }); 
    $('.save-content-' + this.id).addClass("border-design-3-active");   

    doAjaxprocess(
        SITE_URL + "/openai/get-content", 
        { 
            contentId: this.id
        }, 
        'get',
        'html'
    ).done(function(data) {
       
        $('.loader-history').addClass('hidden');
        $("#partial-history").append(data);
    });
});
$(document).on('click', '.modal-toggle', function (e) {
    e.preventDefault();
    $('.modal').toggleClass('is-visible');
}); 
$(document).on('click', '.delete-content', function () {
    var contentId = this.id
    doAjaxprocess(
        SITE_URL + "/openai/deleteContent", 
        { 
            contentId : contentId
        }, 
        'get',
        'json'
    ).done(function(data) {
        $('#partial-history').html('');
        $('.save-content-' + contentId).hide();
        toastMixin.fire({
            title: data.message,
            icon: 'success'
            });
    });
});

$(document).on('click', '#history', function () {
    $.ajax({
        url: SITE_URL + "/api/openai/history",
        type: "get",
        dataType: "html",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + ACCESS_TOKEN);
        },
       
        success: function(data) {
            var demo = JSON.parse(data);
            $('.overflow-hidden').html(demo.response.records.html) 

        },
        error: function(data) {
         }     
    });
});

$(document).on('click', '.image-save', function () {

    var imageSrc = [];
    $('#image-content').children('img').map(function () {
        imageSrc.push($(this).attr('src'))
    });
    if(imageSrc.length === 0) {
        toastMixin.fire({
            title: 'No Imge Found',
            icon: 'error'
            });
    }
    doAjaxprocess(
        SITE_URL + "/openai/save-image", 
        { 
            imageSource : imageSrc,
            promt : $('#image-description').val(),
            size : $('#size').val(),
            artStyle : $('#art-style').val(),
            artStyle : $('#art-style').val(),
            lightingStyle : $('#ligting-style').val(),
            _token: CSRF_TOKEN
        }, 
        'post',
        'json'
    ).done(function(data) {
        toastMixin.fire({
            title: data.message,
            icon: 'success'
            });
    });
});

$(document).on('click', '.generate-pdf', function () {

    var myContent = tinymce.activeEditor.getContent({format : 'raw'});
        const options = {
            margin: 0.3,
            filename: 'filename.pdf',
            image: { 
              type: 'jpeg', 
              quality: 0.98 
            },
            html2canvas: { 
              scale: 2 
            },
            jsPDF: { 
              unit: 'in', 
              format: 'a4', 
              orientation: 'portrait' 
            }
          }      

          html2pdf().from(myContent).set(options).save();
});

$(document).on('click', '.generate-word', function () {

    var header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' "+
        "xmlns:w='urn:schemas-microsoft-com:office:word' "+
        "xmlns='http://www.w3.org/TR/REC-html40'>"+
        "<head><meta charset='utf-8'><title>Export HTML to Word Document with JavaScript</title></head><body>";
    var myContent = tinymce.activeEditor.getContent({format : 'raw'});
    $("#basic-example").val(myContent);
    var contentOfHtml = $("#basic-example").val();
    var footer = "</body></html>";
    var sourceHTML = header + contentOfHtml + footer;
   
   var source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
   var fileDownload = document.createElement("a");
   document.body.appendChild(fileDownload);
   fileDownload.href = source;
   fileDownload.download = 'document.doc';
   fileDownload.click();
   document.body.removeChild(fileDownload);
});

$(document).on('click', '.copy-text', function () {
    var myContent = tinymce.activeEditor.getContent();
    navigator.clipboard.writeText(myContent);

    toastMixin.fire({
        title: 'Content Copied Successfully',
        icon: 'success'
      });
});
var toastMixin = Swal.mixin({
    toast: true,
    icon: 'error',
    title: 'General Title',
    animation: false,
    position: 'top-right',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });
$(document).on('change', '.use-cases', function () {
    if (!(window.location.href.indexOf("content/edit") > -1)) {
        $(".content-name").html('Content Of a'+ ' ' + $(this).val())
    }

    $(".edit-url").attr("href", $(this).val());
    $.ajax({
        url: SITE_URL + "/openai/formfiled-usecase/" + $(this).val(),
        type: "get",
        dataType: "html",
        data: {
            useCae: $(this).val(),
            _token: CSRF_TOKEN
        },
        success: function(response) {
            $("#appended-data").html(response)
        }
    });

});   
function nl2br (str, is_xhtml) {
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
 } 

 function loader(){
    $('.loader').toggleClass('hidden'); 
 }
$(document).on('submit', '#openai-form', function (e) { 
    let contentSlug = '';
    var currentUrl = window.location.href.indexOf("content/edit") > -1;
    if ((currentUrl)) {
        parts = window.location.href.split("/"),
        contentSlug = parts[parts.length-1];
    }

    e.preventDefault();
    var gethtml = tinyMCE.activeEditor.getContent();

    var formData = {};
    $('.dynamic-input').each(function(column) 
    {
        formData[this.name] = $(this).val();
    });
    $.ajax({
        url: SITE_URL + '/' + PROMT_URL,
        type: "POST",
        beforeSend: function (xhr) {
            $('.loader').show();
            $('#magic-submit-button').attr('disabled', 'disabled');
            xhr.setRequestHeader('Authorization', 'Bearer ' + ACCESS_TOKEN);
        },
        data: {
            questions: JSON.stringify(formData),
            promt: $("#promt").val(),
            useCase: $(".use-cases").val(),
            language: $("#language").val(),
            variant: $("#variant").val(),
            temperature: $("#temperature").val(),
            tone: $("#tone").val(),
            previousContent: gethtml,
            contentSlug: contentSlug,
            _token: CSRF_TOKEN
        },
        success: function(data) {
                var totalItems = data.response.records.length;
                for(let i = 0; i < totalItems - 1; i++) {
                     gethtml += nl2br(data.response.records[i].text);
                     gethtml += '<br>';
                }
                tinyMCE.activeEditor.setContent(gethtml, {format : 'raw'});
                $(".word-counter").html('Total Word: ' + data.response.records[totalItems - 1].words);
                $('.loader').hide();
                $('#magic-submit-button').removeAttr('disabled');
        },
        error: function(data) {
            var jsonData = JSON.parse(data.responseText)
            toastMixin.fire({
                title: jsonData.response.records.response ? jsonData.response.records.response : jsonData.response.status.message,
                icon: 'error'
              });
              $('.loader').hide();
              $('#magic-submit-button').removeAttr('disabled');
         }     
    });
});


$(document).on('submit', '#openai-image-form', function (e) { 
    var gethtml = '';
    e.preventDefault();

    $.ajax({
        url: SITE_URL + '/' + PROMT_URL,
        type: "POST",
        beforeSend: function (xhr) {
            $('.loader').show();
            $('#magic-submit-button').attr('disabled', 'disabled');
            xhr.setRequestHeader('Authorization', 'Bearer ' + ACCESS_TOKEN);
        },
        data: {
            promt: $("#image-description").val(),
            variant: $("#variant").val(),
            resulation: $("#size").val(),
            artStyle: $("#art-style").val(),
            lightingStyle: $("#ligting-style").val(),
            dataType: 'json',
            _token: CSRF_TOKEN
        },
        success: function(response) {
            var totalItems = response.length;
            var imagePath = SITE_URL + '/public/uploads/aiImages/'    
                for(let i = 0; i < totalItems; i++) {
                     gethtml += '<div>';
                     gethtml += '<img src="'+ imagePath + response[i] +'" alt="" width="120" height="120">';
                     gethtml += '<div class="flex"><button><a href="'+ imagePath + response[i] +'" download="'+ response[i] +'" Downlaod</a>Downlaod </button></div>';
                     gethtml += '</div>';
                }
                $('#image-content').append(gethtml);
                $('.loader').hide();
                $('#magic-submit-button').removeAttr('disabled');
        },
        error: function(data) {
            var jsonData = JSON.parse(data.responseText)
            toastMixin.fire({
                title: jsonData.response.records.response ? jsonData.response.records.response : jsonData.response.status.message,
                icon: 'error'
              });
              $('.loader').hide();
              $('#magic-submit-button').removeAttr('disabled');
         }     
    });
});

$(document).ready(function () {
    $(".dropdown-click").on("click", function (event) {
        event.stopPropagation();
        $(".drop-down").slideToggle(200);
    });
});
$(document).ready(function(){
    $('.image-dropdown-click').on('click' , function(event){
        $(".drop-down").slideUp(200);
        event.stopPropagation();
        $(this).parent().find(".drop-down").slideToggle(200);
    });
});