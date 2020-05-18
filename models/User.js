class User {

    constructor(name, gender, birth, country, email, password, photo, admin) {

        this._id;
        this._name = name;
        this._gender= gender;
        this._birth = birth;
        this._country = country;
        this._email = email;
        this._password = password;
        this._photo = photo;
        this._admin = admin;
        this._register = new Date();

    }

    get id() {

        return this._id;

    }

    get register() {

        return this._register;

    }

    get name() {

        return this._name;

    }

    get gender() {

        return this._gender;

    }

    get birth() {

        return this._birth;

    }

    get country() {

        return this._country;

    }

    get email() {

        return this._email;

    }

    get password() {

        return this._password;

    }

    get photo() {

        return this._photo;

    }

    get admin() {

        return this._admin;

    }

    set photo(value) {

        this._photo = value;

    }

    loadFromJSON(json) { //método para carregar os valores de um JSON para dentro do objeto user

        for (let name in json) {

            switch(name) {

                case '_register':
                    this[name] = new Date(json[name]);
                    break;
                default:
                    this[name] = json[name];
    
            }

        }

    } //fechando o loadFromJSON()

    static getUsersStorage() { //método q retorna todos os usuários ja cadastrados na sessão

        let users = []; //para poder armazenar todas as chaves de usuários
        if (localStorage.getItem("users")) {  //para armazenar no navegador
            //se já haviam usuários cadastrados na sessão, importa eles para o array users
            users = JSON.parse(localStorage.getItem("users"))

        }
        /*if (sessionStorage.getItem("users")) {
            //se já haviam usuários cadastrados na sessão, importa eles para o array users
            users = JSON.parse(sessionStorage.getItem("users"))

        } */ //para armazenamento na sessão
        return users;

    } //fechando o getUsersStorage()

    getNewId() {

        if (!window.id) {
            
            window.id = 0; //criando a variável id na janela

        }
        id++; //incrementando o id
        return id; //retorna o id para ser armazenado no objeto usuário

    } //fechando o getNewId()

    save() {

        let users = User.getUsersStorage();
        if (this.id > 0) { //se o objeto ja possuir um id, procura ele dentro da array de usuários cadastrados

            users.map(u => {

                if (u._id == this.id) {

                    Object.assign(u, this) //substitui o objeto na array pelo atual

                }
                return u;

            });

        } else {

            this._id = this.getNewId();
            users.push(this); //coloca o objeto na array de users
            //sessionStorage.setItem("users", JSON.stringify(users)); //grava dados na sessão

        }
        localStorage.setItem("users", JSON.stringify(users)); //armazena no navegador
    
    } //fechando o save()

}