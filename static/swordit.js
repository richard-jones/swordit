(function( $ ) {
    $.fn.swordit = function() {
        setDepositLink()
    };
})( jQuery );

function depositClick(event, element)
{
    event.preventDefault()
    
    $(element).parent()
        .html('<div style="border: 2px solid #7777ff; width: 250px; padding: 5px; background: #eeeeff">\
                SWORD IT!<br><form><input type="file" id="file" name="depositfile"><br>\
                <input id="uploadbutton" type="button" value="Upload"/>\
                <input class="close" type="button" value="Cancel">\
                </form></div>')
    
    $(".close").click(function(event) {
        closeClick(event, this)
    })
    
    $("#uploadbutton").click(function(event) {
        uploadClick(event, this)
    });
}

function uploadClick(event, element)
{
    event.preventDefault()
    
    var file = $("#file")[0].files[0]
    var filename = $("#file").val().substring("C:\\fakepath\\".length)
    $.ajax({
        url: "http://sword:sword@localhost:8080/col-uri/08b48e2d-7f33-4388-80d4-34ac385d9569",
        type: 'POST',
        data: file,
        processData: false,
        headers : {
            'Content-Type': 'application/octet-stream',
            'Packaging' : 'http://purl.org/net/sword/package/Binary',
            'Content-Disposition' : 'attachment; filename=' + filename
        },
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + $.base64.encode("sword:sword"))
        },
        statusCode : {
            201 : function(data) {
                    var deposit = $(data).find("link[rel='http://purl.org/net/sword/terms/originalDeposit']").attr('href')
                    setUploadedLink(deposit)
                }
        }
    })
}

function closeClick(event, element)
{
    event.preventDefault()
    setDepositLink()
}

function setDepositLink()
{
    $('#sworddepositor')
        .html('<form><input type="button" class="deposit" value="SWORD IT &gt;"></form>')
    
    $('.deposit').click(function(event) {
        depositClick(event, this)
    })
}

function setUploadedLink(url)
{
    $('#sworddepositor')
        .html('<a href="' + url + '">DOWNLOAD IT!</a>')
}
