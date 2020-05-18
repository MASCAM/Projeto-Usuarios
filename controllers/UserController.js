class UserController {

    constructor(formIdCreate, formIdUpdate, tableId) {

        this.formEl = document.getElementById(formIdCreate);
        this.formUpdateEl = document.getElementById(formIdUpdate);
        this.tableEl = document.getElementById(tableId);
        this.onSubmit();
        this.onEdit();

    } //fechando o constructor()

    onEdit() {

        document.querySelector("#box-user-update .btn-cancel").addEventListener("click", e => {

            this.showPanelCreate();

        });
        this.formUpdateEl.addEventListener("submit", event => {

            event.preventDefault();
            let btn = this.formUpdateEl.querySelector("[type=submit]");
            btn.disabled = true; //impede que o botão seja pressionado varias vezes
            let values = this.getValues(this.formUpdateEl);
            let index = this.formUpdateEl.dataset.trIndex;
            let tr = this.tableEl.rows[index];
            tr.dataset.user = JSON.stringify(values);
            tr.innerHTML = `
                        <td><img src="${values.photo}" alt="User Image" class="img-circle img-sm"></td>
                        <td>${values.name}</td>
                        <td>${values.email}</td>
                        <td>${(values.admin) ? 'Sim' : 'Não'}</td>
                        <td>${Utils.dateFormat(values.register)}</td>
                        <td>
                          <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                          <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                        </td>
                      </tr>
            `;
            this.addEventsTr(tr);
            this.updateCount();

        });

    } //fechando o onEdit()

    onSubmit() {

        this.formEl.addEventListener("submit", event => {

            event.preventDefault();
            let btn = this.formEl.querySelector("[type=submit]");
            btn.disabled = true; //impede que o botão seja pressionado varias vezes
            let values = this.getValues(this.formEl);
            if (!values) {

                return false;

            }
            this.getPhoto().then(
                //se resolve realiza a primeira função
                //se reject realiza a segunda no promise da getPhoto()
                (content) => {

                    values.photo = content;
                    this.addLine(values);
                    this.formEl.reset(); 
                    btn.disabled = false; //reseta o formulário e o botão submit

                }, 

                (e) => {

                    console.error(e);

                }

            ); 
        
        });

    } //fechando onSubmit()

    getPhoto() { //pois o JS não sabe o real caminho do arquivo
        //**Nota: Foi muito difícil entender tudo isso**/
        //recebe uma função para o retorno da API fileReader
        return new Promise((resolve, reject) => {
            //Promise é uma classe por isso precisa ser cirada
            //basicamente recebe uma função com dois argumentos que são duas funções
            //caso resolve realiza a primeira função
            //caso reject faz a segunda
            let fileReader = new FileReader();
            let elements = [...this.formEl.elements].filter(item => { //filtra nos elementos onde está o elemento
                //que se chama photo, se houver correspondência, retorna o item
                //para posteriormente ser manipulado
                if (item.name === 'photo') {
                    //a função filter filtra um array armazenando os itens procurados
                    //em um novo array
                    return item;

                }
            
            });
            let file = (elements[0].files[0]);
            fileReader.onload = () => {
                //após carregar o arquivo, realiza uma função
                resolve(fileReader.result);

            };
            fileReader.onerror = (e) => {

                reject(e);

            }
            if (file) {
                
                fileReader.readAsDataURL(file); //permite a exibição da imagem na tela de cadastros

            } else {

                resolve('dist/img/boxed-bg.jpg');

            }

        });
    
    } //fechando o getPhoto()

    getValues(formEl) {

        let user = {}; //notação de objeto (JSon)
        let isValid = true;
        [...formEl.elements].forEach(function(field, index){ //reticências = Spread
            //abre todos os elementos do formulário num array
            if (['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value) {
                //se qualquer um desses campos no if estiverem vazios, impede o envio do formulário
                field.parentElement.classList.add('has-error');
                //para colocar um indicador de erro no elemento acima do formulário (no html5)
                isValid = false;
                return false; // se o formulário for inválido cancela a operação

            }

            if (field.name == "gender") {
        
                if (field.checked) {
        
                    user[field.name] = field.value;

                }
        
            } else if (field.name == 'admin') {
                
                user[field.name] = field.checked;
                
            } else {
        
                user[field.name] = field.value;
        
            }
        
        });
        
        if (!isValid) {

            return false;

        }
        return new User(
            user.name, 
            user.gender, 
            user.birth, 
            user.country, 
            user.email, 
            user.password, 
            user.photo, 
            user.admin
        );

    } //fechando getValues()

    addLine(dataUser) {

        let tr = document.createElement('tr');
        tr.dataset.user = JSON.stringify(dataUser); //API JSON
        //stringify transforma os atributos em string
        tr.innerHTML = `
            <tr>
                        <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
                        <td>${dataUser.name}</td>
                        <td>${dataUser.email}</td>
                        <td>${(dataUser.admin) ? 'Sim' : 'Não'}</td>
                        <td>${Utils.dateFormat(dataUser.register)}</td>
                        <td>
                          <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                          <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                        </td>
                      </tr>
        `;
        this.addEventsTr(tr);
        this.tableEl.appendChild(tr);
        this.updateCount();
    
    } //fechando o addLine();

    addEventsTr(tr) {

        tr.querySelector(".btn-edit").addEventListener("click", e=>{

            let json = JSON.parse(tr.dataset.user);
            let form = document.querySelector("#form-user-update");
            form.dataset.trIndex = tr.sectionRowIndex;
            for (let name in json) { //para cada nome em json (laço para percorrer objetos)
                //seleciona cada um dos campos cujo nome está no json
                let field = form.querySelector("[name=" + name.replace("_", "") + "]"); 
                //pois o json separa os nomes dos atributos dos objetos com '_' numa string
                if (field) {   //só atribui o valor se o campo existir e possuir um valor
                
                    switch(field.type) {

                        case 'file': //se for uma foto passa pra próxima iteração
                            continue;
                            break;
                        case 'radio':
                            field = form.querySelector("[name=" + name.replace("_", "") + "][value=" + json[name] + "]");
                            field.checked = true;
                            break;
                        case 'checkbox':
                            field.checked = json[name];
                            break;
                        default:
                            field.value = json[name]; //json é uma espécie de objeto logo ele substitui o valor no formulário pelo valor do campo "variável nome" (são vários campos) do json

                    }

                 }

            }
            this.showPanelUpdate();

        });

    } //fechando o addEventsTr()

    showPanelCreate() {

        document.querySelector("#box-user-create").style.display = "block";
        document.querySelector("#box-user-update").style.display = "none";

    } //fechando o showPanelCreate()

    showPanelUpdate() {

        document.querySelector("#box-user-create").style.display = "none";
        document.querySelector("#box-user-update").style.display = "block";

    } //fechando o showPanelUpdate()

    updateCount() {

        let numberUsers = 0;
        let numberAdmin = 0;
        [...this.tableEl.children].forEach(tr => {

            numberUsers++;
            let user = JSON.parse(tr.dataset.user); //transforma a string JSON em objeto
            if (user._admin) {

                numberAdmin++;

            }

        });
        document.querySelector("#number-users").innerHTML = numberUsers;
        document.querySelector("#number-users-admin").innerHTML = numberAdmin;

    } //fechando o updateCount()

} //fechando a classe UserController()