(function( $ ) {
    $.fn.swordit = function() {
        this.each(function() {
            $(this).append('<div id="sworddepositor"/>')
        })
        setDepositLink()
    };
})( jQuery );

function depositClick(event, element)
{
    event.preventDefault()
    
    // get the metadata to include in the deposit
    var title = $(".title").text()
    var abs = $(".abstract").text()
    var author = $(".author").text()
    
    $(element).parent()
        .html('<div style="border: 2px solid #7777ff; width: 250px; padding: 5px; background: #eeeeff">\
                SWORD IT!<br><form><input type="file" id="file" name="depositfile"><br>\
                <input id="uploadbutton" type="button" value="Upload"/>\
                <input class="close" type="button" value="Cancel"><br><br>\
                Title: <input type="text" id="deposit_title" value="' + title + '"><br>\
                Abstract: <input type="text" id="deposit_abstract" value="' + abs + '"><br>\
                Author: <input type="text" id="deposit_author" value="' + author + '"><br>\
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
    
    // first is to deposit the metadata
    depositMetadata(function (uri, webui) {
        depositFile(uri, webui)
    })
}

function depositFile(em_uri, webui_url)
{
    var file = $("#file")[0].files[0]
    var filename = $("#file").val().substring("C:\\fakepath\\".length)
    $.ajax({
        url: em_uri,
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
                    setUploaded(deposit, webui_url)
                }
        }
    })
}

function depositMetadata(callback)
{
    // get the metadata to include in the deposit
    var title = $("#deposit_title").val()
    var abs = $("#deposit_abstract").val()
    var author = $("#deposit_author").val()
    
    var xml = '<?xml version="1.0"?> \
                <entry xmlns="http://www.w3.org/2005/Atom" \
                        xmlns:dcterms="http://purl.org/dc/terms/"> \
                    <title>' + title + '</title> \
                    <id>urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a</id> \
                    <author><name>' + author + '</name></author> \
                    <summary type="text">' + abs + '</summary> \
                </entry>'
    $.ajax({
        url: "http://sword:sword@localhost:8080/col-uri/08b48e2d-7f33-4388-80d4-34ac385d9569",
        type: "POST",
        data: xml,
        dataType: 'xml',
        processData: false,
        headers : {
            'Content-Type': 'application/atom+xml;type=entry',
        },
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + $.base64.encode("sword:sword"))
        },
        statusCode : {
            201 : function(data) {
                    // alert(data)
                    var uri = $(data).find("link[rel='edit-media']").attr('href')
                    var webui = $(data).find("link[rel='alternate']").attr('href')
                    callback(uri, webui)
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

function setUploaded(file_url, web_url)
{
    $('#sworddepositor')
        .html('<a href="' + file_url + '">DOWNLOAD IT!</a> OR <a href="' + web_url + '">VISIT IT!</a>')
}
