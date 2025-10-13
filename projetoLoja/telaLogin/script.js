 document.getElementById('nome').innerText = "";
 document.getElementById('nome').innerText = "";

function entrar(){
    let nome = document.getElementById('nome').value;
    let senha = document.getElementById('senha').value;

    if(nome==="heitor" && senha==="1234"){
        window.location.href="../telaGeral/index.html"
    }
}