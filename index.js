const express = require('express');//micro framework do node

const server = express(); //variavel para receber funcao do express

// server.get cria a requisicao getquando acessarem localhost:3000/teste

//informa ao express que ele tem que ler JSON no corpo das msgs POST
server.use(express.json());

//CRUD 

var cont = 0;

//criar vetor de usuarios
const projects = [{
  id: "0",
  title: "Novo projeto",
  tasks: ["Nova tarefa"]
},
{
  id: "1",
  title: "Novo projeto2",
  tasks: ["Nova tarefa2"]
},
{
  id: "2",
  title: "Novo projeto3",
  tasks: ["Nova tarefa3"]
}];

//cria um middleware global para chamar outras rotas
//tem que ser inserido antes dos outros metodos
//tambem esta sendo utilizado para contar o numero de vezes 
server.use((req, res, next)=>{
  //console.time('Request');
  console.log(`Metodo: ${req.method}; URL: ${req.url}`);
  console.log(`Funcoes chamadas ${cont+= 1} vezes`);//acresenta o contador
  //return next();
  next();

  //console.timeEnd('Request');
})

//funcao vericifa se o nome esta no corpo da msg
//inserir nos metodos POST e PUT o checkUserExists
function checkProjectExists(req, res, next){  
  if(!req.body.id || !req.body.title ){
    return res.status(400).json({ error: 'Project ID and Title are required'});
  }
  return next();
}

//funcao para verificar se o usuario existe
function checkProjectInArray(req, res, next){
  const { id } = req.params;

  const project = projects.find(project => project.id == id);

  if(!project){
    return res.status(400).json({ error: 'Project does not exist'});
  }

  //req.user = user;

  return next();
}

//retorna todos os projetos
server.get('/projects',(req, res)=>{
  return res.json(projects);
})


//digitando no navegador http://localhost:3030/users/3 onde 3 e o numero do user
server.get('/projects/:id',checkProjectInArray,(req, res)=>{

  const {id} = req.params;
  return res.json(projects[id]);
})

//cria uma rota POST para incluir um usuario na base de dados
server.post('/projects',checkProjectExists, (req, res)=>{
  //busca a variavel name do corpo da requisicao
  const {id, title, tasks} = req.body;
  const newProject ={
    id,
    title,
    tasks
  };
  projects.push(newProject);
  
  return res.json(projects);//sempre tem que retornar algo ou fica carregando eterno no navegador
})


//cria rota para editar usuario
server.put('/projects/:id',checkProjectInArray, (req, res)=>{
  const { id } = req.params;
  const { title } = req.body;
  const project = projects.find(p => p.id == id);
  project.title = title;
  return res.json(project);
})

//cria rota para deletar usuario
server.delete('/projects/:id',checkProjectInArray, (req, res)=>{
  const {id} = req.params;//busca o index do usuario no vetor
  projects.splice(id, 1);// faz realizar busca ate o indice informado e remover item
  return res.json(projects);
})

//coloca o servidor para escutar na porta 3030
server.listen(3030);


