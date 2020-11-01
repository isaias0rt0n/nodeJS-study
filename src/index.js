const { request, response } = require('express');
const express = require('express');
const { uuid, isUuid } = require('uuidv4');

const app = express();
app.use(express.json());

const projects = [];

function logRequests(request, response, next){
  const { method, url } = request;

  const logLabel = `${[method.toUpperCase()]} ${url}`;

  console.log(logLabel);

  return next(); //Proximo middleware
}

function validateProjectId(request, response, next){
  const { id } = request.params;

  if(!isUuid(id)){
    return response.status(400).json({error: 'Invalid project ID.'});
  }

  return next();
}

app.use(logRequests); //usa em todas os métodos
app.use('/projects/:id', validateProjectId);

/* GET - Busca informações do back-end */
//app.get('/projects', logRequests, (request, response) => //middleware em um unico método
app.get('/projects', logRequests, (request, response) => {
  const { title } = request.query;

  const results = title 
    ? projects.filter(project => project.title.includes(title)) : projects;
    //Se titulo foi preenchido pelo usuário, results é prenchida com o filtro passado(titulo)
    //Se title for vazio, preenche com todos os titulos

  return response.json(results);
});

/* POST - Cria uma informação no back-end */
app.post('/projects', (request, response) => {
  const {title, owner} = request.body;
  const project = { id: uuid(), title, owner };

  projects.push(project);
  return response.json(project);
});

/* PUT - Aletera uma informação no back-end */
app.put('/projects/:id', (request, response) => {
  const { id } = request.params;
  const {title, owner} = request.body;

  const projectIndex = projects.findIndex(project => project.id == id);

  /* Se não encontrou o index */
  if(projectIndex < 0){
    return response.status(400).json({ error: 'Project not found'})
  }

  const project = {id, title, owner};

  projects[projectIndex] = project;
  
  //retorna o preojeto atualizado e não a lista completa
  return response.json(project);
})

/* Deleta uma informação no back-end */
app.delete('/projects/:id', (request, response) => {
  const { id } = request.params;

  const projectIndex = projects.findIndex(project => project.id == id);

  /* Se não encontrou o index */
  if(projectIndex < 0){
    return response.status(400).json({ error: 'Project not found'})
  }

  projects.splice(projectIndex, 1) //remove informação do array (passando uma posição)

  return response.status(204).send()  //Quando é remoção retorna em branco son status 204
})

app.listen(3333, () => {
  console.log('✅✅back-end started✅✅');
});