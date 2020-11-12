var title = 'документ';
var head_length = 0;
var body_length = 0;
var body_contents = [];
var body = [];

function makeDocument() {
    let frame = document.getElementById('html-doc');
    let doc = document.implementation.createHTMLDocument(title);

    for (var o = 0; o < body.length; o++) {
        var curr = body[o];
        var type = curr.substring(0, curr.indexOf('_'));
        var el = doc.createElement(type);
        el.innerHTML = curr.substring(type.length + 1, curr.length - (type.length - 2))
        try { doc.body.appendChild(el); }
        catch(e) { console.log(e); }
    }

    let destDocument = frame.contentDocument;
    let srcNode = doc.documentElement;
    let newNode = destDocument.importNode(srcNode, true);
    destDocument.replaceChild(newNode, destDocument.documentElement);
}

function checkifHTML(lines) {
    if (lines[0] === '<!доктип_гтря>_') {
        if (lines[1] === '<гтря>_' && lines[lines.length - 1] === '</гтря>') {
            checkHeadHTML(lines);
            checkBodyHTML(lines);
            body = translateBody(lines);
            makeDocument();
        }
    }
}

function checkHeadHTML(lines) {
    var head_ctn = [];
    var start = false;
    for (var j = 2; j < lines.length; j++) {
        if (lines[j].includes('<глава>') && !(lines[j].includes('</глава>'))) start = true;
        else if (lines[j].includes('</глава>')) break;
        else if (start === true) head_ctn.push(lines[j]);
    }
    for (var k = 0; k < head_ctn.length; k++) {
        head_ctn[k] = head_ctn[k].replace(/_/g, ' ').trim();
        if (head_ctn[k].includes('<заглавие>') && head_ctn[k].includes('</заглавие>')) {
            title = head_ctn[k].replace('<заглавие>', '').replace('</заглавие>', '');
        }
    }
    head_length = head_ctn.length;
}

function checkBodyHTML(lines) {
    var body_ctn = [];
    var strt = false;
    for (var l = head_length + 4; l < lines.length; l++) {
        if (lines[l].includes('<тело>') && !(lines[l].includes('</тело>'))) strt = true;
        else if (lines[l].includes('</тело>')) break;
        else if (strt === true) body_ctn.push(lines[l]);
    }
    for (var m = 0; m < body_ctn.length; m++) {
        body_ctn[m] = body_ctn[m].replace(/_/g, ' ').trim();
    }
    body_contents = body_ctn;
    body_length = body_ctn.length;
}

function translateBody(lines) {
    var cont = [];
    for (var n = 0; n < body_contents.length; n++) {
        var cur = body_contents[n];
        if (cur.substring(0, 3) === '<п>') cont.push('p_' + cur.substring(3, cur.length - 4));
        else if (cur.includes('<ч') && cur.includes('</ч')) cont.push('h' + cur[2] + '_' + cur.substring(4, cur.length - 5));
    }
    return cont;
}

function readSingleFIle(e) {
    var file = e.target.files[0];
    if (!file) { return; }
    var reader = new FileReader();
    reader.onload = function(e) {
        var contents = e.target.result;
        displayContents(contents);

        var lines = contents.split('\n');
        for (var i = 0; i < lines.length; i++) {
            lines[i] = lines[i].replace(/\s/g, '_');
        }
        checkifHTML(lines); 
    };
    reader.readAsText(file);
}

function displayContents(contents) {
    var element = document.getElementById('file-content');
    element.textContent = contents;
}
document.getElementById('file-input').addEventListener('change', readSingleFIle, false);
