function swordDepositor()
{
    setDepositLink()
}

function depositClick(event, element)
{
    event.preventDefault()
    
    $(element).parent()
        .html('<form><input type="file" id="file" name="depositfile">\
                <input id="uploadbutton" type="button" value="Upload"/>\
                </form><a href="" class="close">close</a>')
    
    $(".close").click(function(event) {
        closeClick(event, this)
    })
    
    $("#uploadbutton").click(function(event) {
        event.preventDefault()
        
        var file = $("#file")[0].files[0]
        var filename = $("#file").val()
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
    });
}

function closeClick(event, element)
{
    event.preventDefault()
    setDepositLink()
}

function setDepositLink()
{
    $('#sworddepositor')
        .html('<a href="" class="deposit">upload</a>')
    
    $('.deposit').click(function(event) {
        depositClick(event, this)
    })
}

function setUploadedLink(url)
{
    $('#sworddepositor')
        .html('<a href="' + url + '">download</a>')
}
