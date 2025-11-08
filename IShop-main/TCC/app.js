//Criar os requimentos para fazer a conexão com server e banco
const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');
const mysql = require('mysql2');
const cors = require('cors');
const { error } = require('console');

// Criar as rotas 
const app = express();
app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'public')));

//Para colocar dados na tabela
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


//Cria a conexão do banco de dados
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ATIVIDADE'
});

//Fazendo a tentativa de conexão banco
db.connect(err => {
    if(err){
        console.error('Error', err.message);
        return;
    }
    console.log('Sucesso');
})

//Puxa o html
app.get('/', (req,res)  => {
    res.sendFile(path.join(__dirname, 'public', 'main.html'));

})


//Login no site
app.post('/login', (req,res) =>{
    const {nome, senha} = req.body;
    const sql = 'SELECT * FROM LOGIN WHERE USUARIO = ?';

    db.query(sql, [nome], async (err,results) => {
        if(err) return res.status(500).json(err);

      if (results.length === 0) {
      return res.send('<script>alert("Usuário não encontrado!"); window.location.href="main.html";</script>');
     }

    const usuario = results[0];

    if ( senha !== usuario.SENHA) {
      return res.send('<script>alert("Senha incorreta!"); window.location.href="main.html";</script>');
    }

    
    res.send('<script>alert("Login realizado com sucesso!"); window.location.href="home.html";</script>');
  });
});

//Post - Cadastro de produto
app.post('/materials/create', (req,res) => {
    const {nome,fornecedor,quantidade,preco} = req.body;
    const sql = 'INSERT INTO PRODUTO (NOME, QUANTIDADE, FORNECEDOR, PRECO) VALUES (?,?,?,?)'

    db.query(sql, [nome,quantidade,fornecedor,preco], (err,results) => {
        if(err) {
            console.error('Erro ao inserir dados: ', err.message);
            return res.send('Erro ao salvar no banco.');
        }
        res.send('<script>alert("Dados Salvos com Sucesso!"); window.location.href="/home.html"</script>');
    })
});

//Colocar dados na tabela
app.get('/api/materials', (req,res) => {
    const sql = 'SELECT * FROM PRODUTO';
    db.query(sql, (err,results) => {
        if(err) {
            return res.status (500).json({error: 'Erro ao buscar ao banco'});
        }

        res.json(results);
    });
});

//Apagar dados da tabela
app.post('/materials/delete', (req,res) => {
    const {id} = req.body;
    const sql = 'DELETE FROM PRODUTO WHERE ID_PRODUTO = ?';
    db.query(sql, [id], (err,results) => {
        if(err){
            return res.status (500).json({error: 'Erro ao buscar ao banco'});
        }
        res.send('<script>alert("Dados Removidos com Sucesso!"); window.location.href="/home.html"</script>');
    })
});

//Enviar para página de edição
app.get('/materials/edit', (req,res) => {
    const id = parseInt(req.query.id);
    const sql = 'SELECT * FROM PRODUTO WHERE ID_PRODUTO =?';

    db.query(sql, [id], (err,results) => {
        if(err){
            console.error(err);
            return res.status(500).send('Erro banco');
        }
        if (results.length ===0) return res.status(404).send('Produto não encontrado');
        
        res.redirect(`/edit.html?id=${id}`);
    });
});

//Editar produtos
app.post('/materials/update', (req,res) => {
    const {id,nome,fornecedor,preco,quantidade} = req.body;
    const sql = 'UPDATE PRODUTO SET NOME =?, FORNECEDOR = ?, PRECO =? , QUANTIDADE =? WHERE ID_PRODUTO =?';

    db.query(sql, [nome,fornecedor,preco,quantidade,id], (err,results) => {
        if(err) {
            console.error(err);
            return res.status(500).send('Erro ao banco');
        }
        res.redirect('/home.html?status=sucess');
    });
});




app.get('/materials/search', (req,res) => {
    const {q} = req.query;
    const sql = 'SELECT * FROM PRODUTO WHERE NOME LIKE ?';

    db.query(sql, [`%${q}%`], (err,results) => {
        if(err){
            console.error(err);
            return res.status(500).send(err);
        }

        if (results.length === 0) {
            return res.send(`<script>alert("Nenhum produto encontrado"); window.location.href="/home.html";</script>`);
        }

        function removeSpecialChars(str) {
            if (!str) return '';
            return str.replace(/[^a-zA-Z0-9\s.,]/g, ''); 
            // mantém letras, números, espaços, ponto e vírgula
        }

        // Formatar cada produto em uma string simples
        const formatted = results.map(p => 
            `ID: ${p.ID_PRODUTO} | Nome: ${removeSpecialChars(p.NOME)} | Fornecedor: ${removeSpecialChars(p.FORNECEDOR)} | Preço: ${removeSpecialChars(p.PRECO)} | Quantidade: ${p.QUANTIDADE}`
        ).join('\n');

    return res.send(`<script>alert('${JSON.stringify(formatted)}'); window.location.href="/home.html";</script>`);
    });
});




// Fazer servidor rodar
app.listen(3300, () => {
    console.log('Servidor rodando em http://localhost:3300');
});