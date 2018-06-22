function save_url() {
   var url = document.getElementById('vaddy-crawl-url').value;
   console.log(url);
}

document.getElementById("save").addEventListener("click", save_url);