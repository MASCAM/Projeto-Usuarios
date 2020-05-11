class UserController {

    constructor(formId, tableId) {

        this.formEl = document.getElementById(formId);
        this.tableEl = document.getElementById(tableId);
        this.onSubmit();

    } //fechando o constructor()

    onSubmit() {

        this.formEl.addEventListener("submit", event => {

            event.preventDefault();
            let btn = this.formEl.querySelector("[type=submit]");
            btn.disabled = true; //impede que o botão seja pressionado varias vezes
            let values = this.getValues();
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

    getValues() {

        let user = {}; //notação de objeto (JSon)
        let isValid = true;
        [...this.formEl.elements].forEach(function(field, index){ //reticências = Spread
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

    addLine(dataUser, tableId) {

        let tr = document.createElement('tr');
        tr.innerHTML = `
            <tr>
                        <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
                        <td>${dataUser.name}</td>
                        <td>${dataUser.email}</td>
                        <td>${(dataUser.admin) ? 'Sim' : 'Não'}</td>
                        <td>${Utils.dateFormat(dataUser.register)}</td>
                        <td>
                          <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                          <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                        </td>
                      </tr>
        `;
        this.tableEl.appendChild(tr);
    
    } //fechando o addLine();

} //fechando a classe UserController()