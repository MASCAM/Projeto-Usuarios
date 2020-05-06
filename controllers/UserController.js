class UserController {

    constructor(formId, tableId) {

        this.formEl = document.getElementById(formId);
        this.tableEl = document.getElementById(tableId);
        this.onSubmit();

    } //fechando o constructor()

    onSubmit() {

        this.formEl.addEventListener("submit", event => {

            event.preventDefault();
            let values = this.getValues();
            this.getPhoto((content) => {
                //passa essa função para ser executada no método
                values.photo = content;
                this.addLine(values);
                //quando o FileReader chama o callback ele passa o argumento para cá
                //no caso o arquivo lido, que então é armazenado em values.photo
            });
            
        
        });

    } //fechando onSubmit()

    getPhoto(callback) { //pois o JS não sabe o real caminho do arquivo
        //**Nota: Foi muito difícil entender tudo isso**/
        //recebe uma função para o retorno da API fileReader
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
            callback(fileReader.result);

        };
        fileReader.readAsDataURL(file); //permite a exibição da imagem na tela de cadastros

    } //fechando o getPhoto()

    getValues() {

        let user = {}; //notação de objeto (JSon)
        [...this.formEl.elements].forEach(function(field, index){ //reticências = Spread
            //abre todos os elementos do formulário num array
            if (field.name == "gender") {
        
                if (field.checked) {
        
                    user[field.name] = field.value;
                }
        
            } else {
        
                user[field.name] = field.value;
        
            }
        
        });
    
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

        this.tableEl.innerHTML = `
            <tr>
                        <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
                        <td>${dataUser.name}</td>
                        <td>${dataUser.email}</td>
                        <td>${dataUser.admin}</td>
                        <td>${dataUser.birth}</td>
                        <td>
                          <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                          <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                        </td>
                      </tr>
        `;
    
    } //fechando o addLine();

} //fechando a classe UserController()