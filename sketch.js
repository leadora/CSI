//Leadora Kyin
//CSI Project
//Missing: aggregate metrics
//--------------------------------------------------------------------------------------------------------

var lines;
var nopunct = [];
function setup() {
  noCanvas();
  createFileInput(gotFile, 'multiple');
  //console.log(RiTa.STOP_WORDS) 
}

function gotFile(file) {
  //var stopheader = "<table><tr><th>Stop Words</th></tr>";
  var nonstopheader = "<table><tr><th>Non Stop Words</th></tr>";
  var table3 = "<table><tr><th>Words</th><th>Occurences</th><th>Percentage</th></tr>";  //metrics for non stop words
  var table2 = "<table><tr><th>Word Count</th><th>Unique Words</th><th>Avg Word Length</th><th>Longest Word</th><th>Vocab Richness</th><th>Sentence Count</th><th>Char/Sentence</th><th>Words/Sentence</th></tr>";
  var table = "<table><tr><th>Words</th><th>Occurences</th><th>Percentage</th></tr>";   //metrics for stop words
  createDiv("<h1>" + file.name + ' ' + file.type + ' ' + file.size + 'bytes' + "</h1>");
  var div2 = createDiv();
  var div3 = createDiv();
  var div4 = createDiv();
  //var div5 = createDiv();
  
  if (file.type === 'image') {
    createImg(file.data);
  } else if (file.type === 'text') {
    var lines = splitTokens(file.data, '\r\n');
    var div = createDiv("concordancetable")
    var txt = join(lines, ' '); //one string
    var tokens = splitTokens(txt, " --,.?'!;:")   //tokens.length = word count
      //split string only if followed by non-whitespace characters
    var nopunct = splitTokens(txt, " --,.?'!;:");
    
    var longestword = "";           //longest word
    for(var i = 0; i < tokens.length; i++) {
      if(nopunct[i].length > longestword.length)
        longestword = nopunct[i];
    }
    
    var avgwordlength = nf((txt.length - tokens.length + 1 - lines.length) / tokens.length, 1, 2); //avg word length
    var concordance = {}; //empty object
    var keys = [];  //indv words (keys.length = unique words)
  
    var stop = {    //removing stop words
      ignoreStopWords: true,
      ignoreCase: true,
      ignorePunctuation: true
    };
    nonstopwords = RiTa.concordance(lines.join(" "), stop); //non stop word concordance
    //console.log(nonstopwords);
    
    for (var i = 0; i < tokens.length; i++) { // for each token
      var word = tokens[i].toLowerCase();
      if (concordance[word] === undefined) {
        concordance[word] = 1;
        keys.push(word);
      } else {
        concordance[word]++;
      }
    }

 //stop words vs non stop words 
    var nskeys = [];    //array of non stop keys
    for(var word in nonstopwords) {
      nskeys.push(word);
    }

    keys.sort(function(a, b) {                
      return (concordance[b] - concordance[a]);   //ordering concordance
    });
    
    nskeys.sort(function(a, b) {                
      return (concordance[b] - concordance[a]);   //ordering concordance
    });
    
    var vocabrichness = keys.length/tokens.length;  //vocab richness
    //(unique words / total words (%))
    
    var sentencecount = splitTokens(txt, ".?!").length-1  //sentence count
    
    var charsentence = nf((txt.length - tokens.length + 1 - lines.length)/(splitTokens(txt, ".?!").length-1), 1, 2);  //char per sentence
    
    
    var wordssentence = nf((tokens.length)/(splitTokens(txt, ".?!").length-1), 1, 2); //words per sentence
  
  
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------

//text metrics table for non stop words
    for (var i = 0; i < 20; i++) {
      //console.log(keys[i] + concordance[keys[i]]);
      table += ("<tr><td>" + nskeys[i] + "</td><td> " + (concordance[nskeys[i]]) + "</td><td> " + nf(concordance[nskeys[i]] / tokens.length * 100, 2, 2) + "%" + "</td></tr>")
    }
    div.html(table + "</table>")
    console.log(keys.length)
  
//text metrics table for stop words
    for (var i = 0; i < 20; i++) {
      //console.log(keys[i] + concordance[keys[i]]);
      table3 += ("<tr><td>" + keys[i] + "</td><td> " + (concordance[keys[i]]) + "</td><td> " + nf(concordance[keys[i]] / tokens.length * 100, 2, 2) + "%" + "</td></tr>")
    }
    div3.html(table3 + "</table><br>")
  //non stop words header
    div4.html(nonstopheader + "</table>")
    
//first table
    table2 += ("<tr><td>" + tokens.length + "</td><td> " + keys.length + "</td><td> " + avgwordlength + "</td><td> " + longestword +  "</td><td> " + nf(vocabrichness, 1, 2) + "%" + "</td><td> " + sentencecount + "</td><td> " + charsentence + "</td><td> " + wordssentence +"</td></tr>" )
    div2.html(table2 + "</table><br>")

//stop words header
    //div5.html(stopheader + "</table>")
    
//-----------------------------------------------------------------------------------------------
    console.log("Word count: " + tokens.length) //WORD COUNT

    //console.log(txt)    //one string containing all words
    console.log("Total number of characters: " + txt.length) //prints length of txt = total number of characters

    console.log("CHARACTER COUNT: ") //CHARCTER COUNT
    console.log("Including whitespace: " + (txt.length - lines.length + 1)) // total # char - 4 + 1
    console.log("Excluding whitespace: " + (txt.length - tokens.length + 1)) // total # char - # words + 1
      // +1 because each word is followed by a space, and the last word does not have a space following it
    console.log("Excluding punctuation: " + (txt.length - tokens.length + 1 - lines.length))

  }
}