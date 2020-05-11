class Utils {

    static dateFormat(date) { //método estático no qual não é preciso instanciar um objeto

        let hours = date.getHours().toString();
        let minutes = date.getMinutes().toString();
        if (minutes < 10) {

            minutes = '0' + minutes;

        }
        if (hours < 10) {

            hours = '0' + hours; //pois as funções getMinute e getHours retornam um inteiro não formatado

        }
        return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' '+ hours + ':' + minutes;

    }

}